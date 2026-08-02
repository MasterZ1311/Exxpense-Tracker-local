/**
 * FinTrack Pro — Parser Unit Tests
 * Test descriptions for all bank statement parsers.
 * 
 * Run with: npx vitest run (after adding vitest to devDependencies)
 */

// ═══════════════════════════════════════════════════════════════
// CSV Parser Tests — src/parsers/csv-parser.js
// ═══════════════════════════════════════════════════════════════

describe('CSV Parser', () => {
  // ─── Date Parsing ──────────────────────────────────────────
  describe('parseDate()', () => {
    it('should parse DD/MM/YYYY format (Indian banks)');
    it('should parse DD-MM-YYYY format (ICICI, Axis)');
    it('should parse DD/MM/YY format with 2-digit year (HDFC)');
    it('should parse MM/DD/YYYY format (US banks)');
    it('should parse DD.MM.YYYY format (Deutsche Bank)');
    it('should parse YYYY-MM-DD format (ISO standard)');
    it('should handle single-digit day/month (1/2/2024 → 2024-02-01)');
    it('should handle 2-digit year cutoff: YY > 50 → 19xx, YY ≤ 50 → 20xx');
    it('should return null for invalid dates ("32/13/2024")');
    it('should return null for empty strings');
  });

  describe('parseDateAuto()', () => {
    it('should auto-detect DD/MM/YYYY from "15/01/2024"');
    it('should auto-detect MM/DD/YYYY from "01/15/2024" when day > 12');
    it('should fall back to Date constructor for unusual formats');
    it('should return null when no format matches');
  });

  // ─── Amount Parsing ────────────────────────────────────────
  describe('parseAmount()', () => {
    it('should parse standard format: "1,500.00" → 1500');
    it('should parse Indian lakh format: "1,50,000.00" → 150000');
    it('should parse European format: "1.234,56" → 1234.56');
    it('should remove ₹ symbol: "₹1,500.00" → 1500');
    it('should remove $ symbol: "$1,500.00" → 1500');
    it('should remove € symbol: "€1.234,56" → 1234.56 (european)');
    it('should remove £ symbol: "£500.00" → 500');
    it('should handle negative amounts: "-500.00" → -500');
    it('should handle parenthesized negatives: "(500.00)" → -500');
    it('should handle DR suffix: "500.00DR" → -500');
    it('should handle CR suffix: "500.00CR" → 500 (positive)');
    it('should return null for empty string or dash');
    it('should return null for non-numeric strings');
  });

  // ─── Bank Detection ────────────────────────────────────────
  describe('detectBank()', () => {
    it('should detect HDFC from headers ["Date","Narration","Chq./Ref.No.","Withdrawal Amt.","Deposit Amt.","Closing Balance"]');
    it('should detect SBI from headers ["Txn Date","Value Date","Description","Ref No./Cheque No.","Debit","Credit","Balance"]');
    it('should detect ICICI from headers containing "Transaction Date" and signature "ICICI Bank"');
    it('should detect Chase from headers ["Transaction Date","Description","Type","Amount"]');
    it('should detect Deutsche Bank from headers containing "Buchungstag","Verwendungszweck","Betrag (EUR)"');
    it('should detect Wells Fargo via signature even without named headers (positional columns)');
    it('should return null for completely unknown headers');
    it('should prioritize higher-matching profiles when multiple match');
    it('should use rawContent for signature matching when headers are ambiguous');
  });

  // ─── Full CSV Parsing ──────────────────────────────────────
  describe('parseBankCSV()', () => {
    it('should parse HDFC CSV with 21 skip rows and separate debit/credit');
    it('should parse SBI CSV with standard format');
    it('should parse Chase CSV with single amount column (negative = debit)');
    it('should parse Deutsche Bank CSV with European number format');
    it('should parse BNP Paribas CSV with European numbers and French column names');
    it('should parse Wells Fargo CSV with positional columns (no header)');
    it('should skip rows without valid dates');
    it('should handle multi-line descriptions gracefully');
    it('should generate unique SHA-256 hashes for each transaction');
    it('should set confidence to 0.9 when bank profile is detected');
    it('should set confidence to 0.6 when parsing without a profile');
    it('should return errors array for malformed CSV data');
    it('should auto-detect bank when no profile is provided');
  });
});

// ═══════════════════════════════════════════════════════════════
// PDF Parser Tests — src/parsers/pdf-parser.js
// ═══════════════════════════════════════════════════════════════

describe('PDF Parser', () => {
  describe('groupIntoRows()', () => {
    it('should group text items with similar Y coordinates (±5px) into same row');
    it('should sort rows top-to-bottom by Y position');
    it('should sort items within each row left-to-right by X position');
    it('should handle empty input gracefully');
  });

  describe('findTableHeader()', () => {
    it('should find header row containing "Date" and amount-related keywords');
    it('should return column X positions from the header items');
    it('should use custom keyword for Indian banks (e.g., "Txn Date" for SBI)');
    it('should return null when no table header is found');
  });

  describe('classifyColumn()', () => {
    it('should classify text item into nearest column within 80px threshold');
    it('should return null for items far from any known column');
  });

  describe('parseBankPDF()', () => {
    it('should extract transactions from a well-structured PDF statement');
    it('should handle multi-page PDFs');
    it('should detect bank from PDF text content (logo text, bank name)');
    it('should handle multi-line descriptions (continuation rows without dates)');
    it('should fall back to regex when table structure detection fails');
    it('should return error for scanned/image-only PDFs with no text');
    it('should set confidence to 0.75 when using coordinate-based parsing with a profile');
    it('should set confidence to 0.4 when using regex fallback');
  });

  describe('regexFallback()', () => {
    it('should extract transactions using date + amount regex patterns');
    it('should handle Indian date format: DD/MM/YYYY');
    it('should handle US date format: MM/DD/YYYY');
    it('should extract description text between date and first amount');
    it('should handle lines with 3 amounts (debit, credit, balance)');
    it('should handle lines with 2 amounts (amount, balance)');
    it('should skip lines without dates');
  });
});

