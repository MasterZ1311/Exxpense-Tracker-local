/** FinTrack Pro — IDFC FIRST Bank Profile */
export default {
  id: 'idfc',
  name: 'IDFC FIRST Bank',
  country: 'IN',
  currency: 'INR',
  signatures: ['IDFC FIRST', 'IDFC'],
  skipRows: 0,
  headerRowKeyword: 'Date',
  columns: {
    date: 'Date',
    description: 'Narration',
    reference: 'Chq/Ref',
    debit: 'Debit',
    credit: 'Credit',
    balance: 'Balance',
  },
  dateFormat: 'DD/MM/YYYY',
  amountStyle: 'separate',
  numberFormat: 'indian',
  pdf: {
    tableStartKeyword: 'Date',
    dateColumnX: [0, 80],
    descriptionColumnX: [80, 370],
    debitColumnX: [370, 460],
    creditColumnX: [460, 550],
    balanceColumnX: [550, 650],
  },
};
