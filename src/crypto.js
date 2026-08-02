/**
 * FinTrack Pro — AES-256 Encryption via Web Crypto API
 * Provides encrypt/decrypt utilities for sensitive data at rest.
 */

// ─── Constants ────────────────────────────────────────────────────────────────

const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const IV_LENGTH = 12; // 96 bits for AES-GCM

// ─── Key Management ───────────────────────────────────────────────────────────

/**
 * Derive a CryptoKey from a user-supplied passphrase using PBKDF2.
 * @param {string} passphrase
 * @param {Uint8Array} salt
 * @returns {Promise<CryptoKey>}
 */
export async function deriveKey(passphrase, salt) {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100_000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Generate a random salt for key derivation.
 * @returns {Uint8Array}
 */
export function generateSalt() {
  return crypto.getRandomValues(new Uint8Array(16));
}

// ─── Encrypt / Decrypt ────────────────────────────────────────────────────────

/**
 * Encrypt a plaintext string using AES-256-GCM.
 * Returns a JSON-serializable object containing iv, salt, and ciphertext.
 * @param {string} plaintext
 * @param {string} passphrase
 * @returns {Promise<{ iv: string, salt: string, data: string }>}
 */
export async function encrypt(plaintext, passphrase) {
  const encoder = new TextEncoder();
  const salt = generateSalt();
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const key = await deriveKey(passphrase, salt);

  const encrypted = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv },
    key,
    encoder.encode(plaintext)
  );

  return {
    iv: bufferToBase64(iv),
    salt: bufferToBase64(salt),
    data: bufferToBase64(new Uint8Array(encrypted)),
  };
}

/**
 * Decrypt a ciphertext object back to a plaintext string.
 * @param {{ iv: string, salt: string, data: string }} encryptedObj
 * @param {string} passphrase
 * @returns {Promise<string>}
 */
export async function decrypt(encryptedObj, passphrase) {
  const iv = base64ToBuffer(encryptedObj.iv);
  const salt = base64ToBuffer(encryptedObj.salt);
  const data = base64ToBuffer(encryptedObj.data);
  const key = await deriveKey(passphrase, salt);

  const decrypted = await crypto.subtle.decrypt(
    { name: ALGORITHM, iv },
    key,
    data
  );

  return new TextDecoder().decode(decrypted);
}

// ─── Utility ──────────────────────────────────────────────────────────────────

/**
 * Convert an ArrayBuffer/Uint8Array to a base64 string.
 * @param {Uint8Array} buffer
 * @returns {string}
 */
function bufferToBase64(buffer) {
  let binary = '';
  for (const byte of buffer) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}

/**
 * Convert a base64 string back to a Uint8Array.
 * @param {string} base64
 * @returns {Uint8Array}
 */
function base64ToBuffer(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

// ─── Exports ──────────────────────────────────────────────────────────────────

export default {
  encrypt,
  decrypt,
  deriveKey,
  generateSalt,
};
