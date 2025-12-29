# BOL-TAS

A modern React application built with Vite, featuring Redux Toolkit for state management and Tailwind CSS for styling.

## Features

- ⚡ Fast development with Vite
- 🔄 Hot Module Replacement (HMR)
- 🛠️ ESLint for code linting
- 🎨 Tailwind CSS for utility-first styling
- 🏪 Redux Toolkit for state management
- 📦 React 19 with latest features

## Tech Stack

- **Frontend Framework:** React 19
- **Build Tool:** Vite (with Rolldown)
- **State Management:** Redux Toolkit
- **Styling:** Tailwind CSS
- **Linting:** ESLint with flat config
- **Code Formatting:** Prettier
- **Git Hooks:** Husky + lint-staged

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd bol-tas
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check code quality

## Project Structure

```
bol-tas/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   │   └── react.svg
│   ├── components/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── eslint.config.js
├── vite.config.js
├── package.json
└── README.md
```

## Development

### Code Quality

This project uses ESLint with a flat configuration for code linting. Prettier is configured for code formatting. Husky and lint-staged ensure code quality on commits.

### State Management

Redux Toolkit is used for state management. Store configuration and slices are located in the `src` directory.

### Styling

Tailwind CSS is used for styling. Custom styles can be added in `src/index.css`.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a pull request

## License

This project is private and not licensed for public use.
