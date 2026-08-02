/**
 * FinTrack Pro — OFX/QFX Statement Parser
 * Parses OFX (Open Financial Exchange) and QFX statement files.
 * OFX uses an SGML-like format; QFX is a stricter XML variant.
 */

import { generateHash } from './deduplication.js';

// ─── OFX Date Parsing ─────────────────────────────────────────────────────────

/**
 * Parse an OFX date string (YYYYMMDDHHMMSS or YYYYMMDD) to YYYY-MM-DD.
 * @param {string} ofxDate
 * @returns {string|null}
 */
function parseOFXDate(ofxDate) {
  if (!ofxDate || ofxDate.length < 8) return null;
  
  // Remove timezone info like [+5:GMT] or [-5:EST]
  const cleaned = ofxDate.replace(/\[.*\]/, '').trim();
  
  const year = cleaned.substring(0, 4);
  const month = cleaned.substring(4, 6);
  const day = cleaned.substring(6, 8);
  
  const date = new Date(`${year}-${month}-${day}`);
  if (isNaN(date.getTime())) return null;
  
  return `${year}-${month}-${day}`;
}

// ─── OFX Tag Extraction ──────────────────────────────────────────────────────

/**
 * Extract the value of a simple OFX tag from a block of text.
 * OFX tags look like: <TAG>value (no closing tag in SGML mode)
 * or: <TAG>value</TAG> (in XML mode)
 * @param {string} block - Text block to search
 * @param {string} tag - Tag name
 * @returns {string|null}
 */
function extractTag(block, tag) {
  // Try XML-style first: <TAG>value</TAG>
  const xmlRegex = new RegExp(`<${tag}>([^<]*)<\\/${tag}>`, 'i');
  const xmlMatch = block.match(xmlRegex);
  if (xmlMatch) return xmlMatch[1].trim();
  
  // SGML-style: <TAG>value (value ends at next < or newline)
  const sgmlRegex = new RegExp(`<${tag}>([^<\\n\\r]*)`, 'i');
  const sgmlMatch = block.match(sgmlRegex);
  if (sgmlMatch) return sgmlMatch[1].trim();
  
  return null;
}

// ─── Main OFX Parser ─────────────────────────────────────────────────────────

/**
 * Parse an OFX/QFX file into normalized transactions.
 * @param {string} fileContent - Raw OFX/QFX text content
 * @returns {Promise<{ transactions: object[], bankInfo: object, errors: string[] }>}
 */
export async function parseOFX(fileContent) {
  const errors = [];
  const transactions = [];
  
  // Extract bank info
  const bankInfo = {
    bankId: extractTag(fileContent, 'BANKID'),
    accountId: extractTag(fileContent, 'ACCTID'),
    accountType: extractTag(fileContent, 'ACCTTYPE'),
    currency: extractTag(fileContent, 'CURDEF'),
    org: extractTag(fileContent, 'ORG'),
    fid: extractTag(fileContent, 'FID'),
  };
  
  // Find all STMTTRN blocks
  const trnRegex = /<STMTTRN>([\s\S]*?)(?:<\/STMTTRN>|(?=<STMTTRN>|<\/BANKTRANLIST))/gi;
  let match;
  
  while ((match = trnRegex.exec(fileContent)) !== null) {
    const block = match[1];
    
    const trnType = extractTag(block, 'TRNTYPE');
    const dtPosted = extractTag(block, 'DTPOSTED');
    const trnAmt = extractTag(block, 'TRNAMT');
    const fitId = extractTag(block, 'FITID');
    const name = extractTag(block, 'NAME');
    const memo = extractTag(block, 'MEMO');
    const checkNum = extractTag(block, 'CHECKNUM');
    
    // Parse date
    const date = parseOFXDate(dtPosted);
    if (!date) {
      errors.push(`Invalid date in transaction: ${dtPosted}`);
      continue;
    }
    
    // Parse amount
    const amount = parseFloat(trnAmt);
    if (isNaN(amount)) {
      errors.push(`Invalid amount in transaction: ${trnAmt}`);
      continue;
    }
    
    // Description: prefer NAME, fallback to MEMO
    const description = name || memo || trnType || 'Unknown';
    const fullDescription = [name, memo].filter(Boolean).join(' - ');
    
    // Debit/Credit based on sign
    let debit = null;
    let credit = null;
    if (amount < 0) {
      debit = Math.abs(amount);
    } else {
      credit = Math.abs(amount);
    }
    
    const hash = await generateHash(date, description, Math.abs(amount));
    
    transactions.push({
      date,
      description: fullDescription || description,
      debit,
      credit,
      balance: null, // OFX doesn't typically have per-row balance
      reference: fitId || checkNum || '',
      rawRow: block.replace(/\s+/g, ' ').trim(),
      hash,
      confidence: 0.95, // OFX is highly structured
    });
  }
  
  if (transactions.length === 0) {
    errors.push('No transactions found in OFX/QFX file.');
  }
  
  return { transactions, bankInfo, errors };
}

export default { parseOFX };
