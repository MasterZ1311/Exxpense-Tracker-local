/** FinTrack Pro — Bank Profile: ANZ Bank */
export default {
  id: 'anz',
  name: 'ANZ Bank',
  country: 'AU',
  currency: 'AUD',
  signatures: ['ANZ'],
  skipRows: 0,
  headerRowKeyword: 'Date',
  columns: {
    date: 'Date',
    description: 'Description',
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
