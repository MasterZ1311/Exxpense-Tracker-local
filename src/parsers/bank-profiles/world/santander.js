/** FinTrack Pro — Bank Profile: Santander */
export default {
  id: 'santander',
  name: 'Santander',
  country: 'GB',
  currency: 'GBP',
  signatures: ['Santander'],
  skipRows: 0,
  headerRowKeyword: 'Date',
  columns: {
    date: 'Date',
    description: 'Description',
    amount: 'Amount',
    balance: 'Balance',
  },
  dateFormat: 'DD/MM/YYYY',
  amountStyle: 'single',
  numberFormat: 'standard',
  pdf: {
    tableStartKeyword: 'Date',
    dateColumnX: [0, 80],
    descriptionColumnX: [80, 400],
    debitColumnX: [400, 510],
    creditColumnX: [400, 510],
    balanceColumnX: [510, 650],
  },
};
