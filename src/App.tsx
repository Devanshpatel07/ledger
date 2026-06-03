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
  Lock
} from 'lucide-react';
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
      setSyncNotice({ type: 'error', text: 'Authentication failed. Please check browser popups & Drive permission access.' });
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
      },
      { confirmText: "Restore & Overwrite", isDestructive: true }
    );
  };

  const handleGoogleLogout = async () => {
    try {
      await logoutWithGoogle();
      setGoogleUser(null);
      setGoogleAccessToken(null);
      setSyncNotice({ type: 'ref', text: 'You have been logged out from your Google account session.' });
    } catch (err: any) {
      console.error('Logout failed:', err);
    }
  };

  // Inject a Mock template command to demonstrate voice capability easily in iframe standard environments
  const clickTemplateTrigger = (command: string) => {
    setSmartInput(command);
    handleSmartParse(command);
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      'from-rose-500 to-pink-500 text-rose-50',
      'from-emerald-500 to-teal-500 text-emerald-50',
      'from-blue-600 to-indigo-550 text-blue-50',
      'from-amber-500 to-orange-500 text-amber-50',
      'from-purple-500 to-violet-500 text-violet-50',
      'from-cyan-500 to-sky-500 text-cyan-50',
    ];
    let sum = 0;
    for (let i = 0; i < name.length; i++) {
      sum += name.charCodeAt(i);
    }
    return colors[sum % colors.length];
  };

  const handleCreateNewPerson = () => {
    const trimmed = newPersonName.trim();
    if (!trimmed) return;
    if (trimmed.toLowerCase() === 'self') {
      triggerAlert("Name Reserved", "Name 'Self' is reserved for internal entries.");
      return;
    }
    const exists = customPeople.some(p => p.toLowerCase() === trimmed.toLowerCase());
    if (exists) {
      triggerAlert("Profile Exists", `${trimmed} profile already exists in directory.`);
      return;
    }
    setCustomPeople(prev => [trimmed, ...prev]);
    setNewPersonName('');
    setSelectedPerson(trimmed);
  };

  const handlePersonSmartParse = async (personName: string) => {
    if (!personSmartInput.trim()) return;

    setIsPersonParsing(true);
    setParserNotice(null);

    try {
      const response = await fetch('/api/parse-transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sentence: `${personSmartInput} with ${personName}` }),
      });

      if (!response.ok) {
        throw new Error('API parsing failure');
      }

      const parsed = await response.json();
      const parsedAmount = typeof parsed.amount === 'number' ? parsed.amount : parseFloat(parsed.amount) || 0;
      const parsedType = parsed.type === 'Credit' ? TransactionType.CREDIT : TransactionType.DEBIT;

      setReviewData({
        amount: parsedAmount,
        type: parsedType,
        party: personName, // enforce person
        category: parsed.category || 'Other',
        notes: parsed.notes || personSmartInput,
        success: true
      });

      setManualAmount(parsedAmount);
      setManualType(parsedType);
      setManualParty(personName);
      setManualCategory(parsed.category || 'Other');
      setManualNotes(parsed.notes || personSmartInput);

      setParserNotice(parsed.parserUsed || 'Smart NLP Parser');
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
  const filteredTransactions = transactions.filter(tx => {
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
    <div id="main-ledger-app" className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col antialiased">
      
      {/* Dynamic Header */}
      <header id="app-header" className="border-b border-zinc-900 bg-zinc-900/40 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-950/80 border border-emerald-800 text-emerald-400 rounded-xl shadow-glow">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-semibold block leading-none">Local-First</span>
              <h1 className="text-md sm:text-lg font-extrabold tracking-tight text-white leading-tight">Private Account Ledger</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              id="btn-toggle-logs"
              onClick={() => setShowDeveloperLogs(!showDeveloperLogs)}
              className="text-xs transition-colors px-3 py-1.5 rounded-lg border border-zinc-800 text-zinc-400 hover:text-emerald-400 hover:bg-zinc-900 flex items-center gap-1.5 cursor-pointer font-medium"
            >
              <Code className="w-3.5 h-3.5" />
              {showDeveloperLogs ? "Hide Specs" : "View Specs"}
            </button>
            <button 
              id="btn-clear-database"
              onClick={handleDeleteLocalLedger}
              className="text-xs transition-colors text-zinc-500 hover:text-rose-450 hover:bg-rose-950/20 px-3 py-1.5 border border-transparent rounded-lg hover:border-rose-900/30 cursor-pointer active:scale-95"
              title="Permanently wipe all local ledger logs and custom profile contacts"
            >
              Delete Ledger
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        
        {/* Navigation Tabs Bar */}
        <div className="flex bg-zinc-900/60 p-1 rounded-2xl border border-zinc-850 gap-1.5 shadow-xl animate-fadeIn">
          <button
            id="tab-btn-dashboard"
            onClick={() => {
              setActiveMainTab('dashboard');
              setSelectedPerson(null);
            }}
            className={`flex-1 py-3 text-xs uppercase tracking-wider font-extrabold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeMainTab === 'dashboard'
                ? 'bg-zinc-800 text-emerald-400 border border-zinc-700/50 shadow-md font-black'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-950/40'
            }`}
          >
            <FileText className="w-4 h-4" />
            General Ledger Dashboard
          </button>
          <button
            id="tab-btn-people"
            onClick={() => {
              setActiveMainTab('people');
            }}
            className={`flex-1 py-3 text-xs uppercase tracking-wider font-extrabold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeMainTab === 'people'
                ? 'bg-zinc-800 text-emerald-400 border border-zinc-700/55 shadow-md font-black'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-950/40'
            }`}
          >
            <Users className="w-4 h-4" />
            People & Contacts Directory
          </button>
        </div>

        {/* Google Drive Cloud Sync & Backup Dashboard */}
        <section id="google-drive-sync-panel" className="bg-zinc-900/40 p-5 rounded-2xl border border-zinc-850 shadow-xl animate-fadeIn space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div className="flex items-start gap-3.5">
              <div className="p-3 bg-zinc-950 border border-zinc-800 text-emerald-400 rounded-2xl shrink-0">
                <Cloud className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold text-white tracking-wide uppercase flex items-center gap-2 font-mono">
                  Google Drive Cloud Backup Vault 
                  <span className="text-[9px] tracking-normal font-sans font-bold bg-emerald-950 border border-emerald-800/60 text-emerald-400 px-2 py-0.5 rounded">
                    OAuth Secure
                  </span>
                </h3>
                <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
                  Safely push or pull your entire personal ledger transactions database and contacts profile pages to your personal Google Drive account directory.
                </p>
                {lastSyncChecked && (
                  <p className="text-[10px] text-zinc-550 font-mono">
                    Last active sync check: {lastSyncChecked}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {isSyncing ? (
                <div className="flex items-center gap-2 text-zinc-400 text-xs font-mono bg-zinc-950 px-4 py-2.5 rounded-xl border border-zinc-850">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                  Syncing Cloud...
                </div>
              ) : !googleUser ? (
                <button
                  id="btn-google-sign-in"
                  onClick={handleGoogleLogin}
                  className="flex items-center gap-2.5 px-5 py-2.5 bg-zinc-900 hover:bg-zinc-805 text-zinc-100 font-extrabold text-xs uppercase tracking-wider rounded-xl border border-zinc-800 transition-colors shadow-lg hover:border-emerald-500/30 cursor-pointer active:scale-97"
                >
                  <LogIn className="w-4 h-4 text-emerald-400" />
                  Enable Google Drive Sync
                </button>
              ) : (
                <div className="flex flex-wrap items-center gap-2.5 bg-zinc-950/60 p-1.5 rounded-xl border border-zinc-850">
                  
                  {/* Google User Identity profile tag */}
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 border border-zinc-805 bg-zinc-900/85 rounded-lg text-xs">
                    <div className="w-5 h-5 rounded-full bg-emerald-500 text-zinc-900 flex items-center justify-center font-black text-[10px] uppercase">
                      {googleUser.displayName?.charAt(0) || googleUser.email?.charAt(0) || 'G'}
                    </div>
                    <span className="text-zinc-300 font-semibold truncate max-w-[120px]">
                      {googleUser.displayName || googleUser.email}
                    </span>
                  </div>

                  <button
                    id="btn-drive-backup-trigger"
                    onClick={handleBackupToDrive}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs uppercase tracking-wide rounded-lg transition-colors cursor-pointer"
                    title="Write Ledger snapshot back output to Google Drive file space"
                  >
                    <CloudUpload className="w-3.5 h-3.5" />
                    Backup Ledger
                  </button>

                  <button
                    id="btn-drive-restore-trigger"
                    onClick={handleRestoreFromDrive}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-805 text-zinc-350 hover:text-white font-extrabold text-xs uppercase tracking-wide rounded-lg border border-zinc-800 transition-colors cursor-pointer"
                    title="Read, verify, and resolve backup from your Google Drive files"
                  >
                    <CloudDownload className="w-3.5 h-3.5 text-emerald-400" />
                    Restore Backup
                  </button>

                  <button
                    id="btn-drive-delete-trigger"
                    onClick={handleDeleteCloudBackup}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-zinc-950 border border-zinc-850 hover:bg-rose-950/35 hover:border-rose-900/60 text-zinc-400 hover:text-rose-400 font-extrabold text-xs uppercase tracking-wide rounded-lg transition-colors cursor-pointer"
                    title="Delete backup file permanently from Google Drive"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                    Delete Cloud Backup
                  </button>

                  <button
                    id="btn-google-sign-out"
                    onClick={handleGoogleLogout}
                    className="p-1.5 px-2 bg-zinc-950 border border-zinc-850 hover:border-rose-955/40 text-zinc-500 hover:text-rose-400 rounded-lg text-xs transition-colors cursor-pointer"
                    title="Sign out from Google Session"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Sync notice toast notifications */}
          {syncNotice && (
            <div className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 text-xs animate-fadeIn ${
              syncNotice.type === 'success' 
                ? 'bg-emerald-950/45 border-emerald-900/50 text-emerald-400' 
                : syncNotice.type === 'error' 
                ? 'bg-rose-955/35 border-rose-955/40 text-rose-350' 
                : 'bg-zinc-950 border-zinc-850 text-zinc-450'
            }`}>
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 shrink-0" />
                <span>{syncNotice.text}</span>
              </div>
              <button 
                onClick={() => setSyncNotice(null)}
                className="text-zinc-500 hover:text-zinc-300 text-xs shrink-0 cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}
        </section>

        {activeMainTab === 'dashboard' ? (
          <>
        
        {/* Net Position Banner Deck with Beautiful Bento Layout */}
        <section id="net-position-deck" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Bento Panel 1: Net Balance */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 shadow-xl flex flex-col justify-between min-h-[140px] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-400 tracking-wider uppercase">Net Financial Position</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                netPosition >= 0 ? 'bg-emerald-950 text-emerald-400 border border-emerald-900' : 'bg-rose-950 text-rose-400 border border-rose-900'
              }`}>
                {netPosition >= 0 ? 'Surplus' : 'Deficit'}
              </span>
            </div>
            <div className="mt-4">
              <div className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-1">
                <span className="text-emerald-400 text-2.5xl">₹</span>
                {netPosition.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
              </div>
              <p className="text-xs text-zinc-500 mt-2">Aggregate ledger calculation across all social parties & categories</p>
            </div>
          </div>

          {/* Bento Panel 2: Total Credits (In) */}
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-900 shadow-xl flex flex-col justify-between min-h-[140px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-400 tracking-wider uppercase">Total Income (In)</span>
              <div className="p-1 px-2 text-[10px] bg-zinc-800 text-emerald-400 rounded-lg flex items-center gap-1 border border-zinc-800">
                <ArrowDownLeft className="w-3 h-3" /> Money Received
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2.5xl font-extrabold text-emerald-400 flex items-center gap-0.5">
                + ₹{totalIn.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
              </div>
              <p className="text-xs text-zinc-500 mt-2">Cumulative cash balance inflows or salaries recovered</p>
            </div>
          </div>

          {/* Bento Panel 3: Total Debits (Out) */}
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-900 shadow-xl flex flex-col justify-between min-h-[140px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-400 tracking-wider uppercase">Total Expense (Out)</span>
              <div className="p-1 px-2 text-[10px] bg-zinc-800 text-rose-400 rounded-lg flex items-center gap-1 border border-zinc-800">
                <ArrowUpRight className="w-3 h-3" /> Money Paid
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2.5xl font-extrabold text-rose-400 flex items-center gap-0.5">
                - ₹{totalOut.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
              </div>
              <p className="text-xs text-zinc-500 mt-2">Cumulative cash spent on dining, rent, or social loans</p>
            </div>
          </div>
        </section>

        {/* Smart natural-language input field & floating voice activator */}
        <section id="smart-entry-card" className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-widest flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                SMART NATURAL LANGUAGE TRANSACTION INJECTOR
              </h3>
              <p className="text-xs text-zinc-400">
                Type or speak commands casually. The AI will parse details with millisecond precision.
              </p>
            </div>
            
            {/* Quick Helper Speech Recognition Notice */}
            {isListening && (
              <div className="flex items-center gap-2 bg-emerald-950/80 border border-emerald-900 text-emerald-400 rounded-full px-3 py-1 font-mono text-xs text-center animate-pulse">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Listening actively... Speak now
              </div>
            )}
          </div>

          {/* Core Input with mic floating activator */}
          <div className="relative flex items-center bg-zinc-950 border border-zinc-800 rounded-xl focus-within:border-emerald-500 transition-colors p-1.5 shadow-inner">
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
              className="w-full bg-transparent px-4 py-3 text-sm focus:outline-none placeholder-zinc-500 text-zinc-100"
              disabled={isParsing || isListening}
            />

            {/* Microscopic Status Indicator inside input */}
            {isParsing && (
              <div className="flex items-center gap-1.5 text-zinc-500 mr-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                <span className="text-xs font-mono">Parsing...</span>
              </div>
            )}

            {/* Microphone floating activator button */}
            <button
              id="btn-voice-capture-float"
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
                  onClick={() => clickTemplateTrigger('Spent 500 on dinner with Arjun')}
                  className="px-2.5 py-1 bg-zinc-950 hover:bg-zinc-800 text-[11px] text-zinc-400 rounded-md border border-zinc-850 hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  "Spent 500 on dinner with Arjun"
                </button>
                <button
                  id="btn-sample-2"
                  onClick={() => clickTemplateTrigger('Salary credit of 80000 from client')}
                  className="px-2.5 py-1 bg-zinc-950 hover:bg-zinc-800 text-[11px] text-zinc-400 rounded-md border border-zinc-850 hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  "Salary credit of 80000"
                </button>
                <button
                  id="btn-sample-3"
                  onClick={() => clickTemplateTrigger('Paid 1500 to landlord')}
                  className="px-2.5 py-1 bg-zinc-950 hover:bg-zinc-800 text-[11px] text-zinc-400 rounded-md border border-zinc-850 hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  "Paid 1500 to landlord"
                </button>
              </div>
            </div>

            <button
              id="btn-submit-smart-parse"
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
        </section>

        {/* Smart Entry Inline Reviewer & Adjuster panel */}
        {showReviewModal && (
          <div id="modal-review-transaction" className="p-6 rounded-2xl bg-zinc-900 border border-emerald-500/40 relative shadow-2xl transition-all animate-fadeIn">
            <div className="absolute top-2 right-2">
              <button 
                id="btn-close-review"
                onClick={() => setShowReviewModal(false)}
                className="p-1 px-[5px] bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white rounded-lg text-xs"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-2.5 text-emerald-400 font-bold tracking-wider text-xs uppercase mb-4 mb-2">
              <Sparkles className="w-4 h-4 animate-pulse" />
              Parsed Ledger Draft Review
              {parserNotice && (
                <span className="text-[10px] tracking-normal font-mono bg-emerald-950 border border-emerald-800 text-emerald-400 px-2 py-0.5 rounded ml-2">
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
                  className="bg-zinc-950 border border-zinc-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-sm text-zinc-200 outline-none w-full"
                />
              </div>

              {/* Draft Type Column */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Type</label>
                <select
                  id="inp-review-type"
                  value={manualType}
                  onChange={(e) => setManualType(e.target.value as TransactionType)}
                  className="bg-zinc-950 border border-zinc-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-sm text-zinc-200 outline-none w-full cursor-pointer"
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
                  className="bg-zinc-950 border border-zinc-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-sm text-zinc-200 outline-none w-full"
                />
              </div>

              {/* Draft Category Column */}
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Category</label>
                <select
                  id="inp-review-category"
                  value={manualCategory}
                  onChange={(e) => setManualCategory(e.target.value)}
                  className="bg-zinc-950 border border-zinc-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-sm text-zinc-200 outline-none w-full cursor-pointer"
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
                  className="bg-zinc-950 border border-zinc-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-sm text-zinc-200 outline-none w-full"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-4 pt-3 border-t border-zinc-850">
              <button
                id="btn-review-cancel"
                onClick={() => setShowReviewModal(false)}
                className="px-4 py-2 bg-transparent hover:bg-zinc-800 text-zinc-400 rounded-lg text-xs cursor-pointer transition-colors"
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
            <div id="category-breakdown-card" className="bg-zinc-900 border border-zinc-850 rounded-2xl p-6 shadow-xl">
              <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-widest flex items-center gap-1.5 mb-4">
                <FolderOpen className="w-4 h-4 text-emerald-400" /> Expense Allocation
              </h3>

              {transactions.filter(tx => tx.type === TransactionType.DEBIT).length === 0 ? (
                <div className="text-center py-6 text-zinc-500 text-xs text-center leading-relaxed">
                  No debit records logged yet. Use the smart input field above to log a dining or rent debit transaction.
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(categorySummary).map(([category, amount]) => {
                    const percent = Math.round((amount / totalOut) * 100) || 0;
                    return (
                      <div key={category} className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-zinc-200 flex items-center gap-1.5">
                            <Tag className="w-3 h-3 text-zinc-500" />
                            {category}
                          </span>
                          <span className="text-zinc-400 font-medium">
                            ₹{amount.toLocaleString('en-IN')} ({percent}%)
                          </span>
                        </div>
                        <div className="w-full bg-zinc-950 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-1.5 rounded-full"
                            style={{ width: `${(amount / maxCategoryDebit) * 100}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  <p className="text-[10px] text-zinc-500 font-mono mt-3 text-center border-t border-zinc-850 pt-2">
                    * Showing category debit distributions of total ₹{totalOut.toLocaleString('en-IN')}
                  </p>
                </div>
              )}
            </div>

            {/* Quick Balance Statement Card */}
            <div id="quick-statement-card" className="bg-zinc-900 border border-zinc-850 rounded-2xl p-6 shadow-xl">
              <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-widest flex items-center gap-1.5 mb-4">
                <TrendingUp className="w-4 h-4 text-emerald-400" /> Smart Ledger Audit
              </h3>
              <div className="space-y-3 font-mono text-xs text-zinc-400">
                <div className="flex justify-between border-b border-zinc-850 pb-1.5">
                  <span>Inflow Volume</span>
                  <span className="text-emerald-400 font-semibold">{transactions.filter(t => t.type === TransactionType.CREDIT).length} Credits</span>
                </div>
                <div className="flex justify-between border-b border-zinc-850 pb-1.5">
                  <span>Outflow Volume</span>
                  <span className="text-rose-400 font-semibold">{transactions.filter(t => t.type === TransactionType.DEBIT).length} Debits</span>
                </div>
                <div className="flex justify-between border-b border-zinc-850 pb-1.5">
                  <span>Local Backup State</span>
                  <span className="text-zinc-300">Synchronized (IndexedDB)</span>
                </div>
                <div className="flex justify-between">
                  <span>Secure Encryption</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">✔ Local-Only</span>
                </div>
              </div>
            </div>
            
          </div>

          {/* Right Column (Transactions Feed/Table, 8 columns) */}
          <div id="transactions-feed" className="lg:col-span-8 bg-zinc-900 border border-zinc-850 rounded-2xl overflow-hidden shadow-xl">
            
            {/* Table Header / Filter Suite */}
            <div className="p-5 border-b border-zinc-850 bg-zinc-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-extrabold text-zinc-100 flex items-center gap-1.5 uppercase tracking-wide">
                  <FileText className="w-4 h-4 text-emerald-400" /> Account Entry ledger Log
                </h3>
                <p className="text-[11px] text-zinc-400">Showing {filteredTransactions.length} of {transactions.length} local records</p>
              </div>

              {/* Filtering Controls */}
              <div className="flex flex-wrap items-center gap-2">
                
                {/* Search Bar */}
                <div className="relative flex items-center bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1 text-xs">
                  <Search className="w-3.5 h-3.5 text-zinc-550 mr-1.5" />
                  <input
                    id="txt-search-ledger"
                    type="text"
                    placeholder="Search query..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent border-none focus:outline-none placeholder-zinc-500 text-zinc-200 text-xs w-32"
                  />
                </div>

                {/* Type Filter */}
                <select
                  id="sel-type-filter"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 hover:border-zinc-750 text-zinc-300 text-[11px] rounded-lg px-2 py-1.5 transition-colors cursor-pointer"
                >
                  <option value="All">All Types</option>
                  <option value={TransactionType.CREDIT}>Credits only</option>
                  <option value={TransactionType.DEBIT}>Debits only</option>
                </select>

                {/* Category Filter */}
                <select
                  id="sel-category-filter"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="bg-zinc-900 border border-zinc-800 hover:border-zinc-750 text-zinc-300 text-[11px] rounded-lg px-2 py-1.5 transition-colors cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  {categoriesList.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                
              </div>
            </div>

            {/* List Body */}
            <div className="divide-y divide-zinc-850">
              {filteredTransactions.length === 0 ? (
                <div className="p-12 text-center text-zinc-500">
                  <Info className="w-8 h-8 text-zinc-600 mx-auto mb-2 text-zinc-400" />
                  <p className="text-sm font-semibold">No transactions found matching your criteria</p>
                  <p className="text-xs text-zinc-400 mt-1">Try adapting your filters or entering a new casual transaction string.</p>
                </div>
              ) : (
                filteredTransactions.map((tx) => (
                  <div 
                    key={tx.id} 
                    id={`tx-row-${tx.id}`}
                    className="p-5 flex items-center justify-between gap-4 hover:bg-zinc-950/40 transition-colors animate-fadeIn"
                  >
                    <div className="flex items-center gap-3.5">
                      {/* Visual Indicator of Credit or Debit */}
                      <div className={`p-2.5 rounded-xl border flex items-center justify-center shrink-0 ${
                        tx.type === TransactionType.CREDIT
                          ? 'bg-emerald-950/60 border-emerald-900 text-emerald-400'
                          : 'bg-rose-950/60 border-rose-900 text-rose-400'
                      }`}>
                        {tx.type === TransactionType.CREDIT ? (
                          <ArrowDownLeft className="w-4 h-4" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4" />
                        )}
                      </div>

                      {/* Detail Column */}
                      <div className="space-y-0.5">
                        <div className="flex items-center flex-wrap gap-2 text-zinc-100">
                          <span className="text-xs font-semibold text-zinc-450 flex items-center gap-1 px-1.5 py-0.5 bg-zinc-950 border border-zinc-800 rounded-md">
                            <User className="w-3 h-3 text-zinc-500" /> {tx.party}
                          </span>
                          <span className="text-xs font-medium text-emerald-400 px-1.5 py-0.5 bg-zinc-950 border border-zinc-800 rounded-md flex items-center gap-1">
                            <Tag className="w-3 h-3 text-zinc-500" /> {tx.category}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-zinc-200 mt-1">{tx.notes}</p>
                        <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                          <Calendar className="w-3 h-3 text-zinc-650" />
                          <span>{new Date(tx.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-right shrink-0">
                      <div>
                        <div className={`text-sm sm:text-base font-black ${
                          tx.type === TransactionType.CREDIT ? 'text-emerald-400' : 'text-rose-400'
                        }`}>
                          {tx.type === TransactionType.CREDIT ? '+' : '-'} ₹{tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
                        </div>
                        <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-500 block">
                          Confirmed Local
                        </span>
                      </div>

                      <button
                        id={`btn-delete-tx-${tx.id}`}
                        onClick={() => deleteTransaction(tx.id)}
                        className="p-2 bg-transparent hover:bg-rose-950/20 text-zinc-650 hover:text-rose-400 rounded-xl transition-colors cursor-pointer"
                        title="Delete record"
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
      </>
    ) : (
      /* Contacts Directory / Person Ledger sub-views */
      <div className="space-y-6 animate-fadeIn">
        
        {/* Smart Entry Draft review modal */}
        {showReviewModal && (
          <div id="modal-review-transaction-people" className="p-6 rounded-2xl bg-zinc-900 border border-emerald-500/40 relative shadow-2xl transition-all animate-fadeIn">
            <div className="absolute top-2 right-2">
              <button 
                id="btn-close-review-people"
                onClick={() => setShowReviewModal(false)}
                className="p-1 px-[5px] bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white rounded-lg text-xs cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-2.5 text-emerald-400 font-bold tracking-wider text-xs uppercase mb-4">
              <Sparkles className="w-4 h-4 animate-pulse" />
              Parsed Ledger Draft Review
              {parserNotice && (
                <span className="text-[10px] tracking-normal font-mono bg-emerald-950 border border-emerald-800 text-emerald-400 px-2 py-0.5 rounded ml-2">
                  {parserNotice}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Amount (INR)</label>
                <input
                  id="inp-review-amount-p"
                  type="number"
                  value={manualAmount}
                  onChange={(e) => setManualAmount(Number(e.target.value))}
                  className="bg-zinc-950 border border-zinc-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-sm text-zinc-200 outline-none w-full"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Type</label>
                <select
                  id="inp-review-type-p"
                  value={manualType}
                  onChange={(e) => setManualType(e.target.value as TransactionType)}
                  className="bg-zinc-950 border border-zinc-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-sm text-zinc-200 outline-none w-full cursor-pointer"
                >
                  <option value={TransactionType.DEBIT}>Debit (Paid / Spent)</option>
                  <option value={TransactionType.CREDIT}>Credit (Received / Repaid)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Party / Name</label>
                <input
                  id="inp-review-party-p"
                  type="text"
                  value={manualParty}
                  onChange={(e) => setManualParty(e.target.value)}
                  className="bg-zinc-950 border border-zinc-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-sm text-zinc-200 outline-none w-full"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Category</label>
                <select
                  id="inp-review-category-p"
                  value={manualCategory}
                  onChange={(e) => setManualCategory(e.target.value)}
                  className="bg-zinc-950 border border-zinc-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-sm text-zinc-200 outline-none w-full cursor-pointer"
                >
                  {categoriesList.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Notes Context</label>
                <input
                  id="inp-review-notes-p"
                  type="text"
                  value={manualNotes}
                  onChange={(e) => setManualNotes(e.target.value)}
                  className="bg-zinc-950 border border-zinc-800 focus:border-emerald-500 rounded-xl px-3 py-2 text-sm text-zinc-200 outline-none w-full"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-4 pt-3 border-t border-zinc-850">
              <button
                id="btn-review-cancel-p"
                onClick={() => setShowReviewModal(false)}
                className="px-4 py-2 bg-transparent hover:bg-zinc-800 text-zinc-400 rounded-lg text-xs cursor-pointer transition-colors"
              >
                Discard Draft
              </button>
              <button
                id="btn-review-save-p"
                onClick={saveTransaction}
                className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-lg text-xs font-black flex items-center gap-1 cursor-pointer transition-all"
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
            <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-850 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl" />
              <div className="space-y-1">
                <h2 className="text-sm font-bold text-zinc-100 uppercase tracking-widest flex items-center gap-2">
                  <Users className="w-4.5 h-4.5 text-emerald-400" />
                  Social Ledgers & Portfolios
                </h2>
                <p className="text-xs text-zinc-400">Initialize a custom profile page for any person or organization to monitor independent balances.</p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Search Field */}
                <div className="relative flex items-center bg-zinc-950 border border-zinc-805 rounded-xl px-3 py-2.5 text-xs focus-within:border-emerald-500 transition-colors">
                  <Search className="w-3.5 h-3.5 text-zinc-500 mr-2 shrink-0" />
                  <input
                    id="txt-search-contacts"
                    type="text"
                    placeholder="Search profiles..."
                    value={searchContactQuery}
                    onChange={(e) => setSearchContactQuery(e.target.value)}
                    className="bg-transparent border-none focus:outline-none placeholder-zinc-550 text-zinc-200 text-xs w-44"
                  />
                </div>

                {/* Quick Add Name Input */}
                <div className="flex items-center bg-zinc-950 border border-zinc-805 focus-within:border-emerald-500 rounded-xl p-1 transition-colors">
                  <input
                    id="txt-create-contact-name"
                    type="text"
                    placeholder="Name... (e.g. Preeti)"
                    value={newPersonName}
                    onChange={(e) => setNewPersonName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCreateNewPerson();
                    }}
                    className="bg-transparent px-3 py-2 text-xs text-zinc-200 outline-none placeholder-zinc-550 w-36"
                  />
                  <button
                    id="btn-create-contact-submit"
                    onClick={handleCreateNewPerson}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-lg font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Create Page
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
                  <div className="p-16 text-center bg-zinc-900 border border-zinc-850 rounded-2xl animate-fadeIn">
                    <Users className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
                    <p className="text-zinc-300 font-bold text-sm">No personal portfolios match your search</p>
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
                        className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 p-6 rounded-2xl flex flex-col justify-between space-y-5 hover:shadow-2xl transition-all cursor-pointer group hover:bg-zinc-900/80"
                        onClick={() => setSelectedPerson(person)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-3">
                            {/* Initials avatar circle */}
                            <div className={`w-12 h-12 rounded-2.5xl bg-gradient-to-br ${getAvatarColor(person)} flex items-center justify-center font-black text-sm uppercase shadow-lg border border-zinc-700/20`}>
                              {person.charAt(0)}
                            </div>
                            <div>
                              <h3 className="font-extrabold text-white text-sm group-hover:text-emerald-400 transition-colors leading-tight">{person}</h3>
                              <p className="text-[10px] text-zinc-500 mt-0.5">{personTxs.length} logged events</p>
                            </div>
                          </div>

                          <span className={`text-[10px] font-mono font-black px-2.5 py-1 rounded-lg border ${
                            netUnpaidBalance > 0 
                              ? 'bg-emerald-950/80 text-emerald-400 border-emerald-900/60' 
                              : netUnpaidBalance < 0 
                              ? 'bg-rose-955/80 text-rose-350 border-rose-900/60' 
                              : 'bg-zinc-950 text-zinc-400 border-zinc-850'
                          }`}>
                            {netUnpaidBalance > 0 
                              ? 'Owed to you' 
                              : netUnpaidBalance < 0 
                              ? 'You owe' 
                              : 'Settled'}
                          </span>
                        </div>

                        {/* Balance metrics */}
                        <div className="bg-zinc-950/50 border border-zinc-850 p-4 rounded-xl space-y-2.5">
                          <div className="flex items-center justify-between text-xs text-zinc-400 font-medium">
                            <span>Outstanding Balance:</span>
                            <span className={`font-black text-xs font-mono font-bold ${
                              netUnpaidBalance > 0 ? 'text-emerald-400' : netUnpaidBalance < 0 ? 'text-rose-450' : 'text-zinc-450'
                            }`}>
                              {netUnpaidBalance > 0 ? '+' : ''}₹{netUnpaidBalance.toLocaleString('en-IN')}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-zinc-500 border-t border-zinc-850/60 pt-2 font-mono">
                            <span>Spent/Lent: ₹{debitsSum.toLocaleString('en-IN')}</span>
                            <span>Cleared: ₹{creditsSum.toLocaleString('en-IN')}</span>
                          </div>
                        </div>

                        <button
                          id={`person-view-btn-${person}`}
                          className="w-full text-center py-2.5 bg-zinc-950 hover:bg-zinc-850 text-zinc-300 group-hover:text-white rounded-xl border border-zinc-800 text-[11px] font-extrabold transition-colors tracking-wide uppercase font-mono"
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-3 border-b border-zinc-900">
              <div className="flex items-center gap-3">
                <button
                  id="btn-person-back-to-directory"
                  onClick={() => setSelectedPerson(null)}
                  className="p-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl border border-zinc-805 transition-colors cursor-pointer"
                  title="Return to Directory"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${getAvatarColor(selectedPerson)} flex items-center justify-center font-bold text-2xs uppercase shadow-inner`}>
                      {selectedPerson.charAt(0)}
                    </div>
                    <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-mono font-bold">Portfolios Directory</span>
                  </div>
                  <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2 mt-0.5">
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
                  className="px-3 py-1.5 rounded-lg border border-transparent hover:border-rose-955 text-xs text-zinc-500 hover:text-rose-455 hover:bg-rose-950/20 transition-all cursor-pointer font-medium"
                >
                  Remove portfolio page
                </button>
              </div>
            </div>

            {/* Individual personal portfolio metrics calculation details */}
            {(() => {
              const personTxs = transactions.filter(t => t.party.trim().toLowerCase() === selectedPerson.toLowerCase());
              const creditsSum = personTxs.filter(t => t.type === TransactionType.CREDIT).reduce((sum, t) => sum + t.amount, 0);
              const debitsSum = personTxs.filter(t => t.type === TransactionType.DEBIT).reduce((sum, t) => sum + t.amount, 0);
              const netUnpaidBalance = debitsSum - creditsSum;

              return (
                <div className="space-y-6 animate-fadeIn">
                  
                  {/* Ledger metric Bento grids */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Position standing card */}
                    <div className={`p-6 rounded-2xl border flex flex-col justify-between min-h-[155px] relative overflow-hidden ${
                      netUnpaidBalance > 0 
                        ? 'bg-emerald-950/25 border-emerald-900/60' 
                        : netUnpaidBalance < 0 
                        ? 'bg-rose-950/25 border-rose-900/60' 
                        : 'bg-zinc-900 border-zinc-800'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase font-mono">Net Ledger Position</span>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest border ${
                          netUnpaidBalance > 0 
                            ? 'bg-emerald-950 text-emerald-400 border-emerald-900' 
                            : netUnpaidBalance < 0 
                            ? 'bg-rose-950 text-rose-400 border-rose-900' 
                            : 'bg-zinc-950 text-zinc-500 border-zinc-805'
                        }`}>
                          {netUnpaidBalance > 0 ? 'Repayment Pending' : netUnpaidBalance < 0 ? 'Debt Pending' : 'Cleared'}
                        </span>
                      </div>
                      
                      <div className="mt-3">
                        <div className={`text-3.5xl font-black font-mono font-bold ${
                          netUnpaidBalance > 0 ? 'text-emerald-400' : netUnpaidBalance < 0 ? 'text-rose-400' : 'text-zinc-200'
                        }`}>
                          ₹{Math.abs(netUnpaidBalance).toLocaleString('en-IN')}
                        </div>
                        
                        <p className="text-[11px] text-zinc-500 mt-1 lines-clamp-2">
                          {netUnpaidBalance > 0 
                            ? `${selectedPerson} owes you this remaining amount.`
                            : netUnpaidBalance < 0 
                            ? `You owe secondary balance to ${selectedPerson}.`
                            : 'All transactions are completely mutual and settled.'}
                        </p>
                      </div>

                      {/* Settlement trigger generator */}
                      {netUnpaidBalance !== 0 && (
                        <button
                          id="btn-quick-settle-action"
                          onClick={() => handleQuickSettle(selectedPerson, netUnpaidBalance)}
                          className="mt-4 py-2.5 bg-zinc-950 hover:bg-emerald-500 text-zinc-300 hover:text-zinc-950 rounded-xl text-center text-xs font-black border border-zinc-800 hover:border-emerald-500 transition-colors uppercase tracking-wider font-mono cursor-pointer"
                        >
                          Auto Settle Outstanding Balance &rarr;
                        </button>
                      )}
                    </div>

                    {/* Paid/Spent (Debits) card */}
                    <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-850 flex flex-col justify-between min-h-[155px]">
                      <div>
                        <span className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase block font-mono">Deposits & Outlays (Debits)</span>
                        <span className="text-[10px] text-zinc-500">Money given / spent on contact or party</span>
                      </div>
                      <div className="mt-4">
                        <div className="text-2.5xl font-black text-rose-400 font-mono">
                          - ₹{debitsSum.toLocaleString('en-IN')}
                        </div>
                        <p className="text-xs text-zinc-500 mt-1.5">{personTxs.filter(t => t.type === TransactionType.DEBIT).length} payments registered</p>
                      </div>
                    </div>

                    {/* Received (Credits) card */}
                    <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-850 flex flex-col justify-between min-h-[155px]">
                      <div>
                        <span className="text-[10px] font-bold text-zinc-400 tracking-wider uppercase block font-mono">Receipts & Cleared (Credits)</span>
                        <span className="text-[10px] text-zinc-500">Repayments received or income got from them</span>
                      </div>
                      <div className="mt-4">
                        <div className="text-2.5xl font-black text-emerald-400 font-mono">
                          + ₹{creditsSum.toLocaleString('en-IN')}
                        </div>
                        <p className="text-xs text-zinc-500 mt-1.5">{personTxs.filter(t => t.type === TransactionType.CREDIT).length} repayments registered</p>
                      </div>
                    </div>

                  </div>

                  {/* Pre-populated Smart natural language invoice container */}
                  <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-850 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-44 h-44 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
                    <div>
                      <h4 className="text-xs font-bold text-zinc-350 uppercase tracking-widest flex items-center gap-1.5 font-mono">
                        <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                        PRE-CONFIGURED SMART STATEMENT INJECTOR
                      </h4>
                      <p className="text-[11.5px] text-zinc-500 mt-1 leading-relaxed">
                        Input casual comments specifically for <strong>{selectedPerson}</strong>. The system will automatically link the participant and category.
                      </p>
                    </div>

                    <div className="mt-4 relative flex items-center bg-zinc-950 border border-zinc-800 focus-within:border-emerald-500 rounded-xl p-1.5 shadow-inner transition-colors">
                      <input
                        id="txt-person-smart-input"
                        type="text"
                        value={personSmartInput}
                        onChange={(e) => setPersonSmartInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handlePersonSmartParse(selectedPerson);
                        }}
                        placeholder={`e.g. Lent 400 for movie (Will force party association with ${selectedPerson})`}
                        className="w-full bg-transparent px-3 py-2 text-xs text-zinc-100 outline-none focus:outline-none placeholder-zinc-500 font-medium"
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
                  <div className="bg-zinc-900 border border-zinc-850 rounded-2xl overflow-hidden shadow-2xl">
                    
                    <div className="p-5 border-b border-zinc-850 bg-zinc-950 flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-widest font-mono">
                          Statement timeline log ({personTxs.length} items)
                        </h4>
                        <p className="text-[10px] text-zinc-500 mt-1">Independent historic transaction ledger specifically involving {selectedPerson}</p>
                      </div>
                    </div>

                    <div className="divide-y divide-zinc-850">
                      {personTxs.length === 0 ? (
                        <div className="p-16 text-center text-zinc-500">
                          <Info className="w-8 h-8 mx-auto mb-2 text-zinc-650" />
                          <p className="text-xs font-semibold">No transactions registered specifically for {selectedPerson}</p>
                          <p className="text-[10px] text-zinc-500 mt-1">Use the pre-configured parsing field above to record a trade or debt repayment.</p>
                        </div>
                      ) : (
                        personTxs.map((tx) => (
                          <div 
                            key={tx.id} 
                            id={`person-tx-row-${tx.id}`}
                            className="p-4.5 flex items-center justify-between gap-4 hover:bg-zinc-950/40 transition-colors animate-fadeIn"
                          >
                            <div className="flex items-center gap-3.5">
                              {/* Visual Indicator of Credit/Debit */}
                              <div className={`p-2.5 rounded-xl border flex items-center justify-center shrink-0 ${
                                tx.type === TransactionType.CREDIT
                                  ? 'bg-emerald-950/60 border-emerald-950 text-emerald-400'
                                  : 'bg-rose-955/60 border-rose-955 text-rose-450'
                              }`}>
                                {tx.type === TransactionType.CREDIT ? (
                                  <ArrowDownLeft className="w-4 h-4" />
                                ) : (
                                  <ArrowUpRight className="w-4 h-4" />
                                )}
                              </div>

                              <div>
                                <span className="text-[10px] font-bold text-emerald-400 px-2 py-0.5 bg-zinc-950 border border-zinc-800 rounded-md uppercase font-mono tracking-wide">
                                  {tx.category}
                                </span>
                                <p className="text-xs text-zinc-200 font-bold mt-1.5">{tx.notes}</p>
                                <div className="flex items-center gap-1.5 text-[10px] text-zinc-550 mt-1">
                                  <Calendar className="w-3 h-3 text-zinc-650" />
                                  <span>{new Date(tx.timestamp).toLocaleString()}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 shrink-0 justify-end">
                              <div className="text-right">
                                <span className={`text-base font-black font-semibold font-mono ${
                                  tx.type === TransactionType.CREDIT ? 'text-emerald-400' : 'text-rose-450'
                                }`}>
                                  {tx.type === TransactionType.CREDIT ? '+' : '-'} ₹{tx.amount.toLocaleString('en-IN')}
                                </span>
                                <span className="text-[8px] font-mono uppercase text-zinc-550 block mt-0.5">Confirmed Status</span>
                              </div>

                              <button
                                id={`person-row-delete-btn-${tx.id}`}
                                onClick={() => deleteTransaction(tx.id)}
                                className="p-2 hover:bg-rose-950/20 text-zinc-650 hover:text-rose-400 rounded-xl transition-all cursor-pointer"
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

    </div>
  );
}
