/** FinTrack Pro — Bank of Baroda Profile */
export default {
  id: 'bob',
  name: 'Bank of Baroda',
  country: 'IN',
  currency: 'INR',
  signatures: ['Bank of Baroda', 'BOB'],
  skipRows: 0,
  headerRowKeyword: 'Date',
  columns: {
    date: 'Date',
    description: 'Description',
    reference: 'Ref No',
    debit: 'Withdrawal',
    credit: 'Deposit',
    balance: 'Balance',
  },
  dateFormat: 'DD/MM/YYYY',
  amountStyle: 'separate',
  numberFormat: 'indian',
  pdf: {
    tableStartKeyword: 'Date',
    dateColumnX: [0, 80],
    descriptionColumnX: [80, 350],
    debitColumnX: [350, 450],
    creditColumnX: [450, 550],
    balanceColumnX: [550, 650],
  },
};