// ═══════════════════════════════════════════════════════════════
// OFX Parser Tests — src/parsers/ofx-parser.js
// ═══════════════════════════════════════════════════════════════

describe('OFX Parser', () => {
  describe('parseOFXDate()', () => {
    it('should parse "20240115120000" → "2024-01-15"');
    it('should parse "20240115" (date only, no time) → "2024-01-15"');
    it('should strip timezone info: "20240115120000[+5:GMT]" → "2024-01-15"');
    it('should return null for dates shorter than 8 characters');
    it('should return null for invalid date values');
  });

  describe('extractTag()', () => {
    it('should extract value from XML-style tag: <TAG>value</TAG>');
    it('should extract value from SGML-style tag: <TAG>value (no closing tag)');
    it('should return null for missing tags');
    it('should trim whitespace from extracted values');
  });

  describe('parseOFX()', () => {
    it('should parse valid OFX file with multiple STMTTRN blocks');
    it('should map negative TRNAMT to debit, positive to credit');
    it('should use FITID as reference number');
    it('should combine NAME and MEMO into description');
    it('should extract bank info (BANKID, ACCTID, CURDEF)');
    it('should handle QFX format (stricter XML with closing tags)');
    it('should handle SGML format (no closing tags)');
    it('should set confidence to 0.95 (OFX is highly structured)');
    it('should return error for files with no STMTTRN blocks');
    it('should handle OFX files with CHECKNUM field');
    it('should skip transactions with invalid dates or amounts');
  });
});

// ═══════════════════════════════════════════════════════════════
// Deduplication Tests — src/parsers/deduplication.js
// ═══════════════════════════════════════════════════════════════

describe('Deduplication', () => {
  describe('generateHash()', () => {
    it('should produce a 16-character hex string');
    it('should produce consistent hashes for same input');
    it('should produce different hashes for different dates');
    it('should produce different hashes for different amounts');
    it('should be case-insensitive for descriptions');
    it('should trim descriptions before hashing');
  });

  describe('isDuplicate()', () => {
    it('should return true when hash exists in the list');
    it('should return false when hash is not in the list');
  });

  describe('deduplicateBatch()', () => {
    it('should separate unique and duplicate transactions');
    it('should detect within-batch duplicates (two identical rows in same file)');
    it('should detect cross-batch duplicates (against existing DB hashes)');
    it('should return all as unique when no duplicates exist');
  });
});

// ═══════════════════════════════════════════════════════════════
// Parser Index Tests — src/parsers/index.js
// ═══════════════════════════════════════════════════════════════

describe('Parser Index', () => {
  describe('detectFileFormat()', () => {
    it('should detect CSV from .csv extension');
    it('should detect PDF from .pdf extension');
    it('should detect OFX from .ofx extension');
    it('should detect QFX from .qfx extension');
    it('should detect from MIME type when extension is ambiguous');
    it('should return null for unsupported formats (.xlsx, .txt)');
  });

  describe('parseStatement()', () => {
    it('should route CSV files to parseBankCSV');
    it('should route PDF files to parseBankPDF');
    it('should route OFX/QFX files to parseOFX');
    it('should run deduplication by default');
    it('should skip deduplication when deduplicate=false');
    it('should use provided bankProfileId when specified');
    it('should generate summary with date range, totals, and counts');
    it('should sort transactions by date (newest first)');
    it('should return meaningful errors for unsupported file types');
  });
});

// ═══════════════════════════════════════════════════════════════
// Bank Profile Tests — src/parsers/bank-profiles/
// ═══════════════════════════════════════════════════════════════

describe('Bank Profiles', () => {
  it('should have exactly 20 bank profiles registered');
  it('should have 10 Indian bank profiles with country=IN');
  it('should have 10 international bank profiles with country!=IN');
  
  describe('Each profile', () => {
    it('should have a unique id');
    it('should have a name, country, and currency');
    it('should have at least one signature string');
    it('should have a columns mapping with at least date and description');
    it('should have a valid dateFormat');
    it('should have a valid amountStyle (separate | single | single-with-suffix)');
    it('should have a valid numberFormat (standard | indian | european)');
    it('should have pdf column hints');
  });

  describe('getProfileById()', () => {
    it('should return HDFC profile for id "hdfc"');
    it('should return Chase profile for id "chase"');
    it('should return undefined for unknown id');
  });

  describe('detectProfileFromText()', () => {
    it('should detect HDFC from text containing "HDFC Bank"');
    it('should detect SBI from text containing "State Bank"');
    it('should detect Chase from text containing "JPMorgan"');
    it('should return empty array when no signatures match');
  });
});
