/** FinTrack Pro — Bank Profile: Deutsche Bank */
export default {
  id: 'deutsche',
  name: 'Deutsche Bank',
  country: 'DE',
  currency: 'EUR',
  signatures: ['Deutsche Bank'],
  skipRows: 0,
  headerRowKeyword: 'Buchungstag',
  columns: {
    date: 'Buchungstag',
    description: 'Verwendungszweck',
    amount: 'Betrag (EUR)',
  },
  dateFormat: 'DD.MM.YYYY',
  amountStyle: 'single',
  numberFormat: 'european',
  pdf: {
    tableStartKeyword: 'Buchungstag',
    dateColumnX: [0, 85],
    descriptionColumnX: [85, 450],
    debitColumnX: [450, 560],
    creditColumnX: [450, 560],
    balanceColumnX: [560, 650],
  },
};
