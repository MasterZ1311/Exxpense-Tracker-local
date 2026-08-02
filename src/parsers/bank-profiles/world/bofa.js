/** FinTrack Pro — Bank Profile: Bank of America */
export default {
  id: 'bofa',
  name: 'Bank of America',
  country: 'US',
  currency: 'USD',
  signatures: ['Bank of America', 'BofA'],
  skipRows: 0,
  headerRowKeyword: 'Date',
  columns: {
    date: 'Date',
    description: 'Description',
    amount: 'Amount',
    balance: 'Running Bal.',
  },
  dateFormat: 'MM/DD/YYYY',
  amountStyle: 'single',
  numberFormat: 'standard',
  pdf: {
    tableStartKeyword: 'Date',
    dateColumnX: [0, 80],
    descriptionColumnX: [80, 420],
    debitColumnX: [420, 520],
    creditColumnX: [420, 520],
    balanceColumnX: [520, 650],
  },
};
