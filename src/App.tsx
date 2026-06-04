/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Trash2, 
  Mic, 
  MicOff, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Sparkles, 
  Search, 
  Filter, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  User, 
  Users,
  ArrowLeft,
  Tag, 
  FileText, 
  Calendar, 
  RefreshCw,
  Info,
  X,
  PlusCircle,
  FolderOpen,
  CheckCircle,
  Code,
  Cloud,
  CloudUpload,
  CloudDownload,
  LogIn,
  LogOut,
  Lock,
  Sun,
  Moon,
  Languages,
  ExternalLink
} from 'lucide-react';

const TRANSLATIONS = {
  en: {
    // Header
    localSecure: "Local Secure ⚡",
    appTitle: "Finzy Ledger",
    viewSpecs: "View Specs",
    hideSpecs: "Hide Specs",
    resetData: "Reset Data",
    
    // Main Tabs
    cashFlowDashboard: "Cash Flow Dashboard",
    socialFriendDirectory: "Social Friend Directory",
    
    // Cloud backup stash
    cloudBackupStash: "Cloud Backup Stash ☁️",
    gdriveSecure: "G-Drive Secure",
    backupStashDesc: "Backup your active split ledger & list of mates instantly to your personal secure cloud storage. Safe, private, and fully controlled by you!",
    lastSynced: "✨ Last synced:",
    connectGDrive: "Connect Google Drive Sync",
    backupBtn: "Backup",
    restoreBtn: "Restore",
    wipeBackupBtn: "Wipe Backup",
    
    // Stats Bento
    netWalletPosition: "Net Wallet Position ⚡",
    surplus: "Surplus",
    deficit: "Deficit",
    aggregateDesc: "Aggregate balance calculated automatically across all active friends",
    totalMoneyIn: "Total Money In 🟢",
    moneyInflow: "Money Inflow",
    moneyInflowDesc: "Cumulative cash balance details and received splits",
    totalMoneyOut: "Total Money Out 🔴",
    outflowSum: "Outflow Sum",
    moneyOutflowDesc: "Splits lent or daily outlays tracked for food/living/entertainment",
    
    // AI Assistant Split injector
    aiSplitAssistant: "AI Split assistant & receipt scanner",
    aiAssistantDesc: "Type list items, dictate voice entries, or upload paper receipts to register split transactions chronologically with friends instantly.",
    casualTextBtn: "Casual Text or Voice Speech",
    multimodalBtn: "Multimodal Paper scan ocr",
    speakPrompt: "Listening actively... Speak now 🎙️",
    
    // Where does my money go?
    whereMoneyGo: "Where does my money go? 💸",
    noSpendLogged: "No spend records logged yet. Try typing a coffee or dining transaction in the active split box above first!",
    showingCategoryOutlay: "* Showing category outlay distributions of",
    
    // Active Wallet Check
    activeWalletCheck: "Active Wallet Check ⚡",
    moneyInflowEvents: "Money Inflow Events",
    moneyOutflowEvents: "Money Outflow Events",
    localSyncVault: "Local sync vault",
    privacyLock: "Privacy Lock",
    clientSideOnly: "✔ 100% Client-Side",
    
    // History Ledger Log
    splitHistoryLedger: "Split History Ledger 📂",
    showingRecordStats: "Showing {filtered} of {total} secure local records",
    searchLogsPlaceholder: "Search logs...",
    allTypes: "All Types",
    creditsOnly: "Credits Only",
    debitsOnly: "Debits Only",
    allCategories: "All Categories",
    noRecordsFilter: "No records found matching your filters",
    noRecordsFilterDesc: "Try adjusting your filters or typing a fresh split statement above.",
    confirmedLocal: "✔ Verified",
    deleteSplitRecord: "Delete split record",
    
    // Social Mates tab
    activeMates: "Social mates & portfolios",
    matesDesc: "Initialize profile portfolios for your flatmates, dining buddies, or travel groups to see net balances at a glance.",
    searchMatesPlaceholder: "Search mates...",
    mateNamePlaceholder: "Mate's name...",
    addMateBtn: "Add Mate",
    outstandingLabel: "Outstanding:",
    depositedLabel: "Deposited:",
    clearedLabel: "Cleared:",
    viewLedgerBtn: "View Ledger Page →",
    activeStatus: "Active",
    noPortfoliosMatch: "No personal portfolios match your search",
    noPortfoliosMatchDesc: "Add a profile name in the input box above to launch a new ledger page automatically.",
    
    // Ledger Page detail
    ledgerStanding: "Ledger Position standing",
    repaymentPending: "Pending repayment",
    debtPending: "Pending debt",
    clearedMutual: "Completely Cleared",
    owesYou: "{person} owes you this outstanding split amount.",
    youOwe: "You owe this outstanding split amount to {person}.",
    allSettled: "Awesome! All mutual accounts are settled perfectly.",
    myOutlays: "My outlays (Debits)",
    moneyLentOn: "Total money lent or spent on {person}",
    outlaysRegistered: "{count} outlays registered",
    repaymentsCredits: "Repayments (Credits)",
    repaymentsCleared: "Repayments cleared or income from them",
    settlementsRegistered: "{count} settlements registered",
    aiSplitAssistantFor: "AI Split Assistant for {person}",
    aiSplitAssistantPersonDesc: "Input casual comments specifically for {person}. The assistant will automatically associate the contact and split category.",
    inputPlaceholder: "e.g. Lent 400 for movie (Will force party association with {person})",
    submitRecord: "Add transaction record",
    goBackBtn: "Go back to directory ←",
    recentTransactionsWith: "Transactions Ledger with {person}",
    searchHistoryPlaceholder: "Search ledger...",
    deleteContactBtn: "Delete profile directory",
    deleteContactTitle: "Delete this entire contact profile and all histories from this directory"
  },
  hi: {
    // Header
    localSecure: "लोकल सुरक्षित ⚡",
    appTitle: "Finzy लेजर",
    viewSpecs: "विवरण देखें",
    hideSpecs: "विवरण छुपाएं",
    resetData: "रीसेट करें",
    
    // Main Tabs
    cashFlowDashboard: "कैश फ्लो डैशबोर्ड",
    socialFriendDirectory: "मित्र निर्देशिका 👥",
    
    // Cloud backup stash
    cloudBackupStash: "क्लाउड बैकअप संग्रह ☁️",
    gdriveSecure: "जी-ड्राइव सुरक्षित",
    backupStashDesc: "अपने सक्रिय स्प्लिट लेजर और दोस्तों की सूची को तुरंत अपने सुरक्षित क्लाउड स्टोरेज में बैकअप लें। सुरक्षित, निजी और पूरी तरह से आपके नियंत्रण में!",
    lastSynced: "✨ अंतिम सिंक समय:",
    connectGDrive: "गूगल ड्राइव सिंक जोड़ें",
    backupBtn: "बैकअप लें",
    restoreBtn: "रीस्टोर",
    wipeBackupBtn: "बैकअप मिटाएं",
    
    // Stats Bento
    netWalletPosition: "कुल वॉलेट स्थिति ⚡",
    surplus: "बचत (Surplus)",
    deficit: "घाटा (Deficit)",
    aggregateDesc: "सभी सक्रिय मित्रों में स्वचालित रूप से कुल शेष राशि",
    totalMoneyIn: "कुल जमा (In) 🟢",
    moneyInflow: "कैश आवक",
    moneyInflowDesc: "कुल प्राप्त पैसा और साझा खर्चों का ब्यौरा",
    totalMoneyOut: "कुल खर्च (Out) 🔴",
    outflowSum: "कैश निकासी",
    moneyOutflowDesc: "भोजन, रहने और मनोरंजन के लिए दिए गए पैसे",
    
    // AI Assistant Split injector
    aiSplitAssistant: "AI स्प्लिट असिस्टेंट और रसीद स्कैनर",
    aiAssistantDesc: "स्प्लिट लेन-देन को अपने दोस्तों के साथ तुरंत दर्ज करने के लिए टाइप करें, बोलें या रसीद अपलोड करें।",
    casualTextBtn: "सामान्य टेक्स्ट या आवाज",
    multimodalBtn: "पेपर स्कैन OCR 📄",
    speakPrompt: "सक्रिय रूप से सुन रहे हैं... अब बोलें 🎙️",
    
    // Where does my money go?
    whereMoneyGo: "मेरा पैसा कहाँ खर्च होता है? 💸",
    noSpendLogged: "अभी तक कोई खर्च रिकॉर्ड नहीं किया गया है। ऊपर दिए गए स्प्लिट बॉक्स में चाय या खाने का लेन-देन दर्ज करें!",
    showingCategoryOutlay: "* निम्नलिखित श्रेणियों में कुल वितरण दर्शाया गया है: ",
    
    // Active Wallet Check
    activeWalletCheck: "सक्रिय वॉलेट स्थिति ⚡",
    moneyInflowEvents: "कुल आवक लेन-देन",
    moneyOutflowEvents: "कुल खर्च लेन-देन",
    localSyncVault: "स्थानीय सुरक्षा",
    privacyLock: "गोपनीयता लॉक",
    clientSideOnly: "✔ 100% उपयोक्ता-स्तर",
    
    // History Ledger Log
    splitHistoryLedger: "स्प्लिट इतिहास लेजर 📂",
    showingRecordStats: "{total} में से {filtered} रिकॉर्ड सुरक्षित प्रदर्शित",
    searchLogsPlaceholder: "इतिहास खोजें...",
    allTypes: "सभी प्रकार",
    creditsOnly: "केवल जमा (Credits)",
    debitsOnly: "केवल खर्च (Debits)",
    allCategories: "सभी श्रेणियां",
    noRecordsFilter: "आपके फ़िल्टर के अनुसार कोई रिकॉर्ड नहीं मिला",
    noRecordsFilterDesc: "कृपया फ़िल्टर बदलें या ऊपर एक नया स्प्लिट विवरण दर्ज करें।",
    confirmedLocal: "✔ सत्यापित",
    deleteSplitRecord: "खर्च रिकॉर्ड हटाएं",
    
    // Social Mates tab
    activeMates: "मित्र और उनके खाते 👥",
    matesDesc: "अपने फ्लैटमेट्स, भोजन के साथियों या यात्रा समूहों के लिए प्रोफाइल खाते बनाएं ताकि आप एक नज़र में कुल शेष राशि देख सकें।",
    searchMatesPlaceholder: "मित्र खोजें...",
    mateNamePlaceholder: "मित्र का नाम...",
    addMateBtn: "मित्र जोड़ें",
    outstandingLabel: "बकाया:",
    depositedLabel: "दिया हुआ:",
    clearedLabel: "चुकाया:",
    viewLedgerBtn: "खाता देखें →",
    activeStatus: "सक्रिय",
    noPortfoliosMatch: "आपके द्वारा खोजा गया कोई मित्र नहीं मिला",
    noPortfoliosMatchDesc: "खाता शुरू करने के लिए ऊपर दिए गए बॉक्स में एक नया नाम जोड़ें।",
    
    // Ledger Page detail
    ledgerStanding: "खाता स्थिति",
    repaymentPending: "पुनर्भुगतान लंबित",
    debtPending: "उधार लंबित",
    clearedMutual: "पूरी तरह चुकता",
    owesYou: "{person} को आपको यह बकाया राशि लौटानी है।",
    youOwe: "आपको {person} को यह बकाया राशि लौटानी है।",
    allSettled: "बधाई हो! सभी आपसी खाते पूरी तरह संतुलित हैं।",
    myOutlays: "मेरे खर्च (Debits)",
    moneyLentOn: "{person} पर किया गया कुल खर्च या उधार दिया पैसा",
    outlaysRegistered: "{count} खर्च दर्ज",
    repaymentsCredits: "वापस प्राप्त (Credits)",
    repaymentsCleared: "वापस किए गए या प्राप्त पैसे",
    settlementsRegistered: "{count} भुगतान दर्ज",
    aiSplitAssistantFor: "{person} के लिए AI असिस्टेंट",
    aiSplitAssistantPersonDesc: "विशेष रूप से {person} के लिए विवरण दर्ज करें। असिस्टेंट स्वचालित रूप से इस खाते में लेन-देन जोड़ देगा।",
    inputPlaceholder: "जैसे: फिल्म के लिए 400 रुपये दिए ({person} के साथ स्वतः जुड़ जाएगा)",
    submitRecord: "दर्ज करें",
    goBackBtn: "मित्र सूची पर वापस जाएं ←",
    recentTransactionsWith: "{person} के साथ लेन-देन का ब्यौरा",
    searchHistoryPlaceholder: "लेन-देन खोजें...",
    deleteContactBtn: "मित्र प्रोफ़ाइल हटाएं",
    deleteContactTitle: "इस मित्र और उनके सभी लेन-देन इतिहास को पूरी तरह मिटाएं"
  }
};
import { Transaction, TransactionType, SmartParseResult } from './types';
import DeveloperDeck from './components/DeveloperDeck';
import { 
  initAuth, 
  loginWithGoogle, 
  logoutWithGoogle, 
  saveToGoogleDrive, 
  loadFromGoogleDrive, 
  deleteBackupFromGoogleDrive,
  BackupPayload 
} from './lib/googleDrive';

// Initial demo transaction seeds
const DEMO_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    amount: 500,
    type: TransactionType.DEBIT,
    party: 'Arjun',
    category: 'Dining',
    notes: 'Spent 500 on dinner with Arjun'
  },
  {
    id: 'tx-2',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    amount: 1500,
    type: TransactionType.DEBIT,
    party: 'Landlord',
    category: 'Rent',
    notes: 'Paid monthly rent fraction to Landlord'
  },
  {
    id: 'tx-3',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    amount: 85000,
    type: TransactionType.CREDIT,
    party: 'Google Inc',
    category: 'Salary',
    notes: 'Received tech monthly salary stipend'
  },
  {
    id: 'tx-4',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    amount: 120,
    type: TransactionType.DEBIT,
    party: 'Starbucks',
    category: 'Dining',
    notes: 'Morning double-shot macchiato with mocha'
  },
  {
    id: 'tx-5',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
    amount: 250,
    type: TransactionType.CREDIT,
    party: 'Siddharth',
    category: 'Other',
    notes: 'Recovered loan back from Siddharth'
  },
];

