/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User,
  signOut
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { Transaction } from '../types';

// Initialize firebase instance
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const provider = new GoogleAuthProvider();
// Add specific Drive scope for creating and updating files we create
provider.addScope('https://www.googleapis.com/auth/drive.file');

// In-memory access token cache (never stored in localStorage as per guidelines)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

export interface BackupPayload {
  transactions: Transaction[];
  customPeople: string[];
  backupTime: string;
}

/**
 * Initializes the auth listener.
 * Clears the credential memory if user is signed out.
 */
export const initAuth = (
  onAuthSuccess: (user: User, token: string) => void,
  onAuthFailure: () => void
) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      if (cachedAccessToken) {
        onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        // Token isn't cached but user is logged in. Need to reauth to obtain access token again.
        cachedAccessToken = null;
        onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      onAuthFailure();
    }
  });
};

/**
 * Executes standard browser popup login to obtain Gmail profile and Drive credentials.
 */
export const loginWithGoogle = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken || null;
    
    if (!token) {
      throw new Error('Could not collect access credential from authentication provider.');
    }
    
    cachedAccessToken = token;
    return { user: result.user, accessToken: token };
  } catch (error) {
    console.error('Authentication attempt failed:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

/**
 * Flushes active credentials and signs out.
 */
export const logoutWithGoogle = async (): Promise<void> => {
  await signOut(auth);
  cachedAccessToken = null;
};

export const getCachedToken = (): string | null => {
  return cachedAccessToken;
};

/**
 * Searches the user's Google Drive for a file named 'personal_ledger_backup.json'.
 */
async function findBackupFile(token: string): Promise<string | null> {
  const query = encodeURIComponent("name = 'personal_ledger_backup.json' and trashed = false");
  const response = await fetch(`https://www.googleapis.com/drive/v3/files?q=${query}&spaces=drive`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error('Drive query error:', errText);
    throw new Error(`Failed to query Google Drive API: ${response.statusText}`);
  }

  const result = await response.json();
  if (result.files && result.files.length > 0) {
    return result.files[0].id;
  }
  return null;
}

/**
 * Saves a backup payload to Google Drive (updating existing file or creating a new one).
 */
export async function saveToGoogleDrive(token: string, payload: BackupPayload): Promise<{ fileId: string; updated: boolean }> {
  try {
    const existingFileId = await findBackupFile(token);
    
    if (existingFileId) {
      // Keep existing metadata, just update file content media (raw JSON text)
      const updateResponse = await fetch(`https://www.googleapis.com/upload/drive/v3/files/${existingFileId}?uploadType=media`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!updateResponse.ok) {
        throw new Error(`Failed to update existing backup: ${updateResponse.statusText}`);
      }

      return { fileId: existingFileId, updated: true };
    } else {
      // 1. Create file metadata
      const createMetaResponse = await fetch('https://www.googleapis.com/drive/v3/files', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: 'personal_ledger_backup.json',
          mimeType: 'application/json'
        })
      });

      if (!createMetaResponse.ok) {
        throw new Error(`Failed to create backup metadata: ${createMetaResponse.statusText}`);
      }

      const meta = await createMetaResponse.json();
      const fileId = meta.id;

      // 2. Upload file content media
      const uploadResponse = await fetch(`https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!uploadResponse.ok) {
        throw new Error(`Failed to upload newly created backup media: ${uploadResponse.statusText}`);
      }

      return { fileId, updated: false };
    }
  } catch (error) {
    console.error('saveToGoogleDrive operation failed:', error);
    throw error;
  }
}

/**
 * Loads and restores backup payload from 'personal_ledger_backup.json' in Google Drive.
 */
export async function loadFromGoogleDrive(token: string): Promise<BackupPayload | null> {
  try {
    const fileId = await findBackupFile(token);
    if (!fileId) {
      return null;
    }

    const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch file content from Google Drive: ${response.statusText}`);
    }

    const data: BackupPayload = await response.json();
    return data;
  } catch (error) {
    console.error('loadFromGoogleDrive operation failed:', error);
    throw error;
  }
}

/**
 * Deletes the 'personal_ledger_backup.json' file from the user's Google Drive.
 */
export async function deleteBackupFromGoogleDrive(token: string): Promise<boolean> {
  try {
    const fileId = await findBackupFile(token);
    if (!fileId) {
      return false;
    }

    const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to delete file from Google Drive: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error('deleteBackupFromGoogleDrive operation failed:', error);
    throw error;
  }
}

