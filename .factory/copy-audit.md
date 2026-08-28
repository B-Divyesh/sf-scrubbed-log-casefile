# Copy audit

Audited 2026-08-28 against the landing page and every reachable status in
`site/src/main.ts`. Words split on whitespace. No sentence exceeds 22 words,
and no sentence contains a banned marketing word.

| Landing-page sentence | Words |
|---|---:|
| Offline. | 1 |
| The sample scrubber still works. | 5 |
| Reconnect to verify a saved license. | 6 |
| For engineers escalating bugs, it keeps useful structure while replacing common credentials and identifiers. | 14 |
| Opens a ready example. | 4 |
| Nothing is saved. | 3 |
| The preview changes text in this tab. | 7 |
| It sends no scrub input and saves no scrub input. | 10 |
| Recognizes common emails, IPv4 addresses, credentials, bearer tokens, and JWTs. | 10 |
| Run the scrubber to create a preview. | 7 |
| Waiting for input. | 3 |
| Scrub and package an incident log. | 6 |
| Point one command at files or directories. | 7 |
| The same value gets the same replacement within one casefile. | 10 |
| A casefile is an AES-256 encrypted ZIP with rule names and counts, not matched values. | 15 |
| Rules cannot find every secret or identifier. | 7 |
| Review the casefile before sharing. | 5 |
| This is not a log host or cloud scrubber. | 9 |
| Run the bundled sample first, then pack your own incident files. | 11 |
| Recorded from the shipped casefile demo command. | 7 |
| It creates two sample files and one casefile in a new temporary directory, then prints its paths and password. | 19 |
| Password stays out of arguments. | 5 |
| Read it from CASEFILE_PASSWORD or another variable. | 7 |
| A failed run leaves no partial casefile. | 7 |
| Existing output remains unless you pass --force. | 7 |
| Review before sharing. | 3 |
| casefile inspect shows the manifest and can extract scrubbed files into a new temporary directory. | 15 |
| The CLI stays MIT-licensed. | 4 |
| The optional team pack adds four policy starters and a review checklist. | 12 |
| No active team-pack license on this device. | 7 |
| Team pack ready. | 3 |
| Download the AWS, Kubernetes, PostgreSQL, and HTTP starter rules with the team review checklist. | 14 |
| Nothing to scrub yet. | 4 |
| Paste a log fragment or load the example, then try again. | 11 |
| No built-in rule matched. | 4 |
| Add a project rule in a policy file. | 8 |
| Copy was blocked by the browser. | 6 |
| Select the text and copy it manually. | 7 |
| Reconnect to verify the saved license. | 6 |
| Team-pack license active on this device. | 6 |
| License no longer active. | 4 |
| You can purchase or paste another token. | 7 |
| Could not reach license verification. | 5 |
| The saved verdict is unchanged; try again when connected. | 9 |
| License received. | 2 |
| Confirming it with Sociobot… | 4 |
| Verifying license… | 2 |
| Scrub incident logs locally before sharing. | 6 |

The generated success status has a four-word base plus two words per matched
rule. All five browser rules produce at most 14 words.

## Headings and actions

- Headline: **Scrub incident logs before sharing** — 5 words and states the job.
- Supporting sentence: 14 words and names engineers escalating bugs.
- Primary action: **Try it with sample data**; adjacent copy explains the result and storage boundary.
- Product headings name the task: **Test an incident log fragment**, **Create the encrypted ZIP**, and **Limits of rule-based log scrubbing**.
- Actions name results: **Scrub this fragment**, **Copy result**, **Copy command**, **Install the CLI**, **Buy the team pack**, **Verify license**, and **Download policy pack**.
- The three facts appear before the action on a 390×844 screen.

## Terminology

| Concept | One term used |
|---|---|
| Packaged support artifact | casefile; defined once as an AES-256 encrypted ZIP |
| Redaction replacement | replacement |
| One named detector | rule |
| JSON detector collection | policy file |
| Browser try-out | demo |
| Example inputs | sample data |
| Optional purchase | team pack |

The art label says **EXAMPLE REDACTED LOG**. Its caption explains matching
replacement tokens instead of using case lore.
