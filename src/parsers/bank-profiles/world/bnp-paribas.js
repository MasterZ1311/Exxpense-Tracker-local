/** FinTrack Pro — Bank Profile: BNP Paribas */
export default {
  id: 'bnp-paribas',
  name: 'BNP Paribas',
  country: 'FR',
  currency: 'EUR',
  signatures: ['BNP Paribas', 'BNP'],
  skipRows: 0,
  headerRowKeyword: 'Date',
  columns: {
    date: 'Date',
    description: 'Libellé',
    debit: 'Débit',
    credit: 'Crédit',
    balance: 'Solde',
  },
  dateFormat: 'DD/MM/YYYY',
  amountStyle: 'separate',
  numberFormat: 'european',
  pdf: {
    tableStartKeyword: 'Date',
    dateColumnX: [0, 80],
    descriptionColumnX: [80, 370],
    debitColumnX: [370, 460],
    creditColumnX: [460, 550],
    balanceColumnX: [550, 650],
  },
};
