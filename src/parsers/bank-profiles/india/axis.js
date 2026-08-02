/** FinTrack Pro — Axis Bank Profile */
export default {
  id: 'axis',
  name: 'Axis Bank',
  country: 'IN',
  currency: 'INR',
  signatures: ['Axis Bank', 'AXIS BANK'],
  skipRows: 0,
  headerRowKeyword: 'Tran Date',
  columns: {
    date: 'Tran Date',
    description: 'Particulars',
    reference: 'CHQNO',
    debit: 'Debit',
    credit: 'Credit',
    balance: 'Balance',
  },
  dateFormat: 'DD-MM-YYYY',
  amountStyle: 'separate',
  numberFormat: 'indian',
  pdf: {
    tableStartKeyword: 'Tran Date',
    dateColumnX: [0, 80],
    descriptionColumnX: [80, 360],
    debitColumnX: [360, 450],
    creditColumnX: [450, 540],
    balanceColumnX: [540, 650],
  },
};
