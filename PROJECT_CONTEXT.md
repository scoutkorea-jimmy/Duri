# Project context

- Purpose: Korean public website for 두리손잡고 사회적협동조합 and 두리손잡고 직업재활센터.
- Stack: static HTML, CSS, JavaScript; GitHub Pages. No build or required environment variables.
- Current structure: `coop.html` presents the cooperative's documented day and after-school activity services; `index.html` and the other content pages serve the vocational rehabilitation center. `assets/site.js` injects shared navigation, footer, gate, and UI behavior.
- Design: Material 3 color roles and shared component styling, with green for the cooperative and ocean blue for the center. Existing Korean line wrapping and accessibility rules remain in `rules/`.
- Known limits: the legacy notice board, login, and other forms use browser-local behavior. One-time donations route to telephone inquiry while verified payment details are pending; recurring donations show a service-preparation notice.
- Next: confirm the cooperative's official payment details or payment URL, then implement an actual one-time donation route if supplied. Preserve the two-site gate and verify both branches after changes.
