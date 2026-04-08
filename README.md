> ⚠️ **Work in Progress** — SaltLick is under active development. Features, APIs, and documentation are subject to change.

## SaltLick

A gamified story format for [Twine 2](https://twinery.org/) that brings interactive fiction to life with game-like mechanics.

### What is SaltLick?

SaltLick is a custom story format for Twine 2 that transforms interactive fiction into dynamic, game-like experiences. It supports:

- **Interactive narrative passages** with markdown rendering
- **Choice lists** with branching logic and state management
- **Game state tracking** for variables, inventory, and custom data
- **Visual novel and battle modes** with specialized styling
- **Custom scripting** through DscriptParser for conditional logic and dynamic behavior

### Getting Started

#### Installation

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd salt-lick
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development:
   ```bash
   npm run dev
   ```

#### Building for Twine

To build the format for use in Twine 2:

```bash
npm run build
```

This generates the compiled format in the `dist/` directory.

### Usage

SaltLick formats your Twine story using a `tw-storydata` structure. Basic features include:

**Passages**: Navigate between story passages
```javascript
game.goto(passageName)    // Jump to a passage by name
game.goBack()              // Go back in history
```

**State Management**: Track and update game variables
```javascript
setState('playerName', 'Alice')
let name = getState('playerName')
```

**Custom Components**: 
- `<option-list>` — Render interactive choice lists
- `<transclude-passage>` — Include passages within other passages

### Project Structure

```
salt-lick/
├── src/
│   ├── components/          # Web components (OptionList, Passage)
│   ├── parser/              # DscriptParser for custom script syntax
│   ├── utils/               # Utilities (passages, tag handlers, types)
│   ├── styles/              # CSS (main, visual-novel themes)
│   ├── Game.ts              # Main game engine
│   ├── main.ts              # Entry point
│   └── marked.ts            # Markdown parser extensions
├── public/                  # Static assets
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
└── saltlick.json            # Twine format metadata
```

### Development

**Run tests:**
```bash
npm run test
```

**Preview the build:**
```bash
npm run preview
```

### Key Technologies

- **Vite** / Rolldown — Fast build tooling
- **TypeScript** — Type-safe implementation
- **Marked** — Markdown parsing with custom extensions
- **Web Components** — Custom HTML elements for interactivity
- **Vitest** — Unit testing framework

### License

MIT — See [LICENSE](LICENSE) file for details.