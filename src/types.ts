/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum TransactionType {
  CREDIT = 'Credit', // Money In / Earned / Received / Recovered
  DEBIT = 'Debit',   // Money Out / Spent / Lent / Paid
}

export interface Transaction {
  id: string;
  timestamp: string; // ISO 8601 string
  amount: number;    // Positive value representing the transaction volume
  type: TransactionType;
  party: string;     // Name of individual, company, or "Self"
  category: string;  // E.g., Dining, Groceries, Rent, Salary, Utilities, Medical, Shopping, Travel, etc.
  notes: string;     // Additional information or processed comments
}

export interface SmartParseResult {
  amount: number;
  type: TransactionType;
  party: string;
  category: string;
  notes: string;
  success: boolean;
  error?: string;
}

export interface CategorySummary {
  category: string;
  amount: number;
  type: TransactionType;
  percentage: number;
}
