/** FinTrack Pro — Kotak Mahindra Bank Profile */
export default {
  id: 'kotak',
  name: 'Kotak Mahindra Bank',
  country: 'IN',
  currency: 'INR',
  signatures: ['Kotak Mahindra', 'KOTAK'],
  skipRows: 0,
  headerRowKeyword: 'Date',
  columns: {
    date: 'Date',
    description: 'Description',
    reference: 'Chq/Ref No.',
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
    descriptionColumnX: [80, 370],
    debitColumnX: [370, 460],
    creditColumnX: [460, 550],
    balanceColumnX: [550, 650],
  },
};
