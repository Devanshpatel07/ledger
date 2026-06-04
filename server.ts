/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Set payload limits high enough for base64 camera scans and receipt photo uploads
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Initialize Gemini AI Client lazily & safely
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY" && apiKey.trim() !== "") {
      try {
        aiClient = new GoogleGenAI({
          apiKey: apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            }
          }
        });
      } catch (err) {
        console.error("Failed to initialize GoogleGenAI client:", err);
      }
    }
  }
  return aiClient;
}

// Highly intelligent local Regex and Keyword Fallback Parser for complete offline capability
function localFallbackParser(text: string): { amount: number; type: string; party: string; category: string; notes: string } {
  const normalized = text.toLowerCase();
  
  // 1. Amount Extraction (Finds decimal or regular numbers)
  const amountMatch = text.match(/(?:rs\.?|[\$£€₹]|\b(?:inr|usd|spent|paid|received|of)\b\s*)?(\d+(?:\.\d{1,2})?)/i) || 
                      text.match(/(\d+(?:\.\d{1,2})?)/);
  let amount = 0;
  if (amountMatch) {
    amount = parseFloat(amountMatch[1]);
  }

  // 2. Transaction Type detection
  let type = "Debit"; // Default to debit for spent
  const creditKeywords = ["received", "got", "income", "credit", "received from", "borrowed", "salary", "earned", "gained", "cash in"];
  const debitKeywords = ["spent", "paid", "lent", "gave", "dinner", "bought", "cost", "bill", "rent", "fee", "expense"];
  
  // Check which keyword occurs first or if there's an obvious credit trigger
  let creditScore = 0;
  let debitScore = 0;
  for (const cw of creditKeywords) {
    if (normalized.includes(cw)) creditScore++;
  }
  for (const dw of debitKeywords) {
    if (normalized.includes(dw)) debitScore++;
  }
  if (creditScore > debitScore) {
    type = "Credit";
  }

  // 3. Category matching
  let category = "Other";
  const categoryKeywords: { [key: string]: string[] } = {
    Dining: ["dinner", "lunch", "breakfast", "food", "cafe", "restaurant", "starbucks", "coffee", "mcdonalds", "subway", "pizza", "burger", "eat", "dining"],
    Groceries: ["grocery", "groceries", "supermarket", "walmart", "milk", "vegetables", "fruit", "store"],
    Rent: ["rent", "landlord", "apartment", "lease", "room"],
    Salary: ["salary", "stipend", "wages", "paycheck", "salary from"],
    Utilities: ["electricity", "power", "water", "gas", "wifi", "internet", "phone", "recharge", "bill", "utilities"],
    Travel: ["travel", "flight", "uber", "cab", "taxi", "train", "metro", "bus", "fuel", "petrol", "diesel", "gasoline", "ola"],
    Shopping: ["clothes", "shoes", "amazon", "shopping", "gift card", "mall", "jacket"],
    Entertainment: ["movie", "netflix", "spotify", "ticket", "game", "concert", "party", "club", "drinks", "pub"],
    Medical: ["doctor", "medicine", "pharmacy", "hospital", "clinic", "health", "dentist"],
    Gifts: ["gift", "present", "birthday", "donation", "charity"],
    Investment: ["shares", "stocks", "mutual fund", "crypto", "bitcoin", "gold", "deposit"],
  };

  for (const [cat, keywords] of Object.entries(categoryKeywords)) {
    for (const kw of keywords) {
      if (normalized.includes(kw)) {
        category = cat;
        break;
      }
    }
    if (category !== "Other") break;
  }

  // 4. Participant / Party Matching (usually preceded by 'with', 'to', 'from', 'by')
  let party = "Self";
  const partyPrepositions = [/\bwith\s+([a-zA-Z]+)/i, /\bto\s+([a-zA-Z]+)/i, /\bfrom\s+([a-zA-Z]+)/i, /\bby\s+([a-zA-Z]+)/i];
  for (const regex of partyPrepositions) {
    const match = text.match(regex);
    if (match && match[1]) {
      // Exclude prepositions or common stop words
      const candidate = match[1].trim();
      const lowercaseCandidate = candidate.toLowerCase();
      const stopwords = ["dinner", "lunch", "breakfast", "food", "rent", "uber", "starbucks", "amazon", "netflix", "spotify"];
      if (!stopwords.includes(lowercaseCandidate)) {
        party = candidate.charAt(0).toUpperCase() + candidate.slice(1);
        break;
      }
    }
  }

  // If "lent 500 to suraj", party is "Suraj"
  if (party === "Self") {
    const tokens = text.split(/\s+/);
    // Find Capitalized words that aren't the start word
    for (let i = 1; i < tokens.length; i++) {
      const token = tokens[i];
      if (/^[A-Z][a-z]+$/.test(token)) {
        const lowercaseToken = token.toLowerCase();
        const stopwords = ["spent", "paid", "received", "rent", "groceries", "starbucks", "amazon", "netflix", "spotify"];
        if (!stopwords.includes(lowercaseToken)) {
          party = token;
          break;
        }
      }
    }
  }

  // 5. Notes definition
  let notes = text;
  // Capitalize first letter of notes
  if (notes.length > 0) {
    notes = notes.charAt(0).toUpperCase() + notes.slice(1);
  }

  return { amount, type, party, category, notes };
}

