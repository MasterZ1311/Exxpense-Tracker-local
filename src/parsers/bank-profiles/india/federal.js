/** FinTrack Pro — Federal Bank Profile */
export default {
  id: 'federal',
  name: 'Federal Bank',
  country: 'IN',
  currency: 'INR',
  signatures: ['Federal Bank', 'FEDERAL'],
  skipRows: 0,
  headerRowKeyword: 'Date',
  columns: {
    date: 'Date',
    description: 'Description',
    reference: 'Ref. No',
    debit: 'Debit',
    credit: 'Credit',
    balance: 'Balance',
  },
  dateFormat: 'DD-MM-YYYY',
  amountStyle: 'separate',
  numberFormat: 'indian',
  pdf: {
    tableStartKeyword: 'Date',
    dateColumnX: [0, 80],
    descriptionColumnX: [80, 360],
    debitColumnX: [360, 450],
    creditColumnX: [450, 540],
    balanceColumnX: [540, 650],
  },
};