export default function App() {
  // Local persistent theme and language state
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('finzy_ledger_theme') as 'dark' | 'light') || 'dark';
  });
  const [lang, setLang] = useState<'en' | 'hi'>(() => {
    return (localStorage.getItem('finzy_ledger_lang') as 'en' | 'hi') || 'en';
  });

  // Persist selections
  useEffect(() => {
    localStorage.setItem('finzy_ledger_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('finzy_ledger_lang', lang);
  }, [lang]);

  // Translate helper function
  const t = (key: keyof typeof TRANSLATIONS.en, variables?: Record<string, string | number>) => {
    const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
    let text = (dict as any)[key] || (TRANSLATIONS.en as any)[key] || key;
    if (variables) {
      Object.entries(variables).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v));
      });
    }
    return text;
  };

  // Local persistent ledger state
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('personal_ledger_transactions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        console.error('Failed to parse cached actions:', err);
      }
    }
    return DEMO_TRANSACTIONS;
  });

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('personal_ledger_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Form states
  const [smartInput, setSmartInput] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [parserNotice, setParserNotice] = useState<string | null>(null);

  // Multimodal Image Scanning states
  const [smartInputMode, setSmartInputMode] = useState<'text' | 'scan'>('text');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isScanningImage, setIsScanningImage] = useState(false);
  const [scannedTxs, setScannedTxs] = useState<any[]>([]);
  const [showScanSuccessModal, setShowScanSuccessModal] = useState(false);

  // Manual Adjust Modal/Review states 
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState<SmartParseResult>({
    amount: 0,
    type: TransactionType.DEBIT,
    party: 'Self',
    category: 'Other',
    notes: '',
    success: false
  });

  // Manual Creation Fields
  const [manualAmount, setManualAmount] = useState<number>(0);
  const [manualType, setManualType] = useState<TransactionType>(TransactionType.DEBIT);
  const [manualParty, setManualParty] = useState('');
  const [manualCategory, setManualCategory] = useState('Other');
  const [manualNotes, setManualNotes] = useState('');

  // Custom dialog overrides for sandboxed iframe compliance (avoids browser alert & confirm blocking policies)
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    cancelText: string;
    isDestructive: boolean;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    isDestructive: false,
    onConfirm: () => {}
  });

  const [alertDialog, setAlertDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  }>({
    isOpen: false,
    title: '',
    message: ''
  });

  const triggerConfirm = (
    title: string,
    message: string,
    onConfirm: () => void,
    options?: { confirmText?: string; cancelText?: string; isDestructive?: boolean }
  ) => {
    setConfirmDialog({
      isOpen: true,
      title,
      message,
      confirmText: options?.confirmText || 'Confirm',
      cancelText: options?.cancelText || 'Cancel',
      isDestructive: options?.isDestructive ?? false,
      onConfirm: () => {
        onConfirm();
        setConfirmDialog(p => ({ ...p, isOpen: false }));
      }
    });
  };

  const triggerAlert = (title: string, message: string) => {
    setAlertDialog({
      isOpen: true,
      title,
      message
    });
  };

  // Speech Recognition States
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterType, setFilterType] = useState<string>('All');
  const [showDeveloperLogs, setShowDeveloperLogs] = useState(false);

  // View tabs & Person specific states
  const [activeMainTab, setActiveMainTab] = useState<'dashboard' | 'people'>('dashboard');
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
  const [customPeople, setCustomPeople] = useState<string[]>(() => {
    const saved = localStorage.getItem('personal_ledger_custom_people');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        console.error('Failed to parse cached people names:', err);
      }
    }
    return ['Arjun', 'Siddharth', 'Landlord', 'Dad'];
  });
  const [newPersonName, setNewPersonName] = useState('');
  const [searchContactQuery, setSearchContactQuery] = useState('');
  const [personSmartInput, setPersonSmartInput] = useState('');
  const [isPersonParsing, setIsPersonParsing] = useState(false);

  // Save to localStorage on change for custom people list
  useEffect(() => {
    localStorage.setItem('personal_ledger_custom_people', JSON.stringify(customPeople));
  }, [customPeople]);

  // Google Drive & Auth state management
  const [googleUser, setGoogleUser] = useState<any>(null);
  const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncNotice, setSyncNotice] = useState<{ type: 'success' | 'ref' | 'error'; text: string } | null>(null);
  const [lastSyncChecked, setLastSyncChecked] = useState<string | null>(() => localStorage.getItem('personal_ledger_last_sync'));

  // Sync state initialization with Google cloud provider
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setGoogleUser(user);
        setGoogleAccessToken(token);
      },
      () => {
        setGoogleUser(null);
        setGoogleAccessToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // Speech API Setup
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError(null);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error code:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setSpeechError('Microphone permission blocked. Please enable browser permissions or use the mock speaking demo triggers.');
        } else {
          setSpeechError(`Speech error: ${event.error}`);
        }
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setSmartInput(transcript);
          // Auto trigger parsing
          handleSmartParse(transcript);
        }
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // Handle Speech Toggle
  const toggleSpeechRecognition = () => {
    if (!recognitionRef.current) {
      setSpeechError("Speech recognition API isn't fully supported in this browser. Try our quick speech triggers below!");
      return;
    }

    try {
      if (isListening) {
        recognitionRef.current.stop();
      } else {
        setSpeechError(null);
        recognitionRef.current.start();
      }
    } catch (e: any) {
      console.error(e);
      setIsListening(false);
    }
  };

  // Submit parse payload to backend AI engine
  const handleSmartParse = async (textToParse: string) => {
    const text = textToParse || smartInput;
    if (!text.trim()) return;

    setIsParsing(true);
    setParserNotice(null);

    try {
      const response = await fetch('/api/parse-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sentence: text }),
      });

      if (!response.ok) {
        throw new Error('API processing error');
      }

      const parsed = await response.json();
      console.log('Parsed API Result:', parsed);

      // Map response fields safely
      const parsedAmount = typeof parsed.amount === 'number' ? parsed.amount : parseFloat(parsed.amount) || 0;
      const parsedType = parsed.type === 'Credit' ? TransactionType.CREDIT : TransactionType.DEBIT;

      setReviewData({
        amount: parsedAmount,
        type: parsedType,
        party: parsed.party || 'Self',
        category: parsed.category || 'Other',
        notes: parsed.notes || text,
        success: true
      });

      // Synchronize back to fine-tune states
      setManualAmount(parsedAmount);
      setManualType(parsedType);
      setManualParty(parsed.party || 'Self');
      setManualCategory(parsed.category || 'Other');
      setManualNotes(parsed.notes || text);

      setParserNotice(parsed.parserUsed || 'Smart NLP Parser');
      setShowReviewModal(true);

    } catch (error) {
      console.warn('Backend parsing error, initializing local fallback:', error);
      // Fallback local heuristic
      const cleanLower = text.toLowerCase();
      const amountMatch = cleanLower.match(/(\d+)/);
      const parsedAmount = amountMatch ? parseInt(amountMatch[1], 10) : 0;
      const isCredit = cleanLower.includes('received') || cleanLower.includes('got') || cleanLower.includes('credit') || cleanLower.includes('salary');

      const localResult: SmartParseResult = {
        amount: parsedAmount,
        type: isCredit ? TransactionType.CREDIT : TransactionType.DEBIT,
        party: cleanLower.includes('with') ? 'Parties' : 'Self',
        category: 'Other',
        notes: text,
        success: true
      };

      setReviewData(localResult);
      setManualAmount(localResult.amount);
      setManualType(localResult.type);
      setManualParty(localResult.party);
      setManualCategory(localResult.category);
      setManualNotes(localResult.notes);

      setParserNotice('Local Match Engine (Offline-First)');
      setShowReviewModal(true);
    } finally {
      setIsParsing(false);
    }
  };

  const clickTemplateTrigger = (text: string) => {
    setSmartInput(text);
    handleSmartParse(text);
  };

  const getAvatarColor = (name: string): string => {
    const colors = [
      'from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/20',
      'from-blue-500/20 to-indigo-500/10 text-blue-400 border-blue-500/20',
      'from-amber-500/20 to-orange-500/10 text-amber-400 border-amber-500/20',
      'from-fuchsia-500/20 to-rose-500/10 text-fuchsia-400 border-fuchsia-500/20',
      'from-violet-500/20 to-purple-500/10 text-violet-400 border-violet-500/20',
      'from-cyan-500/20 to-teal-500/10 text-cyan-400 border-cyan-500/20'
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const idx = Math.abs(hash) % colors.length;
    return colors[idx];
  };

  // Handle manual image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setImagePreviewUrl(url);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleImageDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      // Only process image files
      if (file.type.startsWith('image/')) {
        setSelectedImage(file);
        const url = URL.createObjectURL(file);
        setImagePreviewUrl(url);
      } else {
        triggerAlert("Invalid File", "Please drop an image file (PNG, JPG, or WEBP).");
      }
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
      setImagePreviewUrl(null);
    }
    setScannedTxs([]);
  };

  // Convert File object to Base64 string safely
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        } else {
          reject(new Error("Failed to convert image to base64 string"));
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  // Scan and directly insert parsed transactions to local database
  const handleScanImage = async () => {
    if (!selectedImage) return;

    setIsScanningImage(true);
    setScannedTxs([]);

    try {
      const base64Data = await fileToBase64(selectedImage);
      const mimeType = selectedImage.type;

      const response = await fetch('/api/scan-paper-ledger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64Data, mimeType }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to scan paper');
      }

      const data = await response.json();
      const rawExtracted: any[] = data.transactions || [];

      if (rawExtracted.length === 0) {
        triggerAlert("No Records Found", "Gemini scanned the document successfully but did not detect any readable transaction logs. Ensure the image text is clear and readable.");
        return;
      }

      // Convert scanned transactions into matching ledger types
      const processedRecords: Transaction[] = rawExtracted.map((item: any, idx) => {
        const cleanAmount = typeof item.amount === 'number' ? Math.abs(item.amount) : parseFloat(item.amount) || 0;
        const cleanType = item.type === 'Credit' ? TransactionType.CREDIT : TransactionType.DEBIT;
        const cleanParty = item.party || 'Self';
        const cleanCategory = categoriesList.includes(item.category) ? item.category : 'Other';
        const cleanNotes = item.notes || `Scanned entry from document`;
        
        // Date parsing with timezone support and clean local time
        let timestamp = new Date().toISOString();
        if (item.date && /^\d{4}-\d{2}-\d{2}$/.test(item.date)) {
          timestamp = `${item.date}T12:00:00.000Z`; // Safe default mid-day UTC offset
        }

        return {
          id: `scan-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 5)}`,
          amount: cleanAmount,
          type: cleanType,
          party: cleanParty,
          category: cleanCategory,
          notes: cleanNotes,
          timestamp: timestamp
        };
      });

      // Automatically prepends/injects transactions on the ledger ("automatically add on the ledger date wise" as requested!)
      // Since sortedTransactions sorts chronologically descending dynamically in UI,
      // they will immediately slide into their correct historical/date timeline!
      setTransactions(prev => [...processedRecords, ...prev]);

      // Open verification modal
      setScannedTxs(processedRecords);
      setShowScanSuccessModal(true);

      // Reset image state
      removeSelectedImage();

    } catch (error: any) {
      console.error('OCR Scanning Error:', error);
      triggerAlert("Analysis Failed", error.message || "An unexpected error occurred while communicating with the document scanner.");
    } finally {
      setIsScanningImage(false);
    }
  };

  // Save the reviewed draft transaction to local-first database
  const saveTransaction = () => {
    if (manualAmount <= 0) {
      triggerAlert("Invalid Amount", "Please enter a valid positive decimal currency amount.");
      return;
    }

    const newTx: Transaction = {
      id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toISOString(),
      amount: Number(manualAmount),
      type: manualType,
      party: manualParty.trim() || 'Self',
      category: manualCategory,
      notes: manualNotes.trim() || 'No description notes provided'
    };

    setTransactions(prev => [newTx, ...prev]);
    // Reset smart input and close modal
    setSmartInput('');
    setShowReviewModal(false);
    setParserNotice(null);
  };

  // Delete transaction from storage
  const deleteTransaction = (id: string) => {
    triggerConfirm(
      "Confirm Deletion",
      "Are you sure you want to permanently delete this transaction ledger record? This will permanently wipe it from local memory.",
      () => {
        setTransactions(prev => prev.filter(tx => tx.id !== id));
      },
      { confirmText: "Delete", isDestructive: true }
    );
  };

  // Delete entire local ledger state (user-facing safety controls)
  const handleDeleteLocalLedger = () => {
    triggerConfirm(
      "Destructive Operation: Delete Local Ledger",
      "Are you absolutely certain you want to WIPE your entire local ledger? This will permanently erase all transaction records and clear your people & contacts profiles from local storage. THIS ACTION CANNOT BE UNDONE.",
      () => {
        setTransactions([]);
        setCustomPeople([]);
        setSelectedPerson(null);
        setSyncNotice({ type: 'success', text: 'Local ledger records and contacts directory completely wiped!' });
        triggerAlert("Ledger Wiped", "Your entire local ledger database and contacts directory have been successfully cleared.");
      },
      { confirmText: "Delete All Local Data", isDestructive: true }
    );
  };

  // Delete cloud backup file from Google Drive
  const handleDeleteCloudBackup = async () => {
    if (!googleAccessToken) {
      triggerAlert("Auth Required", "Please sign in with Google first to access your cloud backup.");
      return;
    }

    triggerConfirm(
      "Confirm Cloud Backup Deletion",
      "This will permanently delete your 'personal_ledger_backup.json' file from Google Drive storage. This action is irreversible. Do you wish to continue?",
      async () => {
        setIsSyncing(true);
        setSyncNotice(null);
        try {
          const deleted = await deleteBackupFromGoogleDrive(googleAccessToken);
          if (deleted) {
            setSyncNotice({ type: 'success', text: "Successfully deleted 'personal_ledger_backup.json' from your Google Drive!" });
            triggerAlert("Cloud Backup Deleted", "The backup file has been completely and permanently removed from your Google Drive folder.");
          } else {
            setSyncNotice({ type: 'ref', text: "No existing backup file was found in your Google Drive to delete." });
            triggerAlert("No Backup Found", "No personal_ledger_backup.json file was found in your Google Drive sandboxed space.");
          }
        } catch (err: any) {
          console.error('Delete backup failure:', err);
          setSyncNotice({ type: 'error', text: `Delete failed: ${err.message || err}` });
          triggerAlert("Deletion Error", `Failed to delete the backup file: ${err.message || err}`);
        } finally {
          setIsSyncing(false);
        }
      },
      { confirmText: "Delete Backup From Cloud", isDestructive: true }
    );
  };


  const handleGoogleLogin = async () => {
    try {
      setIsSyncing(true);
      setSyncNotice(null);
      const res = await loginWithGoogle();
      if (res) {
        setGoogleUser(res.user);
        setGoogleAccessToken(res.accessToken);
        setSyncNotice({ type: 'success', text: `Access approved: Connected as ${res.user.displayName || res.user.email}` });
      }
    } catch (err: any) {
      console.error('Google alignment failure:', err);
      const isIframe = window.self !== window.top;
      let errorMsg = 'Authentication failed. Please check browser popups & Drive permission access.';
      
      const isPopupClosed = err.code === 'auth/popup-closed-by-user' || 
                            err.message?.includes('popup-closed-by-user') || 
                            err.message?.includes('closed-by-user') ||
                            String(err).includes('popup-closed-by-user');
      
      if (isPopupClosed) {
        if (isIframe) {
          errorMsg = 'Google sign-in popup was closed or got blocked. Inside the editor iframe, browser security settings block the popup authentication cookie channel. To sync safely, click "Open App in New Tab" below and then click Connect Google Drive!';
        } else {
          errorMsg = 'Google sign-in popup was closed or blocked. Please make sure to allow popups in your browser and keep the login window open until completed.';
        }
      } else {
        errorMsg += ` Detail: ${err.message || err}`;
      }
      
      setSyncNotice({ 
        type: 'error', 
        text: errorMsg 
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleBackupToDrive = async () => {
    if (!googleAccessToken) {
      triggerAlert("Auth Required", "Please sign in with Google first to backup your active ledger.");
      return;
    }

    triggerConfirm(
      "Confirm Cloud Backup Sync",
      "Ready to update your Google Drive backup with your current local ledger data? All local transaction history and contact profiles will be securely written into a 'personal_ledger_backup.json' file.",
      async () => {
        setIsSyncing(true);
        setSyncNotice(null);
        try {
          const payload: BackupPayload = {
            transactions,
            customPeople,
            backupTime: new Date().toISOString()
          };
          const result = await saveToGoogleDrive(googleAccessToken, payload);
          const timeStr = new Date().toLocaleString();
          setLastSyncChecked(timeStr);
          localStorage.setItem('personal_ledger_last_sync', timeStr);
          setSyncNotice({ 
            type: 'success', 
            text: result.updated 
              ? `Successfully updated existing Cloud backup! (${timeStr})` 
              : `Successfully created a new Cloud backup file! (${timeStr})` 
          });
          triggerAlert("Backup Successful", "Your ledger state has been securely written to your private Google Drive space.");
        } catch (err: any) {
          console.error('Backup failure:', err);
          setSyncNotice({ type: 'error', text: `Backup failed: ${err.message || err}` });
          triggerAlert("Backup Failed", `Error backing up your records: ${err.message || err}`);
        } finally {
          setIsSyncing(false);
        }
      },
      { confirmText: "Backup Now" }
    );
  };

  const handleRestoreFromDrive = async () => {
    if (!googleAccessToken) {
      triggerAlert("Auth Required", "Please sign in with Google first to restore your cloud ledger.");
      return;
    }

    triggerConfirm(
      "Warning: Restore Cloud Backup",
      "Restoring will completely OVERWRITE your local transaction database and profile custom categories with the backup found on Google Drive. This cannot be undone once started. Do you want to proceed?",
      async () => {
        setIsSyncing(true);
        setSyncNotice(null);
        try {
          const payload = await loadFromGoogleDrive(googleAccessToken);
          if (!payload) {
            setSyncNotice({ type: 'ref', text: "No existing 'personal_ledger_backup.json' file found in your Google Drive." });
            triggerAlert("No Backup Found", "Could not find any existing 'personal_ledger_backup.json' file in your Google Drive cloud space. Try making a backup first!");
            return;
          }

          if (payload.transactions) {
            setTransactions(payload.transactions);
          }
          if (payload.customPeople) {
            setCustomPeople(payload.customPeople);
          }

          const timeStr = payload.backupTime ? new Date(payload.backupTime).toLocaleString() : new Date().toLocaleString();
          setLastSyncChecked(timeStr);
          localStorage.setItem('personal_ledger_last_sync', timeStr);
          setSyncNotice({ type: 'success', text: `Ledger restore complete! Loaded cloud backup from ${timeStr}` });
          triggerAlert("Restore Successful", `Successfully restored ${payload.transactions?.length || 0} transaction records and ${payload.customPeople?.length || 0} contacts from Google Drive.`);
        } catch (err: any) {
          console.error('Download failure:', err);
          setSyncNotice({ type: 'error', text: `Restore failed: ${err.message || err}` });
          triggerAlert("Restore Failed", `Failed to parse or fetch your backup file: ${err.message || err}`);
        } finally {
          setIsSyncing(false);
        }
      }
    );
  };

  const handleGoogleLogout = () => {
    setGoogleUser(null);
    setGoogleAccessToken(null);
    setSyncNotice(null);
    triggerAlert("Logged Out", "You have signed out from Google Drive sync session.");
  };

  const handleCreateNewPerson = (name?: string | React.MouseEvent) => {
    const finalParam = typeof name === 'string' ? name : newPersonName;
    const trimmedName = finalParam.trim();
    if (!trimmedName) {
      triggerAlert("Invalid Name", "Please enter a valid name.");
      return;
    }
    if (customPeople.some(p => p.toLowerCase() === trimmedName.toLowerCase())) {
      triggerAlert("Already Exists", "A contact with this exact name already exists.");
      return;
    }
    setCustomPeople(prev => [trimmedName, ...prev]);
    setNewPersonName('');
    triggerAlert("Contact Created", `${trimmedName} has been added to your contact profiles.`);
  };

  const handleDeleteContact = (personName: string) => {
    triggerConfirm(
      "Confirm Contact Deletion",
      `Are you sure you want to delete the profile directory for ${personName}? This will permanently clear their ledger history.`,
      () => {
        setCustomPeople(prev => prev.filter(p => p !== personName));
        setTransactions(prev => prev.filter(tx => tx.party.toLowerCase() !== personName.toLowerCase()));
        setSelectedPerson(null);
        triggerAlert("Contact Deleted", `Successfully removed ${personName}'s ledger and history catalog.`);
      },
      { confirmText: "Delete Directory", isDestructive: true }
    );
  };

  const handlePersonSmartParse = async (personName: string) => {
    if (!personSmartInput.trim()) return;
    setIsPersonParsing(true);
    setParserNotice(null);

    try {
      const response = await fetch('/api/parse-split-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: personSmartInput }),
      });

      if (!response.ok) {
        throw new Error('Backend parse failed');
      }

      const data = await response.json();
      const parsed = data.result || {};
      const parsedAmount = typeof parsed.amount === 'number' ? Math.abs(parsed.amount) : parsed.amount || 0;
      const parsedType = parsed.type === 'Credit' ? TransactionType.CREDIT : TransactionType.DEBIT;

      const resultObj: SmartParseResult = {
        amount: parsedAmount,
        type: parsedType,
        party: personName,
        category: categoriesList.includes(parsed.category) ? parsed.category : 'Other',
        notes: parsed.notes || personSmartInput,
        success: true
      };

      setReviewData(resultObj);
      setManualAmount(parsedAmount);
      setManualType(parsedType);
      setManualParty(personName);
      setManualCategory(resultObj.category);
      setManualNotes(resultObj.notes);

      setParserNotice(parsed.parserUsed || 'Smart Person NLP Parser');
      setShowReviewModal(true);
      setPersonSmartInput('');

    } catch (error) {
      console.warn('Backend parsing failed, applying offline schema parsing:', error);
      const cleanLower = personSmartInput.toLowerCase();
      const amountMatch = cleanLower.match(/(\d+)/);
      const parsedAmount = amountMatch ? parseInt(amountMatch[1], 10) : 0;
      const isCredit = cleanLower.includes('received') || cleanLower.includes('got') || cleanLower.includes('credit') || cleanLower.includes('salary') || cleanLower.includes('repaid');

      const localResult: SmartParseResult = {
        amount: parsedAmount,
        type: isCredit ? TransactionType.CREDIT : TransactionType.DEBIT,
        party: personName,
        category: 'Other',
        notes: personSmartInput,
        success: true
      };

      setReviewData(localResult);
      setManualAmount(localResult.amount);
      setManualType(localResult.type);
      setManualParty(localResult.party);
      setManualCategory(localResult.category);
      setManualNotes(localResult.notes);

      setParserNotice('Local Matching (Fallback)');
      setShowReviewModal(true);
      setPersonSmartInput('');
    } finally {
      setIsPersonParsing(false);
    }
  };

  const handleQuickSettle = (personName: string, unpaidAmount: number) => {
    if (unpaidAmount === 0) {
      triggerAlert("Account Already Settled", "This account ledger is already perfectly settled.");
      return;
    }
    const absoluteAmt = Math.abs(unpaidAmount);
    const settleType = unpaidAmount > 0 ? TransactionType.CREDIT : TransactionType.DEBIT;
    const notesStr = unpaidAmount > 0 
      ? `Settles remaining balance with ${personName} (Received repayment)`
      : `Settles remaining balance with ${personName} (Cleared pending debt)`;

    const newTx: Transaction = {
      id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toISOString(),
      amount: absoluteAmt,
      type: settleType,
      party: personName,
      category: 'Other',
      notes: notesStr
    };

    setTransactions(prev => [newTx, ...prev]);
    triggerAlert("Account Settled", `Account Settled successfully: ${notesStr}`);
  };

  // Ledger Summary Calculations
  const totalIn = transactions
    .filter(tx => tx.type === TransactionType.CREDIT)
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalOut = transactions
    .filter(tx => tx.type === TransactionType.DEBIT)
    .reduce((sum, tx) => sum + tx.amount, 0);

  const netPosition = totalIn - totalOut;

  // Categories present in types
  const categoriesList = [
    'Dining', 'Groceries', 'Rent', 'Salary', 'Utilities', 
    'Shopping', 'Travel', 'Entertainment', 'Medical', 'Gifts', 
    'Investment', 'Other'
  ];

  // Filtering Logic
  const filteredTransactions = [...transactions]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .filter(tx => {
      const matchesSearch = 
        tx.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.party.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = filterCategory === 'All' || tx.category === filterCategory;
      const matchesType = filterType === 'All' || tx.type === filterType;

      return matchesSearch && matchesCategory && matchesType;
    });

  // Category summary for dynamic UI visualization stats
  const categorySummary: { [key: string]: number } = {};
  transactions.forEach(tx => {
    if (tx.type === TransactionType.DEBIT) {
      categorySummary[tx.category] = (categorySummary[tx.category] || 0) + tx.amount;
    }
  });

  const maxCategoryDebit = Math.max(...Object.values(categorySummary), 1);

  return (
    <div id="main-ledger-app" className={`min-h-screen ${theme === 'dark' ? 'bg-cyber-gradient text-zinc-100' : 'bg-light-gradient text-zinc-900'} flex flex-col antialiased font-sans transition-colors duration-300`}>
      
      {/* Dynamic Header */}
      <header id="app-header" className={`border-b ${theme === 'dark' ? 'border-zinc-900/60 bg-zinc-950/70' : 'border-zinc-200 bg-white/70'} backdrop-blur-xl sticky top-0 z-40 transition-all`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3.5 group">
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl shadow-lg shadow-emerald-500/10 group-hover:scale-110 group-hover:border-emerald-400 transition-all duration-300">
              <TrendingUp className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] text-emerald-400 font-extrabold uppercase tracking-widest bg-emerald-950/70 py-0.5 px-2 rounded-full border border-emerald-900/20">{t("localSecure")}</span>
              </div>
              <h1 className="text-lg sm:text-xl font-extrabold tracking-tight font-display">
                <span className={`${theme === 'dark' ? 'text-white' : 'text-zinc-800'}`}>Finzy</span> <span className="text-emerald-500 font-black">Ledger</span>
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Language Toggle */}
            <button
              id="btn-toggle-language"
              type="button"
              onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
              className={`px-2.5 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-black cursor-pointer transition-all ${
                theme === 'dark'
                  ? 'border-zinc-800 text-zinc-350 bg-zinc-900 hover:bg-zinc-850'
                  : 'border-zinc-300 text-zinc-700 bg-white hover:bg-zinc-50 shadow-sm'
              }`}
              title={lang === 'en' ? "हिंदी में बदलें" : "Switch to English"}
            >
              <Languages className="w-3.5 h-3.5 text-emerald-500" />
              <span>{lang === 'en' ? "हिंदी" : "EN"}</span>
            </button>

            {/* Theme Toggle Button */}
            <button
              id="btn-toggle-theme"
              type="button"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`p-2 rounded-xl transition-all border flex items-center justify-center cursor-pointer ${
                theme === 'dark' 
                  ? 'border-zinc-855 text-zinc-455 bg-zinc-900 hover:text-emerald-400' 
                  : 'border-zinc-300 text-zinc-750 bg-white hover:text-emerald-600 shadow-sm'
              }`}
              title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" /> : <Moon className="w-4 h-4 text-indigo-650" />}
            </button>

            {/* Specs View Toggle */}
            <button
              id="btn-toggle-logs"
              type="button"
              onClick={() => setShowDeveloperLogs(!showDeveloperLogs)}
              className={`text-xs transition-all px-2.5 py-1.5 rounded-xl border flex items-center gap-1.5 cursor-pointer font-bold ${
                theme === 'dark'
                  ? 'border-zinc-800 text-zinc-450 hover:text-emerald-400 hover:bg-zinc-900/50 hover:border-emerald-500/30'
                  : 'border-zinc-200 text-zinc-650 bg-white hover:text-emerald-600 hover:bg-zinc-50 shadow-sm'
              }`}
            >
              <Code className="w-3.5 h-3.5 text-emerald-500" />
              <span className="hidden sm:inline">{showDeveloperLogs ? t("hideSpecs") : t("viewSpecs")}</span>
            </button>

            {/* Wipe Data Reset Button */}
            <button 
              id="btn-clear-database"
              type="button"
              onClick={handleDeleteLocalLedger}
              className={`text-xs transition-all px-2.5 py-1.5 border border-transparent rounded-xl cursor-pointer active:scale-95 font-bold ${
                theme === 'dark'
                  ? 'text-zinc-500 hover:text-rose-455 hover:bg-rose-955/20 hover:border-rose-900/20'
                  : 'text-zinc-550 hover:text-rose-605 shadow-sm'
              }`}
              title="Wipe local records"
            >
              <Trash2 className="w-3.5 h-3.5 xs:mr-1 inline-block" />
              <span className="hidden xs:inline">{t("resetData")}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        
        {/* Navigation Tabs Bar */}
        <div className={`flex p-1.5 rounded-2xl gap-2 shadow-xl animate-fadeIn transition-all duration-300 ${
          theme === 'dark' 
            ? 'bg-zinc-900/40 border border-zinc-850/80 shadow-black/40' 
            : 'bg-zinc-100 border border-zinc-200 shadow-zinc-200/50'
        }`}>
          <button
            id="tab-btn-dashboard"
            onClick={() => {
              setActiveMainTab('dashboard');
              setSelectedPerson(null);
            }}
            className={`flex-1 py-3 text-xs uppercase tracking-wider font-extrabold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeMainTab === 'dashboard'
                ? theme === 'dark'
                  ? 'bg-zinc-800 text-emerald-400 border border-zinc-700/50 shadow-lg font-black scale-[1.01]'
                  : 'bg-white text-emerald-650 border border-zinc-200/80 shadow-md font-black scale-[1.01]'
                : theme === 'dark'
                  ? 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-950/40'
                  : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-200/50'
            }`}
          >
            <FileText className="w-4 h-4" />
            Cash Flow Dashboard
          </button>
          <button
            id="tab-btn-people"
            onClick={() => {
              setActiveMainTab('people');
            }}
            className={`flex-1 py-3 text-xs uppercase tracking-wider font-extrabold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeMainTab === 'people'
                ? theme === 'dark'
                  ? 'bg-zinc-800 text-emerald-400 border border-zinc-700/55 shadow-lg font-black scale-[1.01]'
                  : 'bg-white text-emerald-650 border border-zinc-200/80 shadow-md font-black scale-[1.01]'
                : theme === 'dark'
                  ? 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-950/40'
                  : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-200/50'
            }`}
          >
            <Users className="w-4 h-4" />
            Social Friend Directory
          </button>
        </div>

        {/* Google Drive Cloud Sync & Backup Dashboard */}
        <section id="google-drive-sync-panel" className={`p-6 rounded-3xl shadow-xl animate-fadeIn space-y-5 transition-all duration-300 ${
          theme === 'dark' 
            ? 'glass-card border-zinc-800 shadow-black/50' 
            : 'glass-card-light border-zinc-200 shadow-zinc-100'
        }`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div className="flex items-start gap-4">
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-2xl shrink-0">
                <Cloud className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h3 className={`text-sm font-extrabold uppercase tracking-wide flex items-center gap-2 font-display ${
                  theme === 'dark' ? 'text-white' : 'text-zinc-900'
                }`}>
                  Cloud backup stash ☁️
                  <span className={`text-[9px] tracking-normal font-sans font-black px-2 py-0.5 rounded-full border ${
                    theme === 'dark' 
                      ? 'bg-indigo-950/80 border-indigo-800/40 text-indigo-400' 
                      : 'bg-indigo-50 border-indigo-200/60 text-indigo-650'
                  }`}>
                    G-Drive Secure
                  </span>
                </h3>
                <p className={`text-xs max-w-2xl leading-relaxed ${
                  theme === 'dark' ? 'text-zinc-400' : 'text-zinc-650'
                }`}>
                  Backup your active split ledger & list of mates instantly to your personal secure cloud storage. Safe, private, and fully controlled by you!
                </p>
                {lastSyncChecked && (
                  <p className="text-[10px] text-indigo-400/80 font-mono font-bold">
                    ✨ Last synced: {lastSyncChecked}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {isSyncing ? (
                <div className={`flex items-center gap-2 text-xs font-mono px-4 py-2.5 rounded-2xl border shadow-md ${
                  theme === 'dark' 
                    ? 'bg-zinc-950 text-zinc-300 border-zinc-850' 
                    : 'bg-zinc-50 text-zinc-750 border-zinc-200'
                }`}>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-450" />
                  Syncing Cloud...
                </div>
              ) : !googleUser ? (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <button
                    id="btn-google-sign-in"
                    onClick={handleGoogleLogin}
                    className="flex items-center justify-center gap-2.5 px-6 py-3 bg-gradient-to-r from-zinc-900 to-zinc-800 hover:from-indigo-650 hover:to-indigo-550 text-zinc-100 hover:text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl border border-zinc-800 transition-all shadow-xl hover:shadow-indigo-500/20 cursor-pointer active:scale-95"
                  >
                    <LogIn className="w-4 h-4 text-indigo-400 group-hover:text-white transition-colors" />
                    Connect Google Drive Sync
                  </button>
                  {window.self !== window.top && (
                    <a
                      href={window.location.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className={`flex items-center justify-center gap-1.5 px-4 py-3 border font-extrabold text-xs uppercase tracking-wider rounded-2xl transition-all cursor-pointer shadow-lg active:scale-95 ${
                        theme === 'dark'
                          ? 'bg-zinc-950 border-zinc-850 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200'
                          : 'bg-white border-zinc-250 hover:border-zinc-350 text-zinc-650 hover:text-zinc-850'
                      }`}
                      title="Open the application in a new browser tab to bypass editor iframe restrictions for Google Login."
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
                      Open in Tab
                    </a>
                  )}
                </div>
              ) : (
                <div className={`flex flex-wrap items-center gap-2.5 p-2 rounded-2xl border shadow-inner ${
                  theme === 'dark' ? 'bg-zinc-950/80 border-zinc-850' : 'bg-zinc-100 border-zinc-200/80 shadow-zinc-150'
                }`}>
                  
                  {/* Google User Identity profile tag */}
                  <div className={`hidden sm:flex items-center gap-2 px-3 py-1.5 border rounded-xl text-xs ${
                    theme === 'dark' 
                      ? 'border-zinc-805 bg-zinc-900/40 text-zinc-300' 
                      : 'border-zinc-200 bg-white text-zinc-700 shadow-sm'
                  }`}>
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-emerald-400 text-zinc-950 flex items-center justify-center font-black text-[10px] uppercase">
                      {googleUser.displayName?.charAt(0) || googleUser.email?.charAt(0) || 'G'}
                    </div>
                    <span className="font-bold truncate max-w-[120px]">
                      {googleUser.displayName || googleUser.email}
                    </span>
                  </div>

                  <button
                    id="btn-drive-backup-trigger"
                    onClick={handleBackupToDrive}
                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-400 hover:scale-[1.03] text-zinc-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-lg shadow-emerald-500/10"
                    title="Write Ledger snapshot back output to Google Drive file space"
                  >
                    <CloudUpload className="w-3.5 h-3.5 font-bold" />
                    Backup
                  </button>

                  <button
                    id="btn-drive-restore-trigger"
                    onClick={handleRestoreFromDrive}
                    className={`flex items-center gap-1.5 px-4 py-2 font-extrabold text-xs uppercase tracking-wider rounded-xl border transition-all cursor-pointer ${
                      theme === 'dark'
                        ? 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 hover:text-white border-zinc-800'
                        : 'bg-white hover:bg-zinc-50 text-zinc-700 hover:text-zinc-900 border-zinc-350 shadow-sm'
                    }`}
                    title="Read, verify, and resolve backup from your Google Drive files"
                  >
                    <CloudDownload className="w-3.5 h-3.5 text-emerald-500 animate-bounce" />
                    Restore
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {activeMainTab === 'dashboard' ? (
          <>
            {/* Net Position Banner Deck with Beautiful Bento Layout */}
            <section id="net-position-deck" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Bento Panel 1: Net Balance */}
          <div className={`p-6 rounded-3xl flex flex-col justify-between min-h-[150px] relative overflow-hidden hover:scale-[1.01] transition-all duration-300 group ${
            theme === 'dark' 
              ? 'bg-gradient-to-br from-zinc-900 to-zinc-950/80 border border-emerald-500/30 shadow-2xl shadow-black/40 text-zinc-100' 
              : 'bg-white border border-emerald-555/25 shadow-xl shadow-zinc-200/40 text-zinc-800'
          }`}>
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/15 transition-all ${
              theme === 'dark' ? 'bg-emerald-500/5' : 'bg-emerald-500/10'
            }`} />
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-black tracking-wider font-display uppercase ${
                theme === 'dark' ? 'text-zinc-400' : 'text-zinc-550'
              }`}>Net Wallet Position ⚡</span>
              <span className={`text-[9px] px-2.5 py-1 rounded-full font-black uppercase tracking-wider border ${
                netPosition >= 0 
                  ? theme === 'dark' ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/50' : 'bg-emerald-50 text-emerald-700 border-emerald-250' 
                  : theme === 'dark' ? 'bg-rose-950 text-rose-405 border border-rose-900' : 'bg-rose-50 text-rose-700 border-rose-250'
              }`}>
                {netPosition >= 0 ? 'Surplus' : 'Deficit'}
              </span>
            </div>
            <div className="mt-4">
              <div className={`text-3.5xl sm:text-4xl font-extrabold tracking-tight flex items-center gap-1 font-mono ${
                theme === 'dark' ? 'text-white' : 'text-zinc-900'
              }`}>
                <span className="text-emerald-500 text-2xl font-bold font-sans">₹</span>
                {netPosition.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
              </div>
              <p className={`text-[11px] mt-2 font-sans leading-relaxed ${
                theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600 font-medium'
              }`}>Aggregate balance calculated automatically across all active friends</p>
            </div>
          </div>

          {/* Bento Panel 2: Total Credits (In) */}
          <div className={`p-6 rounded-3xl shadow-xl flex flex-col justify-between min-h-[150px] hover:scale-[1.01] transition-all duration-300 group ${
            theme === 'dark' 
              ? 'bg-zinc-900/40 border border-zinc-850/80 shadow-black/40 text-zinc-100' 
              : 'bg-white border border-zinc-200 shadow-zinc-200/40 text-zinc-800'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-black tracking-wider font-display uppercase ${
                theme === 'dark' ? 'text-zinc-400' : 'text-zinc-550'
              }`}>Total Money In 🟢</span>
              <div className={`p-1 px-2.5 text-[10px] rounded-lg flex items-center gap-1 border font-mono font-bold ${
                theme === 'dark' 
                  ? 'bg-emerald-950/40 text-emerald-400 border-emerald-955/20' 
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
              }`}>
                <ArrowDownLeft className="w-3.5 h-3.5" /> Money Inflow
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2.5xl font-extrabold text-emerald-500 flex items-center gap-0.5 font-mono">
                + ₹{totalIn.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
              </div>
              <p className={`text-[11px] mt-2 font-sans leading-relaxed ${
                theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600 font-medium'
              }`}>Cumulative cash balance details and received splits</p>
            </div>
          </div>

          {/* Bento Panel 3: Total Debits (Out) */}
          <div className={`p-6 rounded-3xl shadow-xl flex flex-col justify-between min-h-[150px] hover:scale-[1.01] transition-all duration-300 group ${
            theme === 'dark' 
              ? 'bg-zinc-900/40 border border-zinc-850/80 shadow-black/40 text-zinc-100' 
              : 'bg-white border border-zinc-200 shadow-zinc-200/40 text-zinc-800'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-black tracking-wider font-display uppercase ${
                theme === 'dark' ? 'text-zinc-400' : 'text-zinc-550'
              }`}>Total Money Out 🔴</span>
              <div className={`p-1 px-2.5 text-[10px] rounded-lg flex items-center gap-1 border font-mono font-bold ${
                theme === 'dark' 
                  ? 'bg-rose-955/20 text-rose-400 border-rose-955/35' 
                  : 'bg-rose-50 text-rose-750 border-rose-200/50'
              }`}>
                <ArrowUpRight className="w-3.5 h-3.5 animate-pulse" /> Outflow Sum
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2.5xl font-extrabold text-rose-500 flex items-center gap-0.5 font-mono">
                - ₹{totalOut.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
              </div>
              <p className={`text-[11px] mt-2 font-sans leading-relaxed ${
                theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600 font-medium'
              }`}>Splits lent or daily outlays tracked for food/living/entertainment</p>
            </div>
          </div>
        </section>

        {/* Smart natural-language input field, floating voice activator & paper OCR scanner */}
        <section id="smart-entry-card" className={`p-6 rounded-3xl shadow-xl relative overflow-hidden transition-all duration-300 ${
          theme === 'dark' 
            ? 'glass-card border-zinc-855 shadow-black/50' 
            : 'glass-card-light border-zinc-200 shadow-zinc-200/40'
        }`}>
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
            <div>
              <h3 className={`text-sm font-extrabold uppercase tracking-wider flex items-center gap-2 font-display ${
                theme === 'dark' ? 'text-white' : 'text-zinc-900'
              }`}>
                <Sparkles className="w-5 h-5 text-emerald-450 animate-pulse" />
                AI Split assistant & receipt scanner
              </h3>
              <p className={`text-xs leading-relaxed max-w-xl ${
                theme === 'dark' ? 'text-zinc-400' : 'text-zinc-650'
              }`}>
                Type list items, dictate voice entries, or upload paper receipts to register split transactions chronologically with friends instantly.
              </p>
            </div>
            
            {/* Quick Helper Speech Recognition Notice */}
            {isListening && (
              <div className="flex items-center gap-2 bg-rose-955/20 border border-rose-900/60 text-rose-500 rounded-full px-4.5 py-1.5 font-mono text-xs text-center animate-pulse">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                Listening actively... Speak now 🎙️
              </div>
            )}
          </div>

          {/* Sub-Tabs Selector inside Smart Entry Card */}
          <div className={`p-1.5 rounded-2xl gap-1.5 mb-5 shadow-inner flex transition-all duration-300 ${
            theme === 'dark' ? 'bg-zinc-950/80 border border-zinc-900' : 'bg-zinc-100 border border-zinc-250/50'
          }`}>
            <button
              id="subtab-btn-text"
              type="button"
              onClick={() => setSmartInputMode('text')}
              className={`flex-1 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                smartInputMode === 'text'
                  ? theme === 'dark'
                    ? 'bg-zinc-805 text-emerald-400 border border-zinc-700/50 shadow-md font-black scale-[1.01]'
                    : 'bg-white text-emerald-650 border border-zinc-200/80 shadow-md font-black scale-[1.01]'
                  : theme === 'dark'
                    ? 'text-zinc-500 hover:text-zinc-300'
                    : 'text-zinc-500 hover:text-zinc-850'
              }`}
            >
              <Mic className="w-4 h-4 text-emerald-500" />
              Casual Text or Voice Speech
            </button>
            <button
              id="subtab-btn-scan"
              type="button"
              onClick={() => setSmartInputMode('scan')}
              className={`flex-1 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                smartInputMode === 'scan'
                  ? theme === 'dark'
                    ? 'bg-zinc-805 text-emerald-450 border border-zinc-700/50 shadow-md font-black scale-[1.01]'
                    : 'bg-white text-emerald-650 border border-zinc-205/85 shadow-md font-black scale-[1.01]'
                  : theme === 'dark'
                    ? 'text-zinc-500 hover:text-zinc-300'
                    : 'text-zinc-500 hover:text-zinc-850'
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-555 animate-bounce" />
              Multimodal Paper scan ocr
            </button>
          </div>

          {smartInputMode === 'scan' ? (
            <div className="space-y-4 animate-fadeIn">
              {/* Upload/Drop Zone */}
              <div 
                onDragOver={handleDragOver}
                onDrop={handleImageDrop}
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 ${
                  selectedImage 
                    ? theme === 'dark' ? 'border-emerald-500/50 bg-emerald-955/10' : 'border-emerald-500 bg-emerald-50/40'
                    : theme === 'dark' ? 'border-zinc-800 hover:border-zinc-750 bg-zinc-950/40' : 'border-zinc-300 hover:border-zinc-400 bg-zinc-50/80'
                }`}
              >
                <input 
                  type="file" 
                  id="scan-image-upload" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageSelect}
                  disabled={isScanningImage}
                />
                
                {imagePreviewUrl ? (
                  <div className="space-y-4">
                    <div className="relative inline-block">
                      <img 
                        src={imagePreviewUrl} 
                        alt="Selected paper sheet" 
                        className="max-h-48 rounded-lg mx-auto border border-zinc-800 shadow-md"
                      />
                      <button
                        type="button"
                        onClick={removeSelectedImage}
                        className="absolute -top-2 -right-2 p-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-full transition-colors cursor-pointer flex items-center justify-center"
                        disabled={isScanningImage}
                        title="Remove image"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    
                    <div className={`text-xs ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600 font-bold'}`}>
                      <span className="font-semibold">{selectedImage?.name}</span> ({(selectedImage?.size ? selectedImage.size / 1024 / 1024 : 0).toFixed(2)} MB)
                    </div>
                  </div>
                ) : (
                  <label 
                    htmlFor="scan-image-upload" 
                    className="flex flex-col items-center justify-center gap-3 cursor-pointer py-4"
                  >
                    <div className={`p-4 rounded-full border ${
                      theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-emerald-450' : 'bg-emerald-50 border-emerald-250/50 text-emerald-600'
                    }`}>
                      <CloudUpload className="w-6 h-6 animate-pulse" />
                    </div>
                    <div className="space-y-1">
                      <p className={`text-sm font-bold ${theme === 'dark' ? 'text-zinc-200' : 'text-zinc-700'}`}>Drag and drop paper, logs or bills here</p>
                      <p className={`text-xs ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-550'}`}>or click to choose device photos/scans</p>
                    </div>
                    <div className={`text-[10px] font-mono leading-relaxed text-center ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-455 font-bold'}`}>
                      Compatible types: PNG, JPG, JPEG, WEBP (Max 10MB)<br/>
                      <span className="text-emerald-500 font-extrabold font-sans">★ Fully reads & OCRs Hindi, Hinglish, & Devanagari Bills</span>
                    </div>
                  </label>
                )}
              </div>

              {/* Trigger Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                {selectedImage && (
                  <button
                    type="button"
                    onClick={removeSelectedImage}
                    className="px-4 py-2 bg-rose-650 hover:bg-rose-550 text-white rounded-xl font-bold text-xs transition-colors cursor-pointer"
                    disabled={isScanningImage}
                  >
                    Discard
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleScanImage}
                  className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-450 text-zinc-950 rounded-xl font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  disabled={!selectedImage || isScanningImage}
                >
                  {isScanningImage ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-zinc-950" />
                      Scanning document...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-zinc-950" />
                      Scan & Auto-Add Date Wise
                    </>
                  )}
                </button>
              </div>

              <div className={`p-4 rounded-xl flex items-start gap-2.5 border transition-all ${
                theme === 'dark' ? 'bg-zinc-950/80 border-zinc-850' : 'bg-zinc-50 border-zinc-200'
              }`}>
                <Info className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-650'}`}>
                  <strong>Multimodal Paper Scanner:</strong> Point your camera at written records, printed invoices, restaurant bills, or logs. Gemini Extracts transactions and injects them directly into the ledger sorted chronologically by their parsed dates.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Core Input with mic floating activator */}
              <div className={`relative flex items-center border rounded-xl p-1.5 shadow-inner transition-colors focus-within:border-emerald-500 ${
                theme === 'dark' ? 'bg-zinc-955 border-zinc-800' : 'bg-white border-zinc-300'
              }`}>
                <input
                  id="txt-smart-transaction-input"
                  type="text"
                  value={smartInput}
                  onChange={(e) => setSmartInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSmartParse(smartInput);
                    }
                  }}
                  placeholder="e.g. Spent 500 on dinner with Arjun yesterday..."
                  className={`w-full bg-transparent px-4 py-3 text-sm focus:outline-none placeholder-zinc-500 ${
                    theme === 'dark' ? 'text-zinc-150' : 'text-zinc-800 placeholder-zinc-400'
                  }`}
                  disabled={isParsing || isListening}
                />

                {/* Microscopic Status Indicator inside input */}
                {isParsing && (
                  <div className="flex items-center gap-1.5 text-zinc-500 mr-2 shrink-0">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                    <span className="text-xs font-mono">Parsing...</span>
                  </div>
                )}

                {/* Microphone floating activator button */}
                <button
                  id="btn-voice-capture-float"
                  type="button"
                  onClick={toggleSpeechRecognition}
                  className={`p-3.5 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                    isListening 
                      ? 'bg-rose-600 text-white animate-bounce shadow-glow' 
                      : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white'
                  }`}
                  title="Record Voice Command"
                  disabled={isParsing}
                >
                  {isListening ? <MicOff className="w-4.5 h-4.5" /> : <Mic className="w-4.5 h-4.5 text-emerald-400" />}
                </button>
              </div>

              {/* Action Triggers */}
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                
                {/* Quick templates for instant click parser playground in case iframe blocks direct micro access */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] text-zinc-500 font-mono">QUICK TEST CLICKS:</span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      id="btn-sample-1"
                      type="button"
                      onClick={() => clickTemplateTrigger('Spent 500 on dinner with Arjun')}
                      className="px-2.5 py-1 bg-zinc-950 hover:bg-zinc-800 text-[11px] text-zinc-400 rounded-md border border-zinc-850 hover:text-emerald-400 transition-colors cursor-pointer"
                    >
                      "Spent 500 on dinner with Arjun"
                    </button>
                    <button
                      id="btn-sample-2"
                      type="button"
                      onClick={() => clickTemplateTrigger('Salary credit of 80000 from client')}
                      className="px-2.5 py-1 bg-zinc-950 hover:bg-zinc-800 text-[11px] text-zinc-400 rounded-md border border-zinc-850 hover:text-emerald-400 transition-colors cursor-pointer"
                    >
                      "Salary credit of 80000"
                    </button>
                    <button
                      id="btn-sample-3"
                      type="button"
                      onClick={() => clickTemplateTrigger('Paid 1500 to landlord')}
                      className="px-2.5 py-1 bg-zinc-950 hover:bg-zinc-800 text-[11px] text-zinc-400 rounded-md border border-zinc-850 hover:text-emerald-400 transition-colors cursor-pointer"
                    >
                      "Paid 1500 to landlord"
                    </button>
                  </div>
                </div>

                <button
                  id="btn-submit-smart-parse"
                  type="button"
                  onClick={() => handleSmartParse(smartInput)}
                  className="px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                  disabled={!smartInput.trim() || isParsing}
                >
                  Parse Command
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Voice Errors or Permissions Warning */}
              {speechError && (
                <div className="mt-3 p-3 bg-rose-950/60 border border-rose-900 rounded-xl flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-rose-350">{speechError}</p>
                </div>
              )}
            </>
          )}
        </section>

        {/* Smart Entry Inline Reviewer & Adjuster panel */}
        {showReviewModal && (
          <div id="modal-review-transaction" className={`p-6 rounded-2xl relative shadow-2xl transition-all duration-300 animate-fadeIn border ${
            theme === 'dark' 
              ? 'bg-zinc-900 border-emerald-500/40 text-zinc-100 shadow-black/80' 
              : 'bg-white border-emerald-500/30 text-zinc-800 shadow-zinc-250/20'
          }`}>
            <div className="absolute top-2 right-2">
              <button 
                id="btn-close-review"
                onClick={() => setShowReviewModal(false)}
                className={`p-1 px-[5px] border rounded-lg text-xs transition-colors cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                    : 'bg-zinc-50 border-zinc-250 text-zinc-550 hover:text-zinc-800'
                }`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-2.5 text-emerald-500 font-bold tracking-wider text-xs uppercase mb-4 mb-2">
              <Sparkles className="w-4 h-4 animate-pulse" />
              Parsed Ledger Draft Review
              {parserNotice && (
                <span className={`text-[10px] tracking-normal font-mono border px-2 py-0.5 rounded ml-2 ${
                  theme === 'dark' ? 'bg-emerald-950 border-emerald-800 text-emerald-400' : 'bg-emerald-50 border-emerald-250 text-emerald-700'
                }`}>
                  {parserNotice}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              
              {/* Draft Amount Column */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Amount (INR)</label>
                <input
                  id="inp-review-amount"
                  type="number"
                  value={manualAmount}
                  onChange={(e) => setManualAmount(Number(e.target.value))}
                  className={`border focus:border-emerald-500 rounded-xl px-3 py-2 text-sm outline-none w-full transition-colors ${
                    theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-zinc-50 border-zinc-250 text-zinc-800'
                  }`}
                />
              </div>

              {/* Draft Type Column */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Type</label>
                <select
                  id="inp-review-type"
                  value={manualType}
                  onChange={(e) => setManualType(e.target.value as TransactionType)}
                  className={`border focus:border-emerald-500 rounded-xl px-3 py-2 text-sm outline-none w-full cursor-pointer transition-colors ${
                    theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-zinc-50 border-zinc-250 text-zinc-800'
                  }`}
                >
                  <option value={TransactionType.DEBIT}>Debit (Paid / Spent)</option>
                  <option value={TransactionType.CREDIT}>Credit (Received / Salary)</option>
                </select>
              </div>

              {/* Draft Party Column */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Party</label>
                <input
                  id="inp-review-party"
                  type="text"
                  value={manualParty}
                  onChange={(e) => setManualParty(e.target.value)}
                  className={`border focus:border-emerald-500 rounded-xl px-3 py-2 text-sm outline-none w-full transition-colors ${
                    theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-zinc-50 border-zinc-250 text-zinc-800'
                  }`}
                />
              </div>

              {/* Draft Category Column */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Category</label>
                <select
                  id="inp-review-category"
                  value={manualCategory}
                  onChange={(e) => setManualCategory(e.target.value)}
                  className={`border focus:border-emerald-500 rounded-xl px-3 py-2 text-sm outline-none w-full cursor-pointer transition-colors ${
                    theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-zinc-50 border-zinc-250 text-zinc-800'
                  }`}
                >
                  {categoriesList.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Notes Context Column */}
              <div className="flex flex-col gap-1 md:col-span-1">
                <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Description Notes</label>
                <input
                  id="inp-review-notes"
                  type="text"
                  value={manualNotes}
                  onChange={(e) => setManualNotes(e.target.value)}
                  className={`border focus:border-emerald-500 rounded-xl px-3 py-2 text-sm outline-none w-full transition-colors ${
                    theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-zinc-50 border-zinc-250 text-zinc-800'
                  }`}
                />
              </div>
            </div>

            <div className={`flex items-center justify-end gap-3 mt-4 pt-3 border-t ${
              theme === 'dark' ? 'border-zinc-800' : 'border-zinc-200'
            }`}>
              <button
                id="btn-review-cancel"
                onClick={() => setShowReviewModal(false)}
                className={`px-4 py-2 bg-transparent rounded-lg text-xs cursor-pointer transition-colors ${
                  theme === 'dark' ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-zinc-100 text-zinc-500 hover:text-zinc-700'
                }`}
              >
                Discard Draft
              </button>
              <button
                id="btn-review-save"
                onClick={saveTransaction}
                className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-lg text-xs font-black flex items-center gap-1 cursor-pointer transition-all"
              >
                <CheckCircle className="w-4 h-4 font-extrabold" />
                Approve & Save Entry
              </button>
            </div>
          </div>
        )}

        {/* Dashboard Analytics & Transactions Feed Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (Stats and Categories Breakdown, 4 columns) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Category Breakdown Panel */}
            <div id="category-breakdown-card" className={`p-6 rounded-3xl shadow-2xl relative overflow-hidden transition-all duration-300 hover:scale-[1.01] border ${
              theme === 'dark' 
                ? 'glass-card border-zinc-850 hover:border-emerald-500/20 shadow-black/60' 
                : 'glass-card-light border-zinc-200 hover:border-emerald-555/20 shadow-zinc-200/40 text-zinc-800'
            }`}>
              <h3 className={`text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 mb-4 font-display ${
                theme === 'dark' ? 'text-white' : 'text-zinc-800'
              }`}>
                <FolderOpen className="w-4.5 h-4.5 text-emerald-400 animate-pulse" /> Where does my money go? 💸
              </h3>

              {transactions.filter(tx => tx.type === TransactionType.DEBIT).length === 0 ? (
                <div className="text-center py-8 text-zinc-500 text-xs leading-relaxed">
                  No spend records logged yet. Try typing a coffee or dining transaction in the active split box above first!
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(categorySummary).map(([category, amount]) => {
                    const percent = Math.round((amount / totalOut) * 100) || 0;
                    return (
                      <div key={category} className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className={`font-bold flex items-center gap-1.5 ${
                            theme === 'dark' ? 'text-zinc-300' : 'text-zinc-650'
                          }`}>
                            <Tag className="w-3.5 h-3.5 text-emerald-400" />
                            {category}
                          </span>
                          <span className={`font-bold font-mono ${
                            theme === 'dark' ? 'text-zinc-400' : 'text-zinc-550'
                          }`}>
                            ₹{amount.toLocaleString('en-IN')} ({percent}%)
                          </span>
                        </div>
                        <div className={`w-full rounded-full h-2 overflow-hidden border shadow-inner ${
                          theme === 'dark' ? 'bg-zinc-950 border-zinc-900' : 'bg-zinc-150 border-zinc-200/80'
                        }`}>
                          <div 
                            className="bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(amount / maxCategoryDebit) * 100}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  <p className={`text-[10px] font-mono mt-3 text-center border-t pt-2.5 ${
                    theme === 'dark' ? 'text-zinc-500 border-zinc-850/60' : 'text-zinc-405 border-zinc-200'
                  }`}>
                    * Showing category outlay distributions of ₹{totalOut.toLocaleString('en-IN')}
                  </p>
                </div>
              )}
            </div>

            {/* Quick Balance Statement Card */}
            <div id="quick-statement-card" className={`p-6 rounded-3xl shadow-2xl relative overflow-hidden transition-all duration-300 hover:scale-[1.01] border ${
              theme === 'dark' 
                ? 'glass-card border-zinc-850 hover:border-indigo-500/20 shadow-black/60' 
                : 'glass-card-light border-zinc-200 hover:border-indigo-500/10 shadow-zinc-200/40 text-zinc-805'
            }`}>
              <h3 className={`text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 mb-4 font-display ${
                theme === 'dark' ? 'text-white' : 'text-zinc-800'
              }`}>
                <TrendingUp className="w-4.5 h-4.5 text-indigo-400 animate-pulse" /> Active Wallet Check ⚡
              </h3>
              <div className={`space-y-3 font-mono text-xs ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>
                <div className={`flex justify-between border-b pb-2 ${
                  theme === 'dark' ? 'border-zinc-850/60' : 'border-zinc-200'
                }`}>
                  <span className="text-zinc-500 text-[11px]">Money Inflow Events</span>
                  <span className="text-emerald-500 font-bold">{transactions.filter(t => t.type === TransactionType.CREDIT).length} Credits</span>
                </div>
                <div className={`flex justify-between border-b pb-2 ${
                  theme === 'dark' ? 'border-zinc-850/60' : 'border-zinc-200'
                }`}>
                  <span className="text-zinc-500 text-[11px]">Money Outflow Events</span>
                  <span className="text-rose-500 font-bold">{transactions.filter(t => t.type === TransactionType.DEBIT).length} Debits</span>
                </div>
                <div className={`flex justify-between border-b pb-2 ${
                  theme === 'dark' ? 'border-zinc-850/60' : 'border-zinc-200'
                }`}>
                  <span className="text-zinc-500 text-[11px]">Local sync vault</span>
                  <span className={`font-bold ${theme === 'dark' ? 'text-zinc-200' : 'text-zinc-800'}`}>Synchronized (IndexedDB)</span>
                </div>
                <div className="flex justify-between pb-0.5">
                  <span className="text-zinc-500 text-[11px]">Privacy Lock</span>
                  <span className="text-emerald-500 font-bold flex items-center gap-1">✔ 100% Client-Side</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column (Transactions Feed/Table, 8 columns) */}
          <div id="transactions-feed" className={`lg:col-span-8 rounded-3xl overflow-hidden shadow-2xl border ${
            theme === 'dark' 
              ? 'glass-card border-zinc-850 shadow-black/80' 
              : 'glass-card-light border-zinc-200 shadow-zinc-250/20'
          }`}>
            
            {/* Table Header / Filter Suite */}
            <div className={`p-6 border-b backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              theme === 'dark' 
                ? 'border-zinc-900/45 bg-zinc-950/75' 
                : 'border-zinc-200 bg-zinc-50/80'
            }`}>
              <div>
                <h3 className={`text-sm font-black flex items-center gap-2 uppercase tracking-wider font-display ${
                  theme === 'dark' ? 'text-white' : 'text-zinc-800'
                }`}>
                  <FileText className="w-5 h-5 text-emerald-400 animate-pulse" /> Split History Ledger 📂
                </h3>
                <p className={`text-[11px] mt-1 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  Showing {filteredTransactions.length} of {transactions.length} secure local records
                </p>
              </div>

              {/* Filtering Controls */}
              <div className="flex flex-wrap items-center gap-2.5">
                
                {/* Search Bar */}
                <div className={`relative flex items-center border rounded-xl px-3 py-1.5 text-xs transition-colors ${
                  theme === 'dark' 
                    ? 'bg-zinc-900 border-zinc-800 text-zinc-200 focus-within:border-emerald-500/50' 
                    : 'bg-white border-zinc-250 text-zinc-800 focus-within:border-emerald-500/40'
                }`}>
                  <Search className="w-3.5 h-3.5 text-zinc-550 mr-2" />
                  <input
                    id="txt-search-ledger"
                    type="text"
                    placeholder="Search logs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none focus:outline-none placeholder-zinc-550 text-xs w-28 font-semibold"
                  />
                </div>

                {/* Type Filter */}
                <select
                  id="sel-type-filter"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className={`border hover:border-zinc-550 text-xs rounded-xl px-3 py-2 transition-all cursor-pointer font-bold ${
                    theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-zinc-205' : 'bg-white border-zinc-250 text-zinc-700'
                  }`}
                >
                  <option value="All">All Types</option>
                  <option value={TransactionType.CREDIT}>Credits Only</option>
                  <option value={TransactionType.DEBIT}>Debits Only</option>
                </select>

                {/* Category Filter */}
                <select
                  id="sel-category-filter"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className={`border hover:border-zinc-550 text-xs rounded-xl px-3 py-2 transition-all cursor-pointer font-bold ${
                    theme === 'dark' ? 'bg-zinc-900 border-zinc-800 text-zinc-205' : 'bg-white border-zinc-250 text-zinc-700'
                  }`}
                >
                  <option value="All">All Categories</option>
                  {categoriesList.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                
              </div>
            </div>

            {/* List Body */}
            <div className={`divide-y ${theme === 'dark' ? 'divide-zinc-905' : 'divide-zinc-200/80'}`}>
              {filteredTransactions.length === 0 ? (
                <div className="p-16 text-center text-zinc-500">
                  <Info className="w-10 h-10 text-zinc-600 mx-auto mb-3 animate-bounce" />
                  <p className={`text-sm font-extrabold ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-650'}`}>No records found matching your filters</p>
                  <p className="text-xs text-zinc-400 mt-2">Try adjusting your filters or typing a fresh split statement above.</p>
                </div>
              ) : (
                filteredTransactions.map((tx) => (
                  <div 
                    key={tx.id} 
                    id={`tx-row-${tx.id}`}
                    className={`p-5 flex items-center justify-between gap-4 transition-all duration-200 animate-fadeIn ${
                      theme === 'dark' ? 'hover:bg-zinc-950/60' : 'hover:bg-zinc-50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Visual Indicator of Credit or Debit */}
                      <div className={`p-3 rounded-2xl border flex items-center justify-center shrink-0 shadow-lg ${
                        tx.type === TransactionType.CREDIT
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-emerald-500/5'
                          : 'bg-rose-500/10 border-rose-500/30 text-rose-400 shadow-rose-500/5'
                      }`}>
                        {tx.type === TransactionType.CREDIT ? (
                          <ArrowDownLeft className="w-4.5 h-4.5 animate-pulse" />
                        ) : (
                          <ArrowUpRight className="w-4.5 h-4.5 animate-pulse" />
                        )}
                      </div>

                      {/* Detail Column */}
                      <div className="space-y-1">
                        <div className="flex items-center flex-wrap gap-2">
                          <span className={`text-[10px] font-black flex items-center gap-1 px-2.5 py-1 border rounded-full font-mono ${
                            theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-705'
                          }`}>
                            <User className="w-3 h-3 text-emerald-400" /> {tx.party}
                          </span>
                          <span className={`text-[10px] font-black px-2.5 py-1 border rounded-full flex items-center gap-1 font-mono ${
                            theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-indigo-300' : 'bg-zinc-50 border-zinc-200 text-indigo-600'
                          }`}>
                            <Tag className="w-3 h-3 text-indigo-405" /> {tx.category}
                          </span>
                        </div>
                        <p className={`text-xs font-extrabold leading-normal mt-1 ${theme === 'dark' ? 'text-zinc-101' : 'text-zinc-800'}`}>
                          {tx.notes}
                        </p>
                        <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-mono">
                          <Calendar className="w-3.5 h-3.5 text-zinc-650" />
                          <span>{new Date(tx.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-right shrink-0">
                      <div>
                        <div className={`text-base sm:text-lg font-black font-mono tracking-tight ${
                          tx.type === TransactionType.CREDIT ? 'text-emerald-400 font-extrabold' : 'text-rose-455 font-extrabold'
                        }`}>
                          {tx.type === TransactionType.CREDIT ? '+' : '-'} ₹{tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
                        </div>
                        <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-550 block font-bold leading-none mt-1">
                          ✔ Verified
                        </span>
                      </div>

                      <button
                        id={`btn-delete-tx-${tx.id}`}
                        onClick={() => deleteTransaction(tx.id)}
                        className={`p-2.5 bg-transparent rounded-xl transition-all cursor-pointer hover:scale-105 active:scale-95 ${
                          theme === 'dark' ? 'text-zinc-600 hover:bg-rose-955/20 hover:text-rose-400' : 'text-zinc-400 hover:bg-rose-50 hover:text-rose-600'
                        }`}
                        title="Delete split record"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      </>
    ) : (
      /* Contacts Directory / Person Ledger sub-views */
      <div className="space-y-6 animate-fadeIn">
        
        {/* Smart Entry Draft review modal */}
        {showReviewModal && (
          <div id="modal-review-transaction-people" className={`p-6 rounded-2xl relative shadow-2xl transition-all animate-fadeIn border ${
            theme === 'dark' ? 'bg-zinc-900 border-emerald-500/40' : 'bg-white border-zinc-200 shadow-zinc-200/50'
          }`}>
            <div className="absolute top-2 right-2">
              <button 
                id="btn-close-review-people"
                onClick={() => setShowReviewModal(false)}
                className={`p-1 px-[5px] border rounded-lg text-xs cursor-pointer transition-colors ${
                  theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-500 hover:text-zinc-800'
                }`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-2.5 text-emerald-500 font-bold tracking-wider text-xs uppercase mb-4">
              <Sparkles className="w-4 h-4 animate-pulse" />
              Parsed Ledger Draft Review
              {parserNotice && (
                <span className={`text-[10px] tracking-normal font-mono px-2 py-0.5 rounded ml-2 border ${
                  theme === 'dark' ? 'bg-emerald-950/80 border-emerald-800/40 text-emerald-400' : 'bg-emerald-50 border-emerald-250/50 text-emerald-700'
                }`}>
                  {parserNotice}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="flex flex-col gap-1">
                <label className={`text-[10px] uppercase tracking-widest font-mono ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-450 font-bold'}`}>Amount (INR)</label>
                <input
                  id="inp-review-amount-p"
                  type="number"
                  value={manualAmount}
                  onChange={(e) => setManualAmount(Number(e.target.value))}
                  className={`border focus:border-emerald-500 rounded-xl px-3 py-2 text-sm outline-none w-full transition-colors ${
                    theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-zinc-250 text-zinc-800'
                  }`}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className={`text-[10px] uppercase tracking-widest font-mono ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-450 font-bold'}`}>Type</label>
                <select
                  id="inp-review-type-p"
                  value={manualType}
                  onChange={(e) => setManualType(e.target.value as TransactionType)}
                  className={`border focus:border-emerald-500 rounded-xl px-3 py-2 text-sm outline-none w-full cursor-pointer transition-colors ${
                    theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-zinc-250 text-zinc-800'
                  }`}
                >
                  <option value={TransactionType.DEBIT}>Debit (Paid / Spent)</option>
                  <option value={TransactionType.CREDIT}>Credit (Received / Repaid)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className={`text-[10px] uppercase tracking-widest font-mono ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-450 font-bold'}`}>Party / Name</label>
                <input
                  id="inp-review-party-p"
                  type="text"
                  value={manualParty}
                  onChange={(e) => setManualParty(e.target.value)}
                  className={`border focus:border-emerald-500 rounded-xl px-3 py-2 text-sm outline-none w-full transition-colors ${
                    theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-zinc-250 text-zinc-800'
                  }`}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className={`text-[10px] uppercase tracking-widest font-mono ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-450 font-bold'}`}>Category</label>
                <select
                  id="inp-review-category-p"
                  value={manualCategory}
                  onChange={(e) => setManualCategory(e.target.value)}
                  className={`border focus:border-emerald-500 rounded-xl px-3 py-2 text-sm outline-none w-full cursor-pointer transition-colors ${
                    theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-zinc-250 text-zinc-805'
                  }`}
                >
                  {categoriesList.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className={`text-[10px] uppercase tracking-widest font-mono ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-450 font-bold'}`}>Notes Context</label>
                <input
                  id="inp-review-notes-p"
                  type="text"
                  value={manualNotes}
                  onChange={(e) => setManualNotes(e.target.value)}
                  className={`border focus:border-emerald-500 rounded-xl px-3 py-2 text-sm outline-none w-full transition-colors ${
                    theme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-zinc-250 text-zinc-800'
                  }`}
                />
              </div>
            </div>

            <div className={`flex items-center justify-end gap-3 mt-4 pt-3 border-t ${theme === 'dark' ? 'border-zinc-850' : 'border-zinc-150'}`}>
              <button
                id="btn-review-cancel-p"
                onClick={() => setShowReviewModal(false)}
                className={`px-4 py-2 bg-transparent rounded-lg text-xs cursor-pointer transition-colors ${
                  theme === 'dark' ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-zinc-100 text-zinc-500'
                }`}
              >
                Discard Draft
              </button>
              <button
                id="btn-review-save-p"
                onClick={saveTransaction}
                className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-lg text-xs font-black flex items-center gap-1 cursor-pointer transition-all shadow-md shadow-emerald-500/10"
              >
                <CheckCircle className="w-4 h-4" />
                Approve & Save Entry
              </button>
            </div>
          </div>
        )}

        {selectedPerson === null ? (
          /* SECTION 1: GLOBAL CONTACTS LIST VIEW */
          <div className="space-y-6">
            
            {/* Header & New Profile creator panel */}
            <div className={`p-6 rounded-3xl shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden border ${
              theme === 'dark' 
                ? 'glass-card border-zinc-850 shadow-black/50 text-white' 
                : 'glass-card-light border-zinc-200 shadow-zinc-200/50 text-zinc-800'
            }`}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl" />
              <div className="space-y-1">
                <h2 className={`text-sm font-black uppercase tracking-wider flex items-center gap-2 font-display ${
                  theme === 'dark' ? 'text-white' : 'text-zinc-850'
                }`}>
                  <span className={`p-1 px-2 font-mono rounded text-[10px] border ${
                    theme === 'dark' ? 'bg-emerald-955/10 text-emerald-400 border-emerald-900/40' : 'bg-emerald-50 text-emerald-700 border-emerald-250/50'
                  }`}>
                    Active
                  </span>
                  Social mates & portfolios
                </h2>
                <p className={`text-xs leading-relaxed max-w-md ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>
                  Initialize profile portfolios for your flatmates, dining buddies, or travel groups to see net balances at a glance.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                {/* Search Field */}
                <div className={`relative flex items-center border rounded-xl px-3 py-2.5 text-xs transition-colors focus-within:border-emerald-500 ${
                  theme === 'dark' ? 'bg-zinc-950 border-zinc-805' : 'bg-white border-zinc-250'
                }`}>
                  <Search className="w-3.5 h-3.5 text-zinc-500 mr-2 shrink-0" />
                  <input
                    id="txt-search-contacts"
                    type="text"
                    placeholder="Search mates..."
                    value={searchContactQuery}
                    onChange={(e) => setSearchContactQuery(e.target.value)}
                    className={`bg-transparent border-none focus:outline-none placeholder-zinc-550 text-xs w-44 font-semibold ${
                      theme === 'dark' ? 'text-zinc-200' : 'text-zinc-700'
                    }`}
                  />
                </div>

                {/* Quick Add Name Input */}
                <div className={`flex items-center border rounded-xl p-1 transition-colors focus-within:border-emerald-500 ${
                  theme === 'dark' ? 'bg-zinc-950 border-zinc-805' : 'bg-white border-zinc-250'
                }`}>
                  <input
                    id="txt-create-contact-name"
                    type="text"
                    placeholder="Mate's name..."
                    value={newPersonName}
                    onChange={(e) => setNewPersonName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCreateNewPerson();
                    }}
                    className={`bg-transparent px-3 py-2 text-xs outline-none placeholder-zinc-550 w-36 font-semibold ${
                      theme === 'dark' ? 'text-zinc-200' : 'text-zinc-700'
                    }`}
                  />
                  <button
                    id="btn-create-contact-submit"
                    onClick={handleCreateNewPerson}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-400 hover:scale-[1.02] text-zinc-950 rounded-lg font-black text-xs flex items-center gap-1 cursor-pointer transition-all shrink-0 uppercase tracking-wide"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Mate
                  </button>
                </div>
              </div>
            </div>

            {/* Grid of Profile portfolios */}
            {(() => {
              const extractedParties = Array.from(
                new Set(
                  transactions
                    .map(t => t.party.trim())
                    .filter(p => p && p.toLowerCase() !== 'self')
                )
              );
              const combinedParties = Array.from(new Set([...extractedParties, ...customPeople]))
                .filter(p => p.toLowerCase().includes(searchContactQuery.toLowerCase()))
                .sort((a, b) => a.localeCompare(b));

              if (combinedParties.length === 0) {
                return (
                  <div className={`p-16 text-center rounded-2xl animate-fadeIn border ${
                    theme === 'dark' ? 'bg-zinc-900 border-zinc-850 text-zinc-300' : 'bg-zinc-50 border-zinc-200 text-zinc-705'
                  }`}>
                    <Users className="w-10 h-10 text-zinc-500 mx-auto mb-3" />
                    <p className={`font-bold text-sm ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-800'}`}>No personal portfolios match your search</p>
                    <p className="text-xs text-zinc-500 mt-1">Add a profile name in the input box above to launch a new ledger page automatically.</p>
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {combinedParties.map((person) => {
                    const personTxs = transactions.filter(t => t.party.trim().toLowerCase() === person.toLowerCase());
                    const creditsSum = personTxs.filter(t => t.type === TransactionType.CREDIT).reduce((sum, t) => sum + t.amount, 0);
                    const debitsSum = personTxs.filter(t => t.type === TransactionType.DEBIT).reduce((sum, t) => sum + t.amount, 0);
                    const netUnpaidBalance = debitsSum - creditsSum;

                    return (
                      <div 
                        key={person} 
                        id={`person-card-${person}`}
                        className={`p-6 rounded-3xl flex flex-col justify-between space-y-5 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer group border ${
                          theme === 'dark' 
                            ? 'glass-card border-zinc-850/80 hover:border-emerald-500/20' 
                            : 'glass-card-light border-zinc-200 hover:border-emerald-500/20 shadow-zinc-200/40 text-zinc-800'
                        }`}
                        onClick={() => setSelectedPerson(person)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-3">
                            {/* Initials avatar circle */}
                            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${getAvatarColor(person)} flex items-center justify-center font-black text-sm uppercase shadow-lg border border-zinc-700/10`}>
                              {person.charAt(0)}
                            </div>
                            <div>
                              <h3 className={`font-extrabold text-sm group-hover:text-emerald-500 transition-colors leading-tight ${
                                theme === 'dark' ? 'text-white' : 'text-zinc-800'
                              }`}>{person}</h3>
                              <p className={`text-[10px] mt-1 ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400 font-bold'}`}>{personTxs.length} logged events</p>
                            </div>
                          </div>

                          <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border font-mono ${
                            netUnpaidBalance > 0 
                              ? theme === 'dark'
                                ? 'bg-emerald-950/65 text-emerald-400 border-emerald-900/60' 
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : netUnpaidBalance < 0 
                              ? theme === 'dark'
                                ? 'bg-rose-955/20 text-rose-355 border-rose-900/40' 
                                : 'bg-rose-50 text-rose-700 border-rose-200'
                              : theme === 'dark'
                              ? 'bg-zinc-950 text-zinc-400 border-zinc-850'
                              : 'bg-zinc-100 text-zinc-500 border-zinc-200'
                          }`}>
                            {netUnpaidBalance > 0 
                              ? 'Owed to you' 
                              : netUnpaidBalance < 0 
                              ? 'You owe' 
                              : 'Settled'}
                          </span>
                        </div>

                        {/* Balance metrics */}
                        <div className={`p-4 rounded-2xl space-y-2.5 shadow-inner border ${
                          theme === 'dark' ? 'bg-zinc-950/70 border-zinc-900' : 'bg-zinc-50/70 border-zinc-200'
                        }`}>
                          <div className={`flex items-center justify-between text-xs font-bold ${
                            theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'
                          }`}>
                            <span>Outstanding:</span>
                            <span className={`font-black text-xs font-mono ${
                              netUnpaidBalance > 0 ? 'text-emerald-500' : netUnpaidBalance < 0 ? 'text-rose-500' : (theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500')
                            }`}>
                              {netUnpaidBalance > 0 ? '+' : ''}₹{netUnpaidBalance.toLocaleString('en-IN')}
                            </span>
                          </div>
                          <div className={`flex items-center justify-between text-[10px] border-t pt-2 font-mono ${
                            theme === 'dark' ? 'text-zinc-500 border-zinc-900' : 'text-zinc-450 border-zinc-200 font-bold'
                          }`}>
                            <span>Deposited: ₹{debitsSum.toLocaleString('en-IN')}</span>
                            <span>Cleared: ₹{creditsSum.toLocaleString('en-IN')}</span>
                          </div>
                        </div>

                        <button
                          id={`person-view-btn-${person}`}
                          className={`w-full text-center py-2.5 rounded-xl text-[11px] font-black transition-all tracking-wider uppercase font-mono border ${
                            theme === 'dark'
                              ? 'bg-zinc-950 hover:bg-emerald-500 hover:text-zinc-950 text-zinc-300 border-zinc-850'
                              : 'bg-white hover:bg-emerald-500 hover:text-zinc-950 text-zinc-700 border-zinc-250 shadow-sm'
                          }`}
                        >
                          View Ledger Page &rarr;
                        </button>
                      </div>
                    );
                  })}
                </div>
              );
            })()}

          </div>
        ) : (
          /* SECTION 2: DEDICATED INDIVIDUAL PORTFOLIO PORTAL OVERLAY PAGE */
          <div id={`person-page-detail-${selectedPerson}`} className="space-y-6">
            
            {/* Back header navigation bar */}
            <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-3 border-b ${
              theme === 'dark' ? 'border-zinc-900' : 'border-zinc-250'
            }`}>
              <div className="flex items-center gap-3">
                <button
                  id="btn-person-back-to-directory"
                  onClick={() => setSelectedPerson(null)}
                  className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-zinc-900 hover:bg-zinc-805 text-zinc-400 hover:text-white border-zinc-805'
                      : 'bg-white hover:bg-zinc-50 text-zinc-500 hover:text-zinc-850 border-zinc-200'
                  }`}
                  title="Return to Directory"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${getAvatarColor(selectedPerson)} flex items-center justify-center font-bold text-2xs uppercase shadow-inner`}>
                      {selectedPerson.charAt(0)}
                    </div>
                    <span className="text-[10px] text-emerald-555 uppercase tracking-widest font-mono font-black">Portfolios Directory</span>
                  </div>
                  <h2 className={`text-xl font-extrabold tracking-tight flex items-center gap-2 mt-0.5 ${
                    theme === 'dark' ? 'text-white' : 'text-zinc-800'
                  }`}>
                    {selectedPerson}'s Private Ledger Account
                  </h2>
                </div>
              </div>

              <div>
                <button
                  id="btn-remove-person-custom"
                  onClick={() => {
                    triggerConfirm(
                      "Remove Portfolio Profile",
                      `Are you sure you want to remove the custom profile directory page for "${selectedPerson}"? Note: Pre-existing ledger transaction events involving "${selectedPerson}" will still remain inside the general ledger logs.`,
                      () => {
                        setCustomPeople(prev => prev.filter(p => p !== selectedPerson));
                        setSelectedPerson(null);
                      },
                      { confirmText: "Remove Page", isDestructive: true }
                    );
                  }}
                  className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer font-semibold text-xs ${
                    theme === 'dark'
                      ? 'border-transparent hover:border-rose-900 text-zinc-500 hover:text-rose-405 hover:bg-rose-955/20'
                      : 'border-transparent hover:border-rose-200 text-zinc-500 hover:text-rose-700 hover:bg-rose-50'
                  }`}
                >
                  Remove portfolio page
                </button>
              </div>
            </div>

            {/* Individual personal portfolio metrics calculation details */}
            {(() => {
              const personTxs = [...transactions]
                .filter(t => t.party.trim().toLowerCase() === selectedPerson.toLowerCase())
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
              const creditsSum = personTxs.filter(t => t.type === TransactionType.CREDIT).reduce((sum, t) => sum + t.amount, 0);
              const debitsSum = personTxs.filter(t => t.type === TransactionType.DEBIT).reduce((sum, t) => sum + t.amount, 0);
              const netUnpaidBalance = debitsSum - creditsSum;

              return (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* Ledger metric Bento grids */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Position standing card */}
                    <div className={`p-6 rounded-3xl border flex flex-col justify-between min-h-[160px] relative overflow-hidden transition-all duration-300 hover:scale-[1.01] ${
                      netUnpaidBalance > 0 
                        ? theme === 'dark'
                          ? 'bg-emerald-950/25 border-emerald-500/25 shadow-xl shadow-emerald-500/5' 
                          : 'bg-emerald-50/50 border-emerald-200 shadow-xl shadow-emerald-100'
                        : netUnpaidBalance < 0 
                        ? theme === 'dark'
                          ? 'bg-rose-950/25 border-rose-500/25 shadow-xl shadow-rose-500/5' 
                          : 'bg-rose-50/50 border-rose-200 shadow-xl shadow-rose-100'
                        : theme === 'dark'
                        ? 'glass-card border-zinc-800'
                        : 'glass-card-light border-zinc-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-black tracking-widest uppercase font-mono ${
                          theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'
                        }`}>Ledger Position standing</span>
                        <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-widest border font-mono ${
                          netUnpaidBalance > 0 
                            ? theme === 'dark'
                              ? 'bg-emerald-950 text-emerald-400 border-emerald-900' 
                              : 'bg-emerald-100 text-emerald-850 border-emerald-250/50'
                            : netUnpaidBalance < 0 
                            ? theme === 'dark'
                              ? 'bg-rose-950 text-rose-400 border-rose-900' 
                              : 'bg-rose-100 text-rose-850 border-rose-250/50'
                            : theme === 'dark'
                            ? 'bg-zinc-950 text-zinc-500 border-zinc-805'
                            : 'bg-zinc-100 text-zinc-555 border-zinc-200'
                        }`}>
                          {netUnpaidBalance > 0 ? 'Pending repayment' : netUnpaidBalance < 0 ? 'Pending debt' : 'Completely Cleared'}
                        </span>
                      </div>
                      
                      <div className="mt-3">
                        <div className={`text-3.5xl font-black font-mono tracking-tight leading-none ${
                          netUnpaidBalance > 0 ? 'text-emerald-500' : netUnpaidBalance < 0 ? 'text-rose-500' : (theme === 'dark' ? 'text-zinc-200' : 'text-zinc-800')
                        }`}>
                          ₹{Math.abs(netUnpaidBalance).toLocaleString('en-IN')}
                        </div>
                        
                        <p className={`text-[11px] mt-1.5 leading-relaxed ${
                          theme === 'dark' ? 'text-zinc-405' : 'text-zinc-600 font-medium'
                        }`}>
                          {netUnpaidBalance > 0 
                            ? `${selectedPerson} owes you this outstanding split amount.`
                            : netUnpaidBalance < 0 
                            ? `You owe this outstanding split amount to ${selectedPerson}.`
                            : 'Awesome! All mutual accounts are settled perfectly.'}
                        </p>
                      </div>

                      {/* Settlement trigger generator */}
                      {netUnpaidBalance !== 0 && (
                        <button
                          id="btn-quick-settle-action"
                          onClick={() => handleQuickSettle(selectedPerson, netUnpaidBalance)}
                          className={`mt-4 py-2.5 rounded-xl text-center text-xs font-black border transition-colors uppercase tracking-wider font-mono cursor-pointer ${
                            theme === 'dark' 
                              ? 'bg-zinc-950 hover:bg-emerald-500 text-zinc-300 hover:text-zinc-950 border-zinc-800' 
                              : 'bg-white hover:bg-emerald-500 hover:text-zinc-950 text-zinc-700 border-zinc-200 hover:border-emerald-500 shadow-sm'
                          }`}
                        >
                          Auto Settle Outstanding Balance &rarr;
                        </button>
                      )}
                    </div>

                    {/* Paid/Spent (Debits) card */}
                    <div className={`p-6 rounded-3xl flex flex-col justify-between min-h-[160px] transition-all duration-300 hover:scale-[1.01] border ${
                      theme === 'dark' 
                        ? 'glass-card border-zinc-850/80 hover:border-rose-500/10' 
                        : 'glass-card-light border-zinc-200 hover:border-rose-500/10 shadow-zinc-200/40 text-zinc-850'
                    }`}>
                      <div>
                        <span className={`text-[10px] font-black tracking-widest uppercase block font-mono ${
                          theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'
                        }`}>My outlays (Debits)</span>
                        <span className="text-[10px] text-zinc-500">Total money lent or spent on {selectedPerson}</span>
                      </div>
                      <div className="mt-4">
                        <div className={`text-3xl font-black font-mono tracking-tight ${theme === 'dark' ? 'text-rose-400' : 'text-rose-600'}`}>
                          - ₹{debitsSum.toLocaleString('en-IN')}
                        </div>
                        <p className={`text-xs font-semibold mt-1 ${theme === 'dark' ? 'text-zinc-550' : 'text-zinc-500'}`}>{personTxs.filter(t => t.type === TransactionType.DEBIT).length} outlays registered</p>
                      </div>
                    </div>

                    {/* Received (Credits) card */}
                    <div className={`p-6 rounded-3xl flex flex-col justify-between min-h-[160px] transition-all duration-300 hover:scale-[1.01] border ${
                      theme === 'dark' 
                        ? 'glass-card border-zinc-850/80 hover:border-emerald-500/10' 
                        : 'glass-card-light border-zinc-200 hover:border-emerald-500/10 shadow-zinc-200/40 text-zinc-850'
                    }`}>
                      <div>
                        <span className={`text-[10px] font-black tracking-widest uppercase block font-mono ${
                          theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'
                        }`}>Repayments (Credits)</span>
                        <span className="text-[10px] text-zinc-500">Repayments cleared or income from them</span>
                      </div>
                      <div className="mt-4">
                        <div className={`text-3xl font-black font-mono tracking-tight ${theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}>
                          + ₹{creditsSum.toLocaleString('en-IN')}
                        </div>
                        <p className={`text-xs font-semibold mt-1 ${theme === 'dark' ? 'text-zinc-550' : 'text-zinc-500'}`}>{personTxs.filter(t => t.type === TransactionType.CREDIT).length} settlements registered</p>
                      </div>
                    </div>

                  </div>

                  {/* Pre-populated Smart natural language invoice container */}
                  <div className={`p-6 rounded-3xl shadow-2xl relative overflow-hidden border ${
                    theme === 'dark' ? 'glass-card border-zinc-850/80' : 'glass-card-light border-zinc-200 shadow-zinc-200/40'
                  }`}>
                    <div className="absolute top-0 right-0 w-44 h-44 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
                    <div>
                      <h4 className={`text-xs font-black uppercase tracking-wider flex items-center gap-2 font-display ${
                        theme === 'dark' ? 'text-white' : 'text-zinc-800'
                      }`}>
                        <Sparkles className="w-5 h-5 text-emerald-555" />
                        AI Split Assistant for {selectedPerson}
                      </h4>
                      <p className={`text-xs mt-1 leading-relaxed ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-650'}`}>
                        Input casual comments specifically for <strong>{selectedPerson}</strong>. The assistant will automatically associate the contact and split category.
                      </p>
                    </div>

                    <div className={`mt-4 relative flex items-center border rounded-xl p-1.5 shadow-inner transition-colors focus-within:border-emerald-500 ${
                      theme === 'dark' ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-250'
                    }`}>
                      <input
                        id="txt-person-smart-input"
                        type="text"
                        value={personSmartInput}
                        onChange={(e) => setPersonSmartInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handlePersonSmartParse(selectedPerson);
                        }}
                        placeholder={`e.g. Lent 400 for movie (Will force party association with ${selectedPerson})`}
                        className={`w-full bg-transparent px-3 py-2 text-xs outline-none focus:outline-none placeholder-zinc-500 font-medium ${
                          theme === 'dark' ? 'text-zinc-100' : 'text-zinc-805'
                        }`}
                        disabled={isPersonParsing}
                      />

                      {isPersonParsing && (
                        <div className="flex items-center gap-1.5 text-zinc-500 mr-2 shrink-0 font-mono text-[10px]">
                          <RefreshCw className="w-3 h-3 animate-spin text-emerald-400" />
                          Parsing NLP...
                        </div>
                      )}

                      <button
                        id="btn-submit-person-parse"
                        onClick={() => handlePersonSmartParse(selectedPerson)}
                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-lg text-xs shrink-0 transition-colors cursor-pointer"
                        disabled={!personSmartInput.trim() || isPersonParsing}
                      >
                        Submit Parse
                      </button>
                    </div>
                  </div>

                  {/* Transaction historical log specific to the select person portfolio */}
                  <div className={`rounded-2xl overflow-hidden shadow-2xl border ${
                    theme === 'dark' ? 'bg-zinc-900 border-zinc-850' : 'bg-white border-zinc-200'
                  }`}>
                    
                    <div className={`p-5 border-b flex items-center justify-between ${
                      theme === 'dark' ? 'border-zinc-850 bg-zinc-950' : 'border-zinc-150 bg-zinc-50/50'
                    }`}>
                      <div>
                        <h4 className={`text-xs font-bold uppercase tracking-widest font-mono ${
                          theme === 'dark' ? 'text-white' : 'text-zinc-800'
                        }`}>
                          Statement timeline log ({personTxs.length} items)
                        </h4>
                        <p className="text-[10px] text-zinc-500 mt-1">Independent historic transaction ledger specifically involving {selectedPerson}</p>
                      </div>
                    </div>

                    <div className={`divide-y ${theme === 'dark' ? 'divide-zinc-850' : 'divide-zinc-150'}`}>
                      {personTxs.length === 0 ? (
                        <div className="p-16 text-center text-zinc-500">
                          <Info className="w-8 h-8 mx-auto mb-2 text-zinc-400" />
                          <p className="text-xs font-semibold">No transactions registered specifically for {selectedPerson}</p>
                          <p className="text-[10px] text-zinc-550 mt-1">Use the pre-configured parsing field above to record a trade or debt repayment.</p>
                        </div>
                      ) : (
                        personTxs.map((tx) => (
                          <div 
                            key={tx.id} 
                            id={`person-tx-row-${tx.id}`}
                            className={`p-4.5 flex items-center justify-between gap-4 transition-colors animate-fadeIn ${
                              theme === 'dark' ? 'hover:bg-zinc-950/40' : 'hover:bg-zinc-50'
                            }`}
                          >
                            <div className="flex items-center gap-3.5">
                              <div className={`p-2.5 rounded-xl border flex items-center justify-center shrink-0 ${
                                tx.type === TransactionType.CREDIT
                                  ? theme === 'dark'
                                    ? 'bg-emerald-955/60 border-emerald-900 text-emerald-450'
                                    : 'bg-emerald-50 border-emerald-250/60 text-emerald-650'
                                  : theme === 'dark'
                                  ? 'bg-rose-955/60 border-rose-955 text-rose-450'
                                  : 'bg-rose-50 border-rose-250/60 text-rose-650'
                              }`}>
                                {tx.type === TransactionType.CREDIT ? (
                                  <ArrowDownLeft className="w-4 h-4" />
                                ) : (
                                  <ArrowUpRight className="w-4 h-4" />
                                )}
                              </div>

                              <div>
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase font-mono tracking-wide ${
                                  theme === 'dark'
                                    ? 'bg-zinc-950 border border-zinc-800 text-emerald-400'
                                    : 'bg-emerald-50 border border-emerald-200 text-emerald-705'
                                }`}>
                                  {tx.category}
                                </span>
                                <p className={`text-xs font-bold mt-1.5 ${theme === 'dark' ? 'text-zinc-200' : 'text-zinc-700'}`}>{tx.notes}</p>
                                <div className={`flex items-center gap-1.5 text-[10px] mt-1 ${theme === 'dark' ? 'text-zinc-550' : 'text-zinc-400'}`}>
                                  <Calendar className="w-3 h-3 text-zinc-500" />
                                  <span>{new Date(tx.timestamp).toLocaleString()}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 shrink-0 justify-end">
                              <div className="text-right">
                                <span className={`text-base font-black font-mono ${
                                  tx.type === TransactionType.CREDIT 
                                    ? theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
                                    : theme === 'dark' ? 'text-rose-450' : 'text-rose-600'
                                }`}>
                                  {tx.type === TransactionType.CREDIT ? '+' : '-'} ₹{tx.amount.toLocaleString('en-IN')}
                                </span>
                                <span className="text-[8px] font-mono uppercase text-zinc-500 block mt-0.5">Confirmed Status</span>
                              </div>

                              <button
                                id={`person-row-delete-btn-${tx.id}`}
                                onClick={() => deleteTransaction(tx.id)}
                                className={`p-2 rounded-xl transition-all cursor-pointer ${
                                  theme === 'dark' 
                                    ? 'hover:bg-rose-955/20 text-zinc-600 hover:text-rose-400' 
                                    : 'hover:bg-rose-50 text-zinc-400 hover:text-rose-650'
                                }`}
                                title="Delete this transaction entry"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                  </div>

                </div>
              );
            })()}

          </div>
        )}

      </div>
    )}

        {/* Developer specifications console toggle */}
        {showDeveloperLogs && (
          <section id="developer-deck-section" className="space-y-4 animate-fadeIn">
            <DeveloperDeck />
          </section>
        )}

      </main>

      {/* Aesthetic Footer */}
      <footer id="app-footer" className="border-t border-zinc-900 bg-zinc-950 py-8 mt-12 text-zinc-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-2">
          <p className="font-semibold text-zinc-400">🔒 100% Client-Side Privacy Guaranteed</p>
          <p className="max-w-md mx-auto text-[11px] text-zinc-500">
            Account ledger transactions, debts, credits, and profiles never stream to personal backends. Natural-language entries are safely compiled server-side with anonymized prompts.
          </p>
          <div className="pt-2 text-[10px] text-zinc-600">
            Private Account Ledger Built for High Performance
          </div>
        </div>
      </footer>

      {/* Custom Confirmation Dialog Modal Overlay (solves iframe alert/confirm blockage) */}
      {confirmDialog.isOpen && (
        <div id="custom-confirm-modal" className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scaleUp">
            <h3 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
              <span className={confirmDialog.isDestructive ? "text-rose-500" : "text-emerald-400"}>⚠️</span>
              {confirmDialog.title}
            </h3>
            <p className="text-xs text-zinc-350 leading-relaxed">
              {confirmDialog.message}
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                id="btn-confirm-cancel"
                onClick={() => setConfirmDialog(p => ({ ...p, isOpen: false }))}
                className="px-4 py-2 bg-zinc-950 border border-zinc-850 hover:bg-zinc-800 text-zinc-150 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
              >
                {confirmDialog.cancelText}
              </button>
              <button
                id="btn-confirm-action"
                onClick={confirmDialog.onConfirm}
                className={`px-4 py-2 font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                  confirmDialog.isDestructive 
                    ? 'bg-rose-500 hover:bg-rose-450 text-zinc-950' 
                    : 'bg-emerald-500 hover:bg-emerald-450 text-zinc-950'
                }`}
              >
                {confirmDialog.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Alert Dialog Modal Overlay (solves iframe alert/confirm blockage) */}
      {alertDialog.isOpen && (
        <div id="custom-alert-modal" className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scaleUp">
            <h3 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
              <span className="text-emerald-400">ℹ️</span>
              {alertDialog.title}
            </h3>
            <p className="text-xs text-zinc-350 leading-relaxed">
              {alertDialog.message}
            </p>
            <div className="flex items-center justify-end pt-2">
              <button
                id="btn-alert-close"
                onClick={() => setAlertDialog(p => ({ ...p, isOpen: false }))}
                className="px-5 py-2 bg-emerald-500 hover:bg-emerald-450 text-zinc-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scanned Results Multi-Add Success Modal overlay */}
      {showScanSuccessModal && (
        <div id="modal-scan-success" className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-zinc-900 border border-emerald-500/30 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 animate-scaleUp">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-zinc-850 pb-4">
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2 uppercase tracking-wider font-mono">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  Analysis Successful: Ledger Synchronized
                </h3>
                <p className="text-xs text-zinc-400">
                  Gemini multimodal OCR has processed your paper scan and automatically added the following {scannedTxs.length} records chronologically.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowScanSuccessModal(false)}
                className="p-1 px-1.5 bg-zinc-950 border border-zinc-800 text-zinc-500 hover:text-white rounded-lg text-xs cursor-pointer flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scanned Table listing */}
            <div className="max-h-80 overflow-y-auto space-y-4 pr-2 divide-y divide-zinc-850">
              {scannedTxs.map((item, idx) => (
                <div key={item.id} className="pt-4 first:pt-0 flex items-center justify-between gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-lg font-mono text-[9px] uppercase font-bold ${
                        item.type === TransactionType.CREDIT
                          ? 'bg-emerald-950/60 border border-emerald-900/60 text-emerald-400'
                          : 'bg-rose-950/60 border border-rose-900/60 text-rose-400'
                      }`}>
                        {item.type}
                      </span>
                      <span className="font-semibold text-zinc-300">
                        Date: {new Date(item.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="font-bold text-zinc-100">{item.notes}</p>
                    <div className="text-[10px] text-zinc-500 flex items-center gap-3 font-mono">
                      <span>Party: <strong className="text-zinc-400 font-medium">{item.party}</strong></span>
                      <span>•</span>
                      <span>Category: <strong className="text-zinc-400 font-medium">{item.category}</strong></span>
                    </div>
                  </div>
                  <div className={`font-mono font-black text-sm text-right leading-none ${
                    item.type === TransactionType.CREDIT ? 'text-emerald-400' : 'text-rose-400'
                  }`}>
                    {item.type === TransactionType.CREDIT ? '+' : '-'} ₹{item.amount.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
                  </div>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-850">
              <button
                type="button"
                onClick={() => setShowScanSuccessModal(false)}
                className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-450 text-zinc-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md shadow-emerald-950/20"
              >
                Excellent, View on Ledger
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