// Endpoint to Parse smart ledger input
app.post("/api/parse-transaction", async (req, res) => {
  const { sentence } = req.body;

  if (!sentence || typeof sentence !== "string" || sentence.trim() === "") {
    return res.status(400).json({ error: "Invalid sentence" });
  }

  console.log(`Parsing input: "${sentence}"`);

  const gemini = getGeminiClient();

  if (!gemini) {
    console.log("No Gemini API key detected or error initialization. Running fallback local heuristics.");
    const parsed = localFallbackParser(sentence);
    return res.json({
      amount: parsed.amount,
      type: parsed.type,
      party: parsed.party,
      category: parsed.category,
      notes: parsed.notes,
      success: true,
      parserUsed: "Local Parsing Engine (Offline-First)"
    });
  }

  try {
    const systemPrompt = `You are an expert financial personal ledger parser.
Translate a raw transaction text into a structured JSON account ledger object.
You must return a structured JSON response matching the schema.

Important instructions:
1. Amount ('amount') must be a positive number.
2. Type ('type') must be exactly 'Credit' (meaning money came IN: received, got, salary, income, cash-in, borrow) or 'Debit' (meaning money went OUT: spent, paid, bought, gave, dinner, subscription, bills, lent).
3. Party ('party') must be the name of the recipient, sender, company, or participant. E.g. in 'Spent 500 on dinner with Arjun', party is 'Arjun'. In 'Paid Rs. 150 at Starbucks', party is 'Starbucks'. If no obvious third party is present, return 'Self'.
4. Category ('category') must be exactly one of: 'Dining', 'Groceries', 'Rent', 'Salary', 'Utilities', 'Shopping', 'Travel', 'Entertainment', 'Medical', 'Gifts', 'Investment', 'Other'. Choose the most relevant category.
5. Notes ('notes') must are the summary description context for the item (e.g. 'Dinner out with Arjun').`;

    const response = await gemini.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Parse this sentence: "${sentence}"`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            amount: {
              type: Type.NUMBER,
              description: "The positive value/cost of the transaction."
            },
            type: {
              type: Type.STRING,
              description: "Must be exactly 'Credit' or 'Debit'."
            },
            party: {
              type: Type.STRING,
              description: "The name of the participant, individual, business, or entity involved. Default to 'Self' if unknown."
            },
            category: {
              type: Type.STRING,
              description: "The category. Must be one of: 'Dining', 'Groceries', 'Rent', 'Salary', 'Utilities', 'Shopping', 'Travel', 'Entertainment', 'Medical', 'Gifts', 'Investment', 'Other'."
            },
            notes: {
              type: Type.STRING,
              description: "Short notes detailing the activity."
            }
          },
          required: ["amount", "type", "party", "category", "notes"]
        }
      }
    });

    if (!response.text) {
      throw new Error("No text response from Gemini API");
    }

    const structuredData = JSON.parse(response.text.trim());
    console.log("Structured parse output from Gemini:", structuredData);

    return res.json({
      amount: typeof structuredData.amount === "number" ? Math.abs(structuredData.amount) : 0,
      type: (structuredData.type === "Credit" || structuredData.type === "Debit") ? structuredData.type : "Debit",
      party: structuredData.party || "Self",
      category: structuredData.category || "Other",
      notes: structuredData.notes || sentence,
      success: true,
      parserUsed: "Gemini AI Parsing Engine"
    });

  } catch (error: any) {
    console.error("Gemini parse failed, falling back to local extractor:", error.message || error);
    
    // In case of any parser failure, fall back to the safe regex parser
    const parsed = localFallbackParser(sentence);
    return res.json({
      amount: parsed.amount,
      type: parsed.type,
      party: parsed.party,
      category: parsed.category,
      notes: parsed.notes,
      success: true,
      parserUsed: "Local Parsing Engine (Fallback)",
      fallbackNotice: true
    });
  }
});

// Endpoint to Scan and Parse transaction documents/ledgers from images
app.post("/api/scan-paper-ledger", async (req, res) => {
  const { imageBase64, mimeType } = req.body;

  if (!imageBase64 || typeof imageBase64 !== "string" || !mimeType) {
    return res.status(400).json({ error: "Missing imageBase64 or mimeType representation" });
  }

  console.log(`Scanning paper ledger image with MIME type: "${mimeType}"`);

  const gemini = getGeminiClient();

  if (!gemini) {
    console.log("No Gemini API key detected for multimodal parsing.");
    return res.status(400).json({
      error: "Cloud scanning is unavailable as no valid Gemini API key is configured in the environment. Please configure the GEMINI_API_KEY."
    });
  }

  try {
    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: imageBase64
      },
    };

    const systemPrompt = `You are an expert financial ledger OCR assistant.
Analyze the provided image of a receipt, handwritten log, invoice, statement, or transaction diary page.
Scan and extract all readable financial transactions from it.

We fully support and excel at reading Hindi bills, bilingual (Hindi-English) receipt printouts, Devanagari script, handwritten logs, or bilingual Hinglish logs. 
- Map currency/amount correctly, even if written with symbols like ₹, Rs., INR, or Devanagari numerals (१, २, ३) into standard numbers.
- Understand common Hindi billing vocabulary such as 'विवरण' (description), 'नाम' (name), 'राशि' / 'मूल्य' (amount/price), 'भुगतान' (paid), 'प्राप्त' / 'जमा' (received/credited), 'देय' (payable), 'कुल' (total), 'नकद' (cash), 'उधार' (credit/lent), 'खाता' (ledger), 'किराया' (rent), 'सब्जी'/'राशन' (groceries), 'यात्रा' (travel), 'दवा' (medical), etc.
- Type MUST be 'Credit' if keywords signifying receiving/inflow/gaining (e.g., प्राप्त, आया, जमा, मिला, got, received, repayment from) are detected.
- Type MUST be 'Debit' if keywords of spending/payment/outflow/debt (e.g., भुगतान, खर्च, दिया, चुकाया, paid, spent, expense, purchase, lent to) are detected.
- Notes should summarize the transaction clearly (you may translate Hindi item names/reasons into clear English notes e.g., 'Groceries bought' instead of 'सब्जी', or keep key words transliterated so they remain deeply recognizable to the user).

For each transaction, extract:
1. Amount ('amount'): High precision numbers representing the cost or value. MUST be a positive number.
2. Type ('type'): Must be exactly 'Credit' (money entry came in) or 'Debit' (money spent/lent out).
3. Party ('party'): Recipient or sender business name, person name, or entity. If none can be clearly seen or discerned, default to 'Self'.
4. Category ('category'): Must be exactly one of: 'Dining', 'Groceries', 'Rent', 'Salary', 'Utilities', 'Shopping', 'Travel', 'Entertainment', 'Medical', 'Gifts', 'Investment', 'Other'. Map to the closest matching option based on the vendor or purchase type.
5. Notes ('notes'): A descriptive text sum-up of what is seen on the paper for this entry (e.g. details, items bought, or purpose).
6. Date ('date'): Chronological date formatted as YYYY-MM-DD. If a specific year is missing but a month and day are present, assume the current calendar year (2026). If no date can be identified at all for the entry, default to the current date "2026-06-03".

Return your response as a structured JSON object with a 'transactions' array matching the specified schema.`;

    const response = await gemini.models.generateContent({
      model: "gemini-3.5-flash",
      contents: {
        parts: [
          imagePart,
          { text: "Extract all financial transaction details from this ledger or receipt/bill paper." }
        ]
      },
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            transactions: {
              type: Type.ARRAY,
              description: "Array of extracted transaction records.",
              items: {
                type: Type.OBJECT,
                properties: {
                  amount: { type: Type.NUMBER, description: "Currency positive amount." },
                  type: { type: Type.STRING, description: "Must be 'Credit' or 'Debit'." },
                  party: { type: Type.STRING, description: "Merchant, person, contact name or Self." },
                  category: { type: Type.STRING, description: "Category of transaction." },
                  notes: { type: Type.STRING, description: "Extra notes detailing the line item." },
                  date: { type: Type.STRING, description: "Date of transaction formatted as YYYY-MM-DD." }
                },
                required: ["amount", "type", "party", "category", "notes", "date"]
              }
            }
          },
          required: ["transactions"]
        }
      }
    });

    if (!response.text) {
      throw new Error("No text response from Gemini API scanning process.");
    }

    const parsedData = JSON.parse(response.text.trim());
    console.log("Successfully scanned and parsed image transactions:", parsedData);

    return res.json({
      transactions: Array.isArray(parsedData.transactions) ? parsedData.transactions : [],
      success: true
    });

  } catch (error: any) {
    console.error("Gemini image scanning failed:", error.message || error);
    return res.status(500).json({
      error: `Gemini image parsing failed: ${error.message || error}`
    });
  }
});

// Configure Vite middleware in development or regular client serving in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // SPA fallback
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
