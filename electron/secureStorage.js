import { app } from 'electron';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import Store from 'electron-store';

let secureStore = null;

export function setupSecureStorage() {
  // Create a secure encryption key based on machine-specific information
  // This is a simplified approach - in production, use keychain/credential vault
  const getMachineKey = () => {
    const homeDir = app.getPath('home');
    const appData = app.getPath('appData');
    const machineId = `${homeDir}-${appData}-${app.getName()}`;
    return crypto.createHash('sha256').update(machineId).digest('hex').substring(0, 32);
  };

  const encryptionKey = getMachineKey();
  
  // Configure the secure store with encryption
  secureStore = new Store({
    name: 'secure-config',
    encryptionKey,
    clearInvalidConfig: true,
    // Memory optimization: Only load what we need
    watch: false
  });
  
  return secureStore;
}

export function getSecureStorage() {
  if (!secureStore) {
    setupSecureStorage();
  }
  return secureStore;
}