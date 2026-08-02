/** FinTrack Pro — Bank Profile: Wells Fargo */
export default {
  id: 'wells-fargo',
  name: 'Wells Fargo',
  country: 'US',
  currency: 'USD',
  signatures: ['Wells Fargo'],
  skipRows: 0,
  headerRowKeyword: null,
  positionalColumns: true,
  columns: {
    date: 0,
    amount: 1,
    _unused2: 2,
    _unused3: 3,
    description: 4,
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
