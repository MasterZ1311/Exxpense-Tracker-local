/** FinTrack Pro — Bank Profile: DBS Bank */
export default {
  id: 'dbs',
  name: 'DBS Bank',
  country: 'SG',
  currency: 'SGD',
  signatures: ['DBS Bank', 'DBS'],
  skipRows: 0,
  headerRowKeyword: 'Transaction Date',
  columns: {
    date: 'Transaction Date',
    description: 'Reference',
    debit: 'Debit Amount',
    credit: 'Credit Amount',
    balance: 'Running Balance',
  },
  dateFormat: 'DD/MM/YYYY',
  amountStyle: 'separate',
  numberFormat: 'standard',
  pdf: {
    tableStartKeyword: 'Transaction Date',
    dateColumnX: [0, 90],
    descriptionColumnX: [90, 370],
    debitColumnX: [370, 460],
    creditColumnX: [460, 550],
    balanceColumnX: [550, 650],
  },
};
