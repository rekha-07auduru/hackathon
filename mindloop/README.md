# MindLoop AI Widget Demo

This repository contains a simple landing page with an integrated AI assistant widget. The widget accepts text or an image (with optional description) and can generate:

- Summaries
- Quizzes (multiple choice)
- Flashcards
- Fill-in-the-blank exercises

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) installed (v16+ recommended)

### Install & Run
```bash
# from the project root
npm install    # not strictly necessary, there are no dependencies
npm run dev    # starts a static server on port 3000
```

Open **http://localhost:3000** in your browser to view the page.

### API Key Setup
1. Click the floating light‑bulb icon (bottom-right) to open the AI panel.
2. If prompted, paste your OpenAI API key (`sk-...`) into the dialog. It will be stored in `localStorage` for subsequent visits.
3. Alternatively, you can manually set it via the browser console:
   ```js
   localStorage.setItem('OPENAI_API_KEY','your_key_here');
   ```

> **Security note:** avoid committing your API key into source control. The widget already prompts you to set the key, so you can remove the hard‑coded value in `script.js` after initial setup.

### Usage
- Paste or type text in the textarea.
- (Optional) Upload an image and provide a brief description.
- Click one of the action buttons (Summary, Quiz, Flashcards, Fill Blanks).
- Results appear in the bottom area of the panel.

### Development Notes
- The panel and widget are implemented in `index.html`/`style.css`/`script.js`.
- The simple server `server.js` serves files from the workspace.

## Cleanup
To remove the hard-coded API key from the code, open `script.js` and delete or comment the section that writes the default key to `localStorage`.

---

Have fun exploring the AI features!