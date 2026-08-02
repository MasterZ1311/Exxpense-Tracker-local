/**
 * FinTrack Pro — CSV Statement Parser
 * Parses bank CSV statements using PapaParse with bank-specific profiles.
 */

import Papa from 'papaparse';
import { allBankProfiles } from './bank-profiles/index.js';
import { generateHash } from './deduplication.js';

// ─── Date Parsing ─────────────────────────────────────────────────────────────

/** Map of date format tokens to their meaning */
const DATE_FORMATS = {
  'DD/MM/YYYY': { regex: /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, parts: ['day', 'month', 'year'] },
  'DD-MM-YYYY': { regex: /^(\d{1,2})-(\d{1,2})-(\d{4})$/, parts: ['day', 'month', 'year'] },
  'DD/MM/YY':   { regex: /^(\d{1,2})\/(\d{1,2})\/(\d{2})$/, parts: ['day', 'month', 'year2'] },
  'DD-MM-YY':   { regex: /^(\d{1,2})-(\d{1,2})-(\d{2})$/, parts: ['day', 'month', 'year2'] },
  'MM/DD/YYYY': { regex: /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, parts: ['month', 'day', 'year'] },
  'MM-DD-YYYY': { regex: /^(\d{1,2})-(\d{1,2})-(\d{4})$/, parts: ['month', 'day', 'year'] },
  'YYYY-MM-DD': { regex: /^(\d{4})-(\d{1,2})-(\d{1,2})$/, parts: ['year', 'month', 'day'] },
  'DD.MM.YYYY': { regex: /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/, parts: ['day', 'month', 'year'] },
};

/**
 * Parse a date string using a known format into YYYY-MM-DD.
 * @param {string} dateStr
 * @param {string} format - One of the supported DATE_FORMATS keys
 * @returns {string|null} ISO date string (YYYY-MM-DD) or null if parsing fails
 */
export function parseDate(dateStr, format) {
  if (!dateStr || !format) return null;
  const trimmed = dateStr.trim();
  const fmt = DATE_FORMATS[format];
  if (!fmt) {
    // Fallback: try to parse with Date constructor
    const d = new Date(trimmed);
    if (!isNaN(d.getTime())) {
      return d.toISOString().split('T')[0];
    }
    return null;
  }
  
  const match = trimmed.match(fmt.regex);
  if (!match) return null;
  
  const values = {};
  fmt.parts.forEach((part, i) => {
    values[part] = match[i + 1];
  });
  
  let year = values.year || values.year2;
  if (values.year2) {
    const y = parseInt(values.year2, 10);
    year = y > 50 ? `19${values.year2}` : `20${values.year2.padStart(2, '0')}`;
  }
  
  const month = values.month.padStart(2, '0');
  const day = values.day.padStart(2, '0');
  
  // Validate
  const parsed = new Date(`${year}-${month}-${day}`);
  if (isNaN(parsed.getTime())) return null;
  
  return `${year}-${month}-${day}`;
}

/**
 * Try to parse a date string using multiple formats.
 * @param {string} dateStr
 * @returns {string|null}
 */
export function parseDateAuto(dateStr) {
  for (const format of Object.keys(DATE_FORMATS)) {
    const result = parseDate(dateStr, format);
    if (result) return result;
  }
  // Last resort
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
  return null;
}

// ─── Amount Parsing ──────────────────────────────────────────────────────────

/**
 * Clean and parse an amount string into a number.
 * Handles currency symbols, commas, Indian lakh format, European format.
 * @param {string} amountStr
 * @param {string} numberFormat - 'standard' | 'indian' | 'european'
 * @returns {number|null}
 */
