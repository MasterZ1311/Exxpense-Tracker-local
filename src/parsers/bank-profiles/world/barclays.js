/** FinTrack Pro — Bank Profile: Barclays */
export default {
  id: 'barclays',
  name: 'Barclays',
  country: 'GB',
  currency: 'GBP',
  signatures: ['Barclays'],
  skipRows: 0,
  headerRowKeyword: 'Date',
  columns: {
    date: 'Date',
    description: 'Memo',
    amount: 'Amount',
  },
  dateFormat: 'DD/MM/YYYY',
  amountStyle: 'single',
  numberFormat: 'standard',
  pdf: {
    tableStartKeyword: 'Date',
    dateColumnX: [0, 80],
    descriptionColumnX: [80, 440],
    debitColumnX: [440, 550],
    creditColumnX: [440, 550],
    balanceColumnX: [550, 650],
  },
};
