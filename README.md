# JSONPlaceholder CRUD Application

A modern React application built with TypeScript, Vite, and Material-UI that demonstrates CRUD operations using the JSONPlaceholder API.

## Features

- View, create, update, and delete users and posts
- Responsive design with Material-UI
- Type-safe React components with TypeScript
- State management with React Query
- Form validation and error handling
- Clean and intuitive user interface

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Framework**: Material-UI (MUI)
- **State Management**: React Query
- **HTTP Client**: Axios
- **Routing**: React Router
- **Linting**: ESLint with TypeScript support

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Getting Started

1. **Clone the repository**
   ```bash
   git clone 
   cd client
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open in browser**
   The application will be available at [http://localhost:5173](http://localhost:5173)

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run lint` - Run ESLint to check for code quality issues
- `npm run preview` - Preview the production build locally

## Project Structure

```
src/
├── components/      # Reusable UI components
│   ├── common/     # Common components used across the app
│   ├── users/      # User-related components
│   └── posts/      # Post-related components
├── pages/          # Page components
├── services/       # API services and data fetching
├── types/          # TypeScript type definitions
├── hooks/          # Custom React hooks
├── utils/          # Utility functions
└── App.tsx         # Main application component
```

## API Integration

This application uses the [JSONPlaceholder](https://jsonplaceholder.typicode.com/) API for demonstration purposes. The API provides the following endpoints:

- **Users**: `https://jsonplaceholder.typicode.com/users`
- **Posts**: `https://jsonplaceholder.typicode.com/posts`

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