export function parseAmount(amountStr, numberFormat = 'standard') {
  if (amountStr === null || amountStr === undefined) return null;
  
  let str = String(amountStr).trim();
  if (!str || str === '-' || str === '') return null;
  
  // Remove currency symbols
  str = str.replace(/[₹$€£¥\s]/g, '');
  
  // Check for DR/CR suffix
  const hasDR = /DR\.?$/i.test(str);
  const hasCR = /CR\.?$/i.test(str);
  str = str.replace(/(DR|CR)\.?$/i, '').trim();
  
  // Check for parentheses (negative)
  const isParenNeg = str.startsWith('(') && str.endsWith(')');
  if (isParenNeg) str = str.slice(1, -1);
  
  // Check for leading minus
  const isNeg = str.startsWith('-');
  if (isNeg) str = str.slice(1);
  
  // Handle number formats
  let num;
  if (numberFormat === 'european') {
    // European: 1.234,56 → 1234.56
    str = str.replace(/\./g, '').replace(',', '.');
    num = parseFloat(str);
  } else if (numberFormat === 'indian') {
    // Indian lakh: 1,50,000.00 → 150000.00
    // Also handles standard: 150,000.00
    str = str.replace(/,/g, '');
    num = parseFloat(str);
  } else {
    // Standard: 150,000.00 → 150000.00
    str = str.replace(/,/g, '');
    num = parseFloat(str);
  }
  
  if (isNaN(num)) return null;
  
  // Apply sign
  if (isNeg || isParenNeg || hasDR) num = -Math.abs(num);
  if (hasCR) num = Math.abs(num);
  
  return num;
}

// ─── Bank Detection ──────────────────────────────────────────────────────────

/**
 * Detect bank from CSV content by matching headers and signatures.
 * @param {string[]} headers - CSV header row
 * @param {string} rawContent - First few KB of the file for signature matching
 * @returns {{ profile: object, confidence: number } | null}
 */
export function detectBank(headers, rawContent = '') {
  const upperHeaders = headers.map(h => h?.toUpperCase().trim() || '');
  const upperContent = rawContent.toUpperCase();
  let bestMatch = null;
  let bestScore = 0;
  
  for (const profile of allBankProfiles) {
    // Skip positional-column profiles for header matching
    if (profile.positionalColumns) {
      // Check signatures only
      const sigMatch = profile.signatures.some(sig => upperContent.includes(sig.toUpperCase()));
      if (sigMatch && 0.5 > bestScore) {
        bestMatch = { profile, confidence: 0.5 };
        bestScore = 0.5;
      }
      continue;
    }
    
    let score = 0;
    let total = 0;
    
    // Check column name matches
    const cols = profile.columns;
    for (const key of Object.keys(cols)) {
      if (key.startsWith('_')) continue;
      total++;
      const colName = cols[key];
      if (typeof colName === 'string') {
        if (upperHeaders.includes(colName.toUpperCase())) {
          score++;
        }
      }
    }
    
    // Check signature matches
    const sigMatch = profile.signatures.some(sig => upperContent.includes(sig.toUpperCase()));
    if (sigMatch) score += 2;
    total += 2;
    
    const confidence = total > 0 ? score / total : 0;
    if (confidence > bestScore) {
      bestScore = confidence;
      bestMatch = { profile, confidence };
    }
  }
  
  return bestScore >= 0.3 ? bestMatch : null;
}

// ─── CSV Parser ──────────────────────────────────────────────────────────────

/**
 * Find the header row in parsed CSV data by looking for a keyword.
 * @param {string[][]} data - Raw parsed CSV rows
 * @param {string} keyword - Keyword to search for in the header row
 * @returns {number} Index of the header row, or 0 if not found
 */
function findHeaderRow(data, keyword) {
  if (!keyword) return 0;
  const upperKeyword = keyword.toUpperCase();
  for (let i = 0; i < Math.min(data.length, 50); i++) {
    if (data[i].some(cell => cell?.toUpperCase().trim() === upperKeyword)) {
      return i;
    }
  }
  return 0;
}

