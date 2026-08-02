/** FinTrack Pro — Bank Profile: Chase */
export default {
  id: 'chase',
  name: 'Chase (JPMorgan)',
  country: 'US',
  currency: 'USD',
  signatures: ['Chase', 'JPMorgan'],
  skipRows: 0,
  headerRowKeyword: 'Transaction Date',
  columns: {
    date: 'Transaction Date',
    description: 'Description',
    reference: 'Type',
    amount: 'Amount',
  },
  dateFormat: 'MM/DD/YYYY',
  amountStyle: 'single',
  numberFormat: 'standard',
  pdf: {
    tableStartKeyword: 'Date',
    dateColumnX: [0, 90],
    descriptionColumnX: [90, 450],
    debitColumnX: [450, 550],
    creditColumnX: [450, 550],
    balanceColumnX: [550, 650],
  },
};
