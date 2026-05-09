# Advanced Code Explanation

Since this version has many more lines, we will focus on the **new complex features** that were added.

---

### 1. The Multi-Step `updateUI`
In this version, the `updateUI` function does a lot more work before showing anything:
*   **Search**: It looks at what you typed in the search box.
*   **Filter**: It looks at which category you selected.
*   **Sort**: It re-arranges the list (e.g., biggest amount first).
*   **Only then** does it draw the table. This ensures you always see exactly what you filtered for.

---

### 2. Category-Specific Budgets
Instead of just one big budget, we now have `categoryBudgets`. 
*   When you set a budget for "Food", the app stores it like this: `categoryBudgets["Food"] = 500`.
*   The `checkBudgets` function then loops through all your transactions, adds up how much you spent on "Food", and compares it to that 500.

---

### 3. Comparison Charts
We now use two different chart types from **Chart.js**:
*   `type: 'doughnut'`: Perfect for showing how your total spending is split between Food, Travel, etc.
*   `type: 'bar'`: Used to compare only two big numbers: Total Income vs. Total Expense. This helps you see if you are "in the green" or "in the red."

---

### 4. Backup and Restore (JSON)
This is a very powerful feature for developers:
*   **Export JSON**: This takes all your data, turns it into a long piece of text (JSON), and puts it in a `.json` file for you to download.
*   **Import JSON**: This uses the `FileReader` tool. It "reads" that text file back, turns it back into JavaScript objects, and updates your screen. This allows you to move your data between different computers!

---

### 5. Table Rendering
Instead of just a simple list `<ul>`, we now use a `<table>`.
*   We use "Template Literals" (the backticks `` ` ``) to create the HTML for each row.
*   We also add "Conditional Classes": `class="${t.type === 'income' ? 'income-text' : 'expense-text'}"`. This makes income numbers green and expense numbers red automatically!
