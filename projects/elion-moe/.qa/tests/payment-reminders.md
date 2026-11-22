# Payment reminders (email) · #43cd29

Source: mifrat #43cd29, checked 2026-10-28/29 (qa-stand + prod). Role: own account (no admin@admin.com — emails go to admin.com).

| # | Case | Steps | Expected |
|---|---|---|---|
| 1 | Switch default | /profile on a user who never turned it on | "Payment reminders" switch is off |
| 2 | Turn on + persist | Turn switch on → reload | Stays on; "Sent to <registered email> every morning"; toast |
| 3 | Hebrew / RTL | Switch language to HE on /profile | Title "תזכורות תשלום", knob mirrored, toasts הופעלו / כובו |
| 4 | Turn off | Turn switch off → reload | Stays off; nothing from the next run |
| 5 | Week-ahead email | Unpaid outgoing payment due D+7, switch on | At ~05:00 UTC one email from ELion <noreply@elionvc.com>, section "Due in one week · בעוד שבוע", amount in entry currency, Total per currency when >1 row, button "Open Cash Flow · לתזרים", turn-off line EN/HE, lands in Inbox |
| 6 | Month-ahead / on the day | Payment due D+1 month / D | Sections "Due in one month · בעוד חודש" / "Due today · לתשלום היום" |
| 7 | One email per day | Several reminders the same day | One email, grouped by date |
| 8 | Paid gets no reminder | Mark payment paid (through account or "status only") before its reminder date | Payment not in the email; if it was the only one, no email (dry run: emails: []) |
| 9 | Exclusions | Incoming, overdue, 2nd side of internal transfer, "Current value correction" | Never in the email |
| 10 | Link | Click payment name in email | Opens Cash Flow on that row (after login if needed) |

Notes: on qa-stand all mail goes to delivered@resend.dev — check emails on prod or by developer dry run (fn_send_payment_reminders(date, true)).
