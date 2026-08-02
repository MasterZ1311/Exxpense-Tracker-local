/** FinTrack Pro — Punjab National Bank Profile */
export default {
  id: 'pnb',
  name: 'Punjab National Bank',
  country: 'IN',
  currency: 'INR',
  signatures: ['Punjab National Bank', 'PNB'],
  skipRows: 0,
  headerRowKeyword: 'Date',
  columns: {
    date: 'Date',
    description: 'Narration',
    reference: 'Cheque No.',
    debit: 'Debit Amount',
    credit: 'Credit Amount',
    balance: 'Balance',
  },
  dateFormat: 'DD/MM/YYYY',
  amountStyle: 'separate',
  numberFormat: 'indian',
  pdf: {
    tableStartKeyword: 'Date',
    dateColumnX: [0, 80],
    descriptionColumnX: [80, 350],
    debitColumnX: [350, 450],
    creditColumnX: [450, 550],
    balanceColumnX: [550, 650],
  },
};