/**
 * Parse a bank CSV file into normalized transactions.
 * @param {string} fileContent - Raw CSV text content
 * @param {object} [bankProfile] - Bank profile to use (auto-detected if not provided)
 * @returns {Promise<{ transactions: object[], bankProfile: object|null, errors: string[] }>}
 */
export async function parseBankCSV(fileContent, bankProfile = null) {
  const errors = [];
  
  // Step 1: Parse CSV with PapaParse
  const parsed = Papa.parse(fileContent, {
    skipEmptyLines: true,
    dynamicTyping: false,
  });
  
  if (parsed.errors.length > 0) {
    errors.push(...parsed.errors.map(e => `CSV parse error (row ${e.row}): ${e.message}`));
  }
  
  let data = parsed.data;
  if (!data || data.length < 2) {
    return { transactions: [], bankProfile: null, errors: ['CSV file is empty or has insufficient data'] };
  }
  
  // Step 2: Auto-detect bank if not provided
  let profile = bankProfile;
  if (!profile) {
    // Try to detect from first ~20 rows
    const previewText = data.slice(0, 20).map(r => r.join(' ')).join('\n');
    
    // Find a probable header row first
    let headerIdx = 0;
    for (let i = 0; i < Math.min(data.length, 30); i++) {
      const row = data[i];
      const hasDateLike = row.some(cell => /date|txn|trans|buchung/i.test(cell?.trim() || ''));
      if (hasDateLike) {
        headerIdx = i;
        break;
      }
    }
    
    const headers = data[headerIdx] || data[0];
    const detection = detectBank(headers, previewText);
    if (detection) {
      profile = detection.profile;
    }
  }
  
  // Step 3: Find header row and map columns
  let headerRowIdx;
  let headers;
  
  if (profile?.positionalColumns) {
    // Positional columns (e.g., Wells Fargo) — no header row
    headerRowIdx = -1;
    headers = null;
  } else if (profile) {
    headerRowIdx = profile.skipRows || 0;
    // Refine by searching for the headerRowKeyword
    if (profile.headerRowKeyword) {
      headerRowIdx = findHeaderRow(data, profile.headerRowKeyword);
    }
    headers = data[headerRowIdx];
  } else {
    // No profile — assume first row is header
    headerRowIdx = 0;
    headers = data[0];
  }
  
  // Step 4: Build column index map
  const colMap = {};
  
  if (profile?.positionalColumns) {
    // Positional mapping
    const cols = profile.columns;
    for (const [key, idx] of Object.entries(cols)) {
      if (key.startsWith('_')) continue;
      colMap[key] = idx;
    }
  } else if (profile && headers) {
    // Name-based mapping
    const cols = profile.columns;
    for (const [key, colName] of Object.entries(cols)) {
      if (key.startsWith('_')) continue;
      if (typeof colName === 'number') {
        colMap[key] = colName;
      } else {
        const idx = headers.findIndex(h => h?.trim().toUpperCase() === colName.toUpperCase());
        if (idx !== -1) colMap[key] = idx;
      }
    }
  } else if (headers) {
    // Best-effort mapping from generic header names
    const headerUpper = headers.map(h => h?.toUpperCase().trim() || '');
    const dateIdx = headerUpper.findIndex(h => /^(DATE|TXN DATE|TRANSACTION DATE|TRANS DATE|TRAN DATE)$/.test(h));
    const descIdx = headerUpper.findIndex(h => /^(DESCRIPTION|NARRATION|PARTICULARS|MEMO|REFERENCE)$/.test(h));
    const debitIdx = headerUpper.findIndex(h => /^(DEBIT|WITHDRAWAL|PAYMENT|DEBIT AMOUNT|WITHDRAWAL AMT)$/.test(h));
    const creditIdx = headerUpper.findIndex(h => /^(CREDIT|DEPOSIT|LODGEMENT|CREDIT AMOUNT|DEPOSIT AMT)$/.test(h));
    const amountIdx = headerUpper.findIndex(h => /^(AMOUNT|BETRAG)$/.test(h));
    const balanceIdx = headerUpper.findIndex(h => /^(BALANCE|CLOSING BALANCE|RUNNING BAL|RUNNING BALANCE|SOLDE)$/.test(h));
    const refIdx = headerUpper.findIndex(h => /^(REF|REFERENCE|REF NO|CHQ|CHEQUE|TYPE)$/.test(h));
    
    if (dateIdx !== -1) colMap.date = dateIdx;
    if (descIdx !== -1) colMap.description = descIdx;
    if (debitIdx !== -1) colMap.debit = debitIdx;
    if (creditIdx !== -1) colMap.credit = creditIdx;
    if (amountIdx !== -1) colMap.amount = amountIdx;
    if (balanceIdx !== -1) colMap.balance = balanceIdx;
    if (refIdx !== -1) colMap.reference = refIdx;
  }
  
  // Step 5: Parse data rows
  const startRow = profile?.positionalColumns ? 0 : headerRowIdx + 1;
  const dateFormat = profile?.dateFormat || null;
  const numberFormat = profile?.numberFormat || 'standard';
  const amountStyle = profile?.amountStyle || (colMap.debit !== undefined ? 'separate' : 'single');
  const transactions = [];
  
  for (let i = startRow; i < data.length; i++) {
    const row = data[i];
    if (!row || row.length === 0) continue;
    
    // Get raw values
    const rawDate = colMap.date !== undefined ? row[colMap.date]?.trim() : null;
    if (!rawDate) continue; // skip rows without a date
    
    // Parse date
    const date = dateFormat ? parseDate(rawDate, dateFormat) : parseDateAuto(rawDate);
    if (!date) continue; // skip rows where date doesn't parse
    
    const rawDesc = colMap.description !== undefined ? row[colMap.description]?.trim() : '';
    const rawRef = colMap.reference !== undefined ? row[colMap.reference]?.trim() : '';
    const rawRow = row.join(',');
    
    let debit = null;
    let credit = null;
    let balance = null;
    
    if (amountStyle === 'separate') {
      // Separate debit and credit columns
      if (colMap.debit !== undefined) {
        const d = parseAmount(row[colMap.debit], numberFormat);
        if (d !== null && d !== 0) debit = Math.abs(d);
      }
      if (colMap.credit !== undefined) {
        const c = parseAmount(row[colMap.credit], numberFormat);
        if (c !== null && c !== 0) credit = Math.abs(c);
      }
    } else if (amountStyle === 'single-with-suffix') {
      // Amount with DR/CR suffix
      const raw = colMap.amount !== undefined ? row[colMap.amount] : '';
      const amt = parseAmount(raw, numberFormat);
      if (amt !== null) {
        if (amt < 0 || /DR/i.test(raw)) {
          debit = Math.abs(amt);
        } else {
          credit = Math.abs(amt);
        }
      }
    } else {
      // Single amount column (negative = debit)
      const amt = colMap.amount !== undefined ? parseAmount(row[colMap.amount], numberFormat) : null;
      if (amt !== null) {
        if (amt < 0) {
          debit = Math.abs(amt);
        } else {
          credit = Math.abs(amt);
        }
      }
    }
    
    if (colMap.balance !== undefined) {
      balance = parseAmount(row[colMap.balance], numberFormat);
    }
    
    // Calculate the amount for hashing
    const amount = debit || credit || 0;
    const hash = await generateHash(date, rawDesc || rawRef, amount);
    
    transactions.push({
      date,
      description: rawDesc || rawRef || 'Unknown',
      debit,
      credit,
      balance,
      reference: rawRef || '',
      rawRow,
      hash,
      confidence: profile ? 0.9 : 0.6,
    });
  }
  
  return { transactions, bankProfile: profile, errors };
}

export default { parseBankCSV, detectBank, parseDate, parseDateAuto, parseAmount };
