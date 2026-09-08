# Google Play Store Listing & Metadata Package — Oikos

---

## 1. Store Listing Details

* **App Title (max 30 chars):**  
  `Oikos: Personal Expense Ledger`

* **Short Description (max 80 chars):**  
  `Private, offline financial ledger with editorial cash flow & on-device analyst.`

* **Category:**  
  `Finance / Personal Finance`

* **Content Rating:**  
  `Everyone (3+)`

---

## 2. Full Description (max 4000 chars)

```text
YOUR MONEY. YOUR DEVICE. YOUR RULES.

Named after the ancient Greek root of economics, Oikos is a personal financial instrument designed for intentional budgeters, privacy advocates, and mindful investors. 

Unlike traditional finance apps that demand access to your bank passwords, bombard you with predatory loan ads, or lock your records behind monthly subscriptions, Oikos runs 100% offline with zero cloud tracking.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
KEY CAPABILITIES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

◆ EDITORIAL MONEY FLOW & BALANCE
Experience your finances through a calm, tactile paper-and-ink ledger interface. See your total liquid balance, monthly income flow, expense distribution, and 20-segment Financial Pulse rhythm track at a single glance.

◆ 2-TAP RAPID LEDGER LOGGING
Log expenses in 2 taps with smart preset increment chips (+₹100, +₹500, +₹1k, +₹2k). Smart keyword auto-categorization detects merchants (Swiggy, Uber, Chai, Groceries, Rent) as you type.

◆ BIOMETRIC PRIVACY SHIELD
Hardware-level Face ID and Fingerprint app-lock guarantees that your financial ledger is completely private to you, even when your phone is unlocked.

◆ PLANNING & DEBT-FREE JOURNEYS
• Budget Tracks: Real-time spend vs limit monitoring with proactive threshold alerts.
• Goal Journeys: Target timelines and required monthly savings calculator.
• Debt Payoff: Visualize your exact debt-free freedom date with structured amortization tracking.

◆ WEALTH & NET WORTH BALANCE SHEET
Track physical and digital assets in one place:
• Investment Portfolio: Asset allocation breakdown (Equity, Mutual Funds, Gold, Cash) and all-time returns.
• Net Worth Tracker: Complete balance sheet reconciling liquid accounts, holdings, and liabilities.

◆ ON-DEVICE FINANCIAL DESK (AI ANALYST)
Ask direct questions about your financial health:
• "Where did my money go this month?"
• "Can I afford a ₹25,000 purchase?"
• "Analyze my weekend spending velocity."
Runs 100% locally on your phone's processor with zero data sent to external AI servers.

◆ TRUE DATA OWNERSHIP & STATEMENT INTAKE
• Native File Picker & Share Sheet: AirDrop, WhatsApp, Google Drive, and Files integration.
• Import statement CSV records with automated categorization.
• 1-tap Export to standard CSV for spreadsheet analysis.
• Versioned JSON backup & restore engine.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
100% PRIVACY GUARANTEE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Zero cloud servers.
• Zero third-party ad networks or tracking SDKs.
• Zero bank credential scraping.
• Offline-first SQLite database that never leaves your device.
```

---

## 3. Google Play Data Safety Questionnaire Answers

| Question | Answer |
| :--- | :--- |
| **Does your app collect or share user data?** | **No** |
| **Is all user data encrypted in transit?** | **N/A (No network transmission)** |
| **Do you provide a way for users to request data deletion?** | **Yes (1-tap Factory Reset in app)** |

---

## 4. Google Play Closed Testing Launch Checklist (20 Testers)

1. **Build the `.aab`:** Run `npx eas build -p android --profile production`
2. **Google Play Console:** Create new app listing → Select "Closed testing (Alpha/Internal)".
3. **Upload Bundle:** Upload the generated `.aab` file.
4. **Data Safety & Privacy Policy:** Paste hosted link for `PRIVACY_POLICY.md`.
5. **Invite Testers:** Create an email list with 20 testers (friends, family, or testing groups).
6. **14-Day Testing:** Ensure all 20 testers opt-in and keep the app installed for 14 consecutive days.
7. **Apply for Production Access:** Submit application on Google Play Console!
