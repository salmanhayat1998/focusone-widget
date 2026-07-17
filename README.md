# FocusOne — Desktop App (Windows) — Setup
A tool for managing daily/weekly tasks with mobile reminders

## WHAT YOU GET
A real desktop app. Always-on-top widget mode, a full window mode,
and your tasks are saved permanently to disk — they survive reboots,
closing the app, everything. No AI, no accounts, no internet needed.

--------------------------------------------------
## ONE-TIME SETUP (about 5 minutes)

1. Install Node.js (if you don't have it):
   https://nodejs.org  → download the LTS version → install.
   (Check it worked: open a terminal / PowerShell and run:  node -v )

2. Put this "focusone-desktop" folder somewhere permanent
   (e.g. Documents\focusone-desktop).

3. Open a terminal IN that folder:
   - File Explorer → open the folder → click the address bar →
     type  cmd  → Enter. (Or Shift+Right-click → "Open PowerShell here".)

4. Install the app's dependencies (downloads Electron, ~one time):
       npm install

--------------------------------------------------
## RUN IT (every day)

From that same folder:
       npm start

The app opens. That's it.

Want it to feel like a normal app you double-click? See "MAKE A .EXE" below.

--------------------------------------------------
## USING IT

- Top-right buttons:
    "Widget mode"  → shrinks to a small always-on-top panel,
                      snaps to the top-right corner, stays above
                      other windows so it nags you while you work.
    "Full window"  → back to the big window.
    "Pin on top"   → keep the current window above everything.

- Your data is saved automatically to:
    C:\Users\<you>\AppData\Roaming\FocusOne\focusone-data.json
  Delete that file only if you want to wipe everything.

--------------------------------------------------
## MAKE A .EXE (optional — no terminal needed after this)

From the folder, run:
       npm run build

This creates a "dist" folder containing FocusOne.exe (portable —
no installer needed). Move that .exe anywhere and double-click to run.

AUTO-START ON WINDOWS BOOT (optional):
   1. Press Win+R, type:  shell:startup   Enter.
   2. Right-click FocusOne.exe → "Create shortcut".
   3. Drag the shortcut into that Startup folder.
   Now it opens every time Windows starts.

--------------------------------------------------
## NOTES
- First "npm install" needs internet (downloads Electron). After that,
  the app runs fully offline.
- No AI anywhere. No API keys. No login. Your tasks never leave your PC.
- Mobile widget/reminders come later — this is the computer version first.

--------------------------------------------------
## PHONE REMINDERS (free, via ntfy)

1. On your phone, install the free "ntfy" app:
   - Android: Play Store → search "ntfy"
   - iPhone: App Store → search "ntfy"
2. In the FocusOne desktop app, click "Phone reminders" (top right).
3. Copy the topic name it shows you (or type your own private one).
4. In the ntfy phone app: tap +, and subscribe to that EXACT topic name.
5. Back in FocusOne, click "Send test to phone" — your phone should buzz.
6. Click Save.

Now, when a check-in timer ends on your laptop, your phone gets a
notification showing your current task and the step you're on.

Keep the topic name private — anyone who knows it could send you notes.
No account, no login, no cost.


--------------------------------------------------
## AUTO-SUBSCRIBE (no typing the topic name)
In 'Phone reminders', you'll see a QR code and a link.
- Scan the QR with your phone camera, OR
- Copy the link and open it on your phone.
Either one opens the ntfy app already subscribed. Done.

## PERIODIC BUZZ
In the same window, pick 'Buzz me the current task every 15/30/45/60 min'
to get a recurring nudge of what you should be doing. Off by default.
(Fires while the laptop app is running.)

## WHAT BUZZES YOUR PHONE NOW
- Every subtask you tick done (shows what's next)
- Every task you finish (shows the next task)
- When a check-in timer ends
- The periodic nudge, if you turn it on
