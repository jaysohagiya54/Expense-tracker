-- Database creation is handled by the connection config
-- CREATE DATABASE IF NOT EXISTS expense_tracker;
-- USE expense_tracker;

CREATE TABLE IF NOT EXISTS Users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'active'
);

CREATE TABLE IF NOT EXISTS Categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS Expenses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  category_id INT,
  amount DECIMAL(10,2) NOT NULL,
  date DATE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE SET NULL,
  FOREIGN KEY (category_id) REFERENCES Categories(id) ON DELETE SET NULL
);

-- Insert Sample Data
INSERT INTO Users (name, email) VALUES 
('John Doe', 'john@example.com'),
('Jane Smith', 'jane@example.com')
ON DUPLICATE KEY UPDATE email=email;

INSERT INTO Categories (name) VALUES 
('Food'), ('Transport'), ('Entertainment'), ('Utilities'), ('Shopping'), ('Health')
ON DUPLICATE KEY UPDATE name=name;

-- Dummy Expenses for John Doe (User 1)
INSERT INTO Expenses (user_id, category_id, amount, date, description) VALUES 
-- Current Month
(1, 1, 15.50, CURDATE(), 'Lunch'),
(1, 2, 20.00, CURDATE(), 'Uber'),
(1, 1, 45.00, DATE_SUB(CURDATE(), INTERVAL 1 DAY), 'Dinner'),
(1, 3, 120.00, DATE_SUB(CURDATE(), INTERVAL 2 DAY), 'Concert tickets'),
(1, 4, 80.00, DATE_SUB(CURDATE(), INTERVAL 5 DAY), 'Electricity Bill'),

-- Previous Month
(1, 1, 30.00, DATE_SUB(CURDATE(), INTERVAL 1 MONTH), 'Groceries'),
(1, 5, 150.00, DATE_SUB(CURDATE(), INTERVAL 1 MONTH), 'New Shoes'),
(1, 2, 25.00, DATE_SUB(CURDATE(), INTERVAL 1 MONTH), 'Taxi'),

-- 2 Months Ago
(1, 1, 60.00, DATE_SUB(CURDATE(), INTERVAL 2 MONTH), 'Fancy Dinner'),
(1, 6, 200.00, DATE_SUB(CURDATE(), INTERVAL 2 MONTH), 'Dentist'),

-- 3 Months Ago
(1, 1, 40.00, DATE_SUB(CURDATE(), INTERVAL 3 MONTH), 'Lunch'),
(1, 3, 50.00, DATE_SUB(CURDATE(), INTERVAL 3 MONTH), 'Movies');

