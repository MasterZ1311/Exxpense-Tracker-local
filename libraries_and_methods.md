# Libraries and Methods Used (Advanced Version)

This document covers the tools and techniques used in the feature-rich version of the tracker.

## External Libraries (via CDN)

1.  **Chart.js**
    *   **New Usage:** Now renders two charts: a **Doughnut chart** for category expenses and a **Bar chart** for Income vs Expense comparison.
2.  **jsPDF**
    *   **Usage:** Generates a text-based financial statement.
3.  **SheetJS (XLSX)**
    *   **Usage:** Exports the entire transaction history to a spreadsheet.

---

## Advanced JavaScript Concepts Used

### Data Filtering and Searching
*   `filter()`: Used to search descriptions and filter by category simultaneously.
*   `toLowerCase()` & `includes()`: Makes the search box non-case-sensitive.

### Dynamic Sorting
*   `sort()`: Takes the user's choice (Newest, Oldest, Highest, Lowest) and reorders the array before it hits the screen.
*   `new Date()`: Converts date strings into date objects so they can be compared mathematically for sorting.

### Advanced Logic
*   **Unique IDs**: Uses `Date.now().toString()` to give every transaction a unique ID, making deleting more reliable.
*   **Object State**: `categoryBudgets` is an object (e.g., `{ Food: 500 }`) used to store custom limits for different categories.
*   **Conditional Rendering**: The "Warning" alerts only appear if the math shows your spending for a specific category is higher than the limit you set.

### File Handling
*   **JSON Backup**: Uses `Blob` and `URL.createObjectURL` to create a virtual file for the user to download.
*   **JSON Restore**: Uses `FileReader` to read a local file and load it back into the app's memory.
