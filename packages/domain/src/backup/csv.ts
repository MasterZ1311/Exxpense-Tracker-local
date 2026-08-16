import { Transaction, TransactionType } from '../models/types';

export interface ParsedCsvTransaction {
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  notes?: string;
}

/**
 * Exports a list of transactions to standard CSV format
 */
export function exportTransactionsToCsv(transactions: Transaction[], accountMap: Record<string, string> = {}): string {
  const headers = ['Date', 'Description', 'Category', 'Type', 'Amount', 'Currency', 'Account', 'Notes'];
  
  const escapeCsv = (str: string = '') => {
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const rows = transactions.map((tx) => {
    const accountName = accountMap[tx.accountId] || 'Primary';
    return [
      tx.date.split('T')[0],
      escapeCsv(tx.description),
      escapeCsv(tx.category),
      tx.type.toUpperCase(),
      tx.amount.toFixed(2),
      tx.currency || 'INR',
      escapeCsv(accountName),
      escapeCsv(tx.notes || ''),
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}

/**
 * Intelligent CSV Bank Statement Parser
 * Auto-detects delimiter, header columns (Date, Description, Debit/Credit/Amount)
 */
export function parseBankStatementCsv(csvText: string): ParsedCsvTransaction[] {
  if (!csvText || !csvText.trim()) return [];

  const lines = csvText.trim().split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) return [];

  // Detect delimiter (, or ;)
  const firstLine = lines[0];
  const delimiter = firstLine.includes(';') ? ';' : ',';

  // Split line with quote handling
  const splitLine = (line: string): string[] => {
    const regex = new RegExp(`(?:^|${delimiter})(?:"([^"]*(?:""[^"]*)*)"|([^"${delimiter}]*))`, 'g');
    const result: string[] = [];
    let match;
    while ((match = regex.exec(line)) !== null) {
      if (match.index === regex.lastIndex) regex.lastIndex++;
      const val = match[1] ? match[1].replace(/""/g, '"') : match[2] || '';
      result.push(val.trim());
    }
    return result;
  };

  const headers = splitLine(firstLine).map(h => h.toLowerCase().replace(/[^a-z0-9]/g, ''));

  // Find column indices
  let dateIdx = headers.findIndex(h => h.includes('date') || h.includes('time') || h.includes('txn'));
  let descIdx = headers.findIndex(h => h.includes('desc') || h.includes('particular') || h.includes('narration') || h.includes('merchant') || h.includes('detail'));
  let amountIdx = headers.findIndex(h => h.includes('amount') || h.includes('net'));
  let debitIdx = headers.findIndex(h => h.includes('debit') || h.includes('withdrawal') || h.includes('dr'));
  let creditIdx = headers.findIndex(h => h.includes('credit') || h.includes('deposit') || h.includes('cr'));
  let categoryIdx = headers.findIndex(h => h.includes('category') || h.includes('type'));

  if (dateIdx === -1) dateIdx = 0;
  if (descIdx === -1) descIdx = Math.min(1, headers.length - 1);

  const results: ParsedCsvTransaction[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = splitLine(lines[i]);
    if (cols.length <= 1) continue;

    const rawDate = cols[dateIdx] || new Date().toISOString();
    const rawDesc = cols[descIdx] || 'Transaction';

    let amount = 0;
    let type: TransactionType = 'expense';

    if (debitIdx !== -1 && cols[debitIdx] && parseFloat(cols[debitIdx].replace(/[^0-9.]/g, '')) > 0) {
      amount = parseFloat(cols[debitIdx].replace(/[^0-9.]/g, ''));
      type = 'expense';
    } else if (creditIdx !== -1 && cols[creditIdx] && parseFloat(cols[creditIdx].replace(/[^0-9.]/g, '')) > 0) {
      amount = parseFloat(cols[creditIdx].replace(/[^0-9.]/g, ''));
      type = 'income';
    } else if (amountIdx !== -1 && cols[amountIdx]) {
      const rawAmt = cols[amountIdx];
      const parsed = parseFloat(rawAmt.replace(/[^0-9.-]/g, ''));
      if (!isNaN(parsed)) {
        amount = Math.abs(parsed);
        type = parsed < 0 || rawDesc.toLowerCase().includes('dr') ? 'expense' : 'income';
      }
    }

    if (isNaN(amount) || amount <= 0) continue;

    // Normalizing Date
    let isoDate = new Date().toISOString();
    try {
      const parsedDate = new Date(rawDate);
      if (!isNaN(parsedDate.getTime())) {
        isoDate = parsedDate.toISOString();
      }
    } catch (e) {
      isoDate = new Date().toISOString();
    }

    // Auto categorize based on description keywords
    let category = cols[categoryIdx] || 'Other';
    const lowerDesc = rawDesc.toLowerCase();
    if (lowerDesc.includes('swiggy') || lowerDesc.includes('zomato') || lowerDesc.includes('starbucks') || lowerDesc.includes('restaurant') || lowerDesc.includes('food') || lowerDesc.includes('grocery') || lowerDesc.includes('supermarket')) {
      category = 'Food & Dining';
    } else if (lowerDesc.includes('uber') || lowerDesc.includes('ola') || lowerDesc.includes('fuel') || lowerDesc.includes('petrol') || lowerDesc.includes('shell') || lowerDesc.includes('metro')) {
      category = 'Transport';
    } else if (lowerDesc.includes('amazon') || lowerDesc.includes('flipkart') || lowerDesc.includes('myntra') || lowerDesc.includes('mall') || lowerDesc.includes('shopping')) {
      category = 'Shopping';
    } else if (lowerDesc.includes('electricity') || lowerDesc.includes('airtel') || lowerDesc.includes('jio') || lowerDesc.includes('rent') || lowerDesc.includes('water') || lowerDesc.includes('bill')) {
      category = 'Bills & Utilities';
    } else if (lowerDesc.includes('salary') || lowerDesc.includes('payroll') || lowerDesc.includes('client') || lowerDesc.includes('invoice')) {
      category = 'Salary';
      type = 'income';
    } else if (type === 'income') {
      category = 'Other Income';
    }

    results.push({
      date: isoDate,
      description: rawDesc,
      amount,
      type,
      category,
      notes: `Imported via CSV (${rawDate})`,
    });
  }

  return results;
}
