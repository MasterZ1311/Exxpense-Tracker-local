/** FinTrack Pro — Canara Bank Profile */
export default {
  id: 'canara',
  name: 'Canara Bank',
  country: 'IN',
  currency: 'INR',
  signatures: ['Canara Bank', 'CANARA'],
  skipRows: 0,
  headerRowKeyword: 'Trans Date',
  columns: {
    date: 'Trans Date',
    description: 'Description',
    reference: 'Reference',
    debit: 'Debit',
    credit: 'Credit',
    balance: 'Balance',
  },
  dateFormat: 'DD-MM-YYYY',
  amountStyle: 'separate',
  numberFormat: 'indian',
  pdf: {
    tableStartKeyword: 'Trans Date',
    dateColumnX: [0, 85],
    descriptionColumnX: [85, 360],
    debitColumnX: [360, 450],
    creditColumnX: [450, 540],
    balanceColumnX: [540, 650],
  },
};
