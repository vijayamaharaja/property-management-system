# Property Management System - Web UI

A modern web interface for the Property Management System built with React, Redux, and Tailwind CSS.

## Features

- **Authentication**
  - User registration and login
  - JWT-based authentication
  - Protected routes
  - Persistent sessions

- **Property Management**
  - Property listing with search and filters
  - Property details view
  - Property creation and editing
  - Image upload support

- **User Dashboard**
  - Overview of user's properties
  - Property statistics
  - Quick actions for property management

## Tech Stack

- **Frontend Framework**: React 18
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form
- **Validation**: Yup

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── properties/     # Property-related components
│   └── common/         # Shared components
├── pages/              # Page components
├── store/              # Redux store configuration
│   └── slices/         # Redux slices
├── services/           # API services
├── utils/              # Utility functions
└── App.js              # Main application component
```

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/property-management-system.git
   cd property-management-webui
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```
   REACT_APP_API_URL=http://localhost:8080/api
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
