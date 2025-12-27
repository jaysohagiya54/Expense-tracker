# Expense Tracker

A full-stack application for tracking expenses, featuring a React frontend and a Node.js/Express backend with MySQL.

## Project Structure

- `backend/`: Node.js + Express API with MySQL database.
- `frontend/`: React + Vite + Tailwind CSS dashboard.

## Prerequisites

- Node.js (v18 or higher)
- MySQL Server
- npm or yarn

## Getting Started

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Expense-tracker
```

### 2. Backend Setup

1.  **Install Dependencies**
    ```bash
    cd backend
    npm install
    ```

2.  **Environment Variables**
    Create a `.env` file in the `backend/` directory:
    ```env
    PORT=5000
    DB_HOST=localhost
    DB_PORT=3306
    DB_USER=your_username
    DB_PASSWORD=your_password
    DB_NAME=expense_tracker
    ```

3.  **Database Initialization**
    - Ensure your MySQL server is running.
    - Run the seed script to create the database schema and insert sample data:
      ```bash
      npm run seed
      ```

4.  **Start Backend**
    ```bash
    npm run dev
    ```
    The server will run on `http://localhost:5000`.

### 3. Frontend Setup

1.  **Install Dependencies**
    ```bash
    cd ../frontend
    npm install
    ```

2.  **Environment Variables**
    Create a `.env` file in the `frontend/` directory:
    ```env
    VITE_API_BASE_URL=http://localhost:5000/api
    ```

3.  **Start Frontend**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or the port shown in your terminal).

## Features

- **Expense Management**: Add, edit, delete, and filter expenses.
- **Statistics Dashboard**: View spending trends, top spending days, and MoM growth.
- **Predictions**: Get AI-driven expense predictions for the next month based on historical data.
- **Data Validation**: Robust backend validation using Zod.
- **Responsive Design**: Modern, mobile-friendly UI with Dark Mode support.

## Scripts

### Backend
- `npm run dev`: Start development server with nodemon.
- `npm run seed`: Initialize database schema and seed data.
- `npm start`: Start production server.

### Frontend
- `npm run dev`: Start Vite development server.
- `npm run build`: Build for production.
- `npm run preview`: Preview production build locally.
