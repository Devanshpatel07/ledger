/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BookOpen, Database, Cpu, Mic, ShieldAlert, Code, Check } from 'lucide-react';

export default function DeveloperDeck() {
  const [activeTab, setActiveTab] = useState<'privacy' | 'schema' | 'parser' | 'microphone'>('privacy');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const schemaCode = `// 1. DATABASE SCHEMA DEFINITION & DATA MODEL
// Structured TypeScript models representing the Local-First accounts ledger.
// Stores in IndexedDB or LocalStorage to keep financial records private.

export enum TransactionType {
  CREDIT = 'Credit', // Money received / earned / borrowed
  DEBIT = 'Debit',   // Money spent / paid / lent
}

export interface Transaction {
  id: string;        // Unique UUID / self-generated identifier
  timestamp: string; // ISO 8601 creation string (YYYY-MM-DDTHH:mm:ss.sssZ)
  amount: number;    // Absolute positive decimal value representing transaction volume
  type: TransactionType;
  party: string;     // Participant name (e.g. "Arjun", "Starbucks", "Dad", "Self")
  category: string;  // Category name (e.g. "Dining", "Groceries", "Rent", "Salary")
  notes: string;     // Description notes or speech raw transcript
}

// 2. EQUIVALENT SQLite / SQL SCHEMA (If scaling to SQLite via React Native or local storage)
/*
CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY,
  timestamp TEXT NOT NULL,
  amount REAL NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('Credit', 'Debit')),
  party TEXT DEFAULT 'Self',
  category TEXT DEFAULT 'Other',
  notes TEXT
);
CREATE INDEX IF NOT EXISTS idx_timestamp ON transactions(timestamp);
*/`;

  const parserCode = `// SMART INPUT NLP PARSING LOGIC
// Triggers via Express server using Gemini 3.5-Flash with Strict JSON response schemas.
// Runs fallback offline regex-matching logic when API key is missing.

// Server-side parsing endpoint implementation:
app.post("/api/parse-transaction", async (req, res) => {
  const { sentence } = req.body;
  const gemini = getGeminiClient();

  if (!gemini) {
    // FALLBACK: Heavy offline token matching heuristic
    const parsed = localFallbackParser(sentence);
    return res.json({ ...parsed, parserUsed: "Local Offline Engine" });
  }

  const systemPrompt = "Extract finance facts from text into Structured JSON.";
  const response = await gemini.models.generateContent({
    model: "gemini-3.5-flash",
    contents: \`Parse this sentence: "\${sentence}"\`,
    config: {
      systemInstruction: systemPrompt,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
         properties: {
           amount: { type: Type.NUMBER },
           type: { type: Type.STRING }, // 'Credit' | 'Debit'
           party: { type: Type.STRING },
           category: { type: Type.STRING },
           notes: { type: Type.STRING }
         },
         required: ["amount", "type", "party", "category", "notes"]
      }
    }
  });

  res.json(JSON.parse(response.text));
});`;

  const microphoneCode = `// INTEGRATING MICROPHONE SERVICE (WEB SPEECH API)
// Configures and mounts standard browser voice listening directly in client.

export function useSpeechRecognition(onResultCallback: (text: string) => void) {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    // Check compatibility with webkit prefix
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false; // Capture command lines one-by-one
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => setIsListening(true);
      rec.onend = () => setIsListening(false);
      rec.onerror = (e: any) => {
        console.error("Speech Recognition Error:", e);
        setIsListening(false);
      };
      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onResultCallback(transcript);
      };

      setRecognition(rec);
    }
  }, []);

  const toggleListen = () => {
    if (!recognition) return alert("Speech recognition not supported in this browser.");
    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  return { isListening, toggleListen };
}`;

  return (
    <div id="developer-deck-container" className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
      <div className="p-5 border-b border-zinc-800 bg-zinc-950 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            Developer Technical Specifications
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Read architectural justifications, schema structures, and smart parsing configurations.
          </p>
        </div>
        
        {/* Copy Indicator */}
        {copiedText && (
          <div className="px-3 py-1 bg-emerald-950 border border-emerald-800 text-emerald-400 rounded-lg text-xs flex items-center gap-1.5 animate-pulse">
            <Check className="w-3.5 h-3.5" />
            Copied {copiedText}!
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-800 overflow-x-auto scrollbar-none bg-zinc-900">
        <button
          id="btn-tab-privacy"
          onClick={() => setActiveTab('privacy')}
          className={`px-5 py-3 text-xs font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === 'privacy'
              ? 'text-emerald-400 border-emerald-500 bg-zinc-950/40'
              : 'text-zinc-400 border-transparent hover:text-zinc-200'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          Architecture & Privacy
        </button>
        <button
          id="btn-tab-schema"
          onClick={() => setActiveTab('schema')}
          className={`px-5 py-3 text-xs font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === 'schema'
              ? 'text-emerald-400 border-emerald-500 bg-zinc-950/40'
              : 'text-zinc-400 border-transparent hover:text-zinc-200'
          }`}
        >
          <Database className="w-4 h-4" />
          Data Schema
        </button>
        <button
          id="btn-tab-parser"
          onClick={() => setActiveTab('parser')}
          className={`px-5 py-3 text-xs font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === 'parser'
              ? 'text-emerald-400 border-emerald-500 bg-zinc-950/40'
              : 'text-zinc-400 border-transparent hover:text-zinc-200'
          }`}
        >
          <Cpu className="w-4 h-4" />
          Smart NLP Parser
        </button>
        <button
          id="btn-tab-microphone"
          onClick={() => setActiveTab('microphone')}
          className={`px-5 py-3 text-xs font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
            activeTab === 'microphone'
              ? 'text-emerald-400 border-emerald-500 bg-zinc-950/40'
              : 'text-zinc-400 border-transparent hover:text-zinc-200'
          }`}
        >
          <Mic className="w-4 h-4" />
          Voice Integration
        </button>
      </div>

      {/* Content Area */}
      <div className="p-6 bg-zinc-950/50 min-h-[340px]">
        {activeTab === 'privacy' && (
          <div className="space-y-4 text-sm text-zinc-300 leading-relaxed">
            <h3 className="font-bold text-zinc-100 text-base">Why Local-First is Best for Financial Accounts</h3>
            <p>
              A ledger monitors personal expenses, debts, salaries, and private social interactions. Hosting this on a public cloud server exposes sensitive financial behaviors to data breaches, advertising trackers, and third-party monetization.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                <span className="text-emerald-400 font-semibold text-xs uppercase tracking-wider block mb-1">Total Privacy</span>
                <p className="text-xs text-zinc-400 leading-normal">
                  Your ledgers are kept directly inside browser storage (IndexedDB / LocalStorage). No transactions are sent to a cloud database or personal logs.
                </p>
              </div>
              <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                <span className="text-emerald-400 font-semibold text-xs uppercase tracking-wider block mb-1">Sub-Millisecond Speed</span>
                <p className="text-xs text-zinc-400 leading-normal">
                  No network state latency means transaction creation, deletions, searches, and summaries re-trigger instantly in real-time.
                </p>
              </div>
              <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                <span className="text-emerald-400 font-semibold text-xs uppercase tracking-wider block mb-1">Offline Resilience</span>
                <p className="text-xs text-zinc-400 leading-normal">
                  The application remains 100% operational in areas with poor internet connection by deploying robust offline heuristic NLP parser modules.
                </p>
              </div>
            </div>
            <p className="text-xs text-zinc-400 pt-2 border-t border-zinc-900">
              * Note: While the ledger records remain strictly cached locally on your device, the natural-language command string is parsed through a secure Gemini AI backend endpoint returning simple structured JSON attributes, keeping your credentials invisible to the client.
            </p>
          </div>
        )}

        {activeTab === 'schema' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <p className="text-xs text-zinc-400 font-semibold">Ledger Object Representation (TypeScript / SQL SQLite):</p>
              <button
                id="btn-copy-schema"
                onClick={() => copyToClipboard(schemaCode, 'Schema')}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 cursor-pointer bg-zinc-900 hover:bg-zinc-800 px-2.5 py-1 rounded-md transition-colors"
              >
                <Code className="w-3.5 h-3.5" /> Copy Code
              </button>
            </div>
            <pre className="p-4 bg-zinc-950 border border-zinc-850 rounded-xl overflow-x-auto text-[11px] font-mono text-zinc-300 leading-5 whitespace-pre scrollbar">
              {schemaCode}
            </pre>
          </div>
        )}

        {activeTab === 'parser' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-zinc-400 font-semibold">Smart Entry Natural Language AI Engine Configuration:</p>
                <p className="text-[10px] text-zinc-500">Parses strings (e.g. "Sent 2500 for electric bill to landlord") yielding structured state data.</p>
              </div>
              <button
                id="btn-copy-parser"
                onClick={() => copyToClipboard(parserCode, 'Parser')}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 cursor-pointer bg-zinc-900 hover:bg-zinc-800 px-2.5 py-1 rounded-md transition-colors"
              >
                <Code className="w-3.5 h-3.5" /> Copy Code
              </button>
            </div>
            <pre className="p-4 bg-zinc-950 border border-zinc-850 rounded-xl overflow-x-auto text-[11px] font-mono text-zinc-300 leading-5 whitespace-pre scrollbar">
              {parserCode}
            </pre>
          </div>
        )}

        {activeTab === 'microphone' && (
          <div className="space-y-4 text-sm text-zinc-300 leading-relaxed">
            <h3 className="font-bold text-zinc-100 text-base">Browser Speech Recognition Integration</h3>
            <p>
              We integrate device microphone capture using the native browser <strong>Web Speech API</strong> (specifically WebkitSpeechRecognition). This does not stream raw audio data to third party cloud servers; transcription is processed natively on the user device and fed directly to the text parser bar.
            </p>
            <div className="p-4 bg-zinc-900 border-l-4 border-emerald-500 rounded-r-xl">
              <p className="text-xs font-semibold text-zinc-200">System Permissions Needed</p>
              <p className="text-xs text-zinc-400 mt-1">
                The application requests <strong>microphone permission</strong>. On Chrome, Safari, and Edge, speech transcription executes client-side. The resulting transcribed string is passed to our backend API as comfortable text values.
              </p>
            </div>
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-zinc-400 font-semibold">Custom React Hook Pattern Code:</p>
              <button
                id="btn-copy-mic"
                onClick={() => copyToClipboard(microphoneCode, 'Mic Hook')}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 cursor-pointer bg-zinc-900 hover:bg-zinc-800 px-2.5 py-1 rounded-md transition-colors"
              >
                <Code className="w-3.5 h-3.5" /> Copy Code
              </button>
            </div>
            <pre className="p-4 bg-zinc-950 border border-zinc-850 rounded-xl overflow-x-auto text-[11px] font-mono text-zinc-300 leading-5 whitespace-pre scrollbar">
              {microphoneCode}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
