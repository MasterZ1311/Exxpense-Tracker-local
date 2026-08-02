/** FinTrack Pro — Bank Profile: HSBC */
export default {
  id: 'hsbc',
  name: 'HSBC',
  country: 'GB',
  currency: 'GBP',
  signatures: ['HSBC'],
  skipRows: 0,
  headerRowKeyword: 'Date',
  columns: {
    date: 'Date',
    description: 'Description',
    debit: 'Payment',
    credit: 'Lodgement',
    balance: 'Balance',
  },
  dateFormat: 'DD/MM/YYYY',
  amountStyle: 'separate',
  numberFormat: 'standard',
  pdf: {
    tableStartKeyword: 'Date',
    dateColumnX: [0, 80],
    descriptionColumnX: [80, 380],
    debitColumnX: [380, 470],
    creditColumnX: [470, 560],
    balanceColumnX: [560, 650],
  },
};
