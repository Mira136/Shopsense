CREATE DATABASE IF NOT EXISTS shopsense;
USE shopsense;
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(100), email VARCHAR(150) UNIQUE, password VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS products (
  id INT PRIMARY KEY AUTO_INCREMENT, name VARCHAR(200), description TEXT, price DECIMAL(10,2), category VARCHAR(100),
  image VARCHAR(500), rating DECIMAL(2,1), stock INT, tags VARCHAR(500), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS orders (
  id INT PRIMARY KEY AUTO_INCREMENT, user_id INT, total_amount DECIMAL(10,2), address TEXT, status VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id));
CREATE TABLE IF NOT EXISTS order_items (
  id INT PRIMARY KEY AUTO_INCREMENT, order_id INT, product_id INT, quantity INT, price DECIMAL(10,2),
  FOREIGN KEY (order_id) REFERENCES orders(id), FOREIGN KEY (product_id) REFERENCES products(id));
CREATE TABLE IF NOT EXISTS wishlist (
  id INT PRIMARY KEY AUTO_INCREMENT, user_id INT, product_id INT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_wish (user_id, product_id), FOREIGN KEY (user_id) REFERENCES users(id), FOREIGN KEY (product_id) REFERENCES products(id));
CREATE TABLE IF NOT EXISTS price_guard (
  id INT PRIMARY KEY AUTO_INCREMENT, user_id INT, product_id INT, saved_price DECIMAL(10,2), current_price DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_guard (user_id, product_id), FOREIGN KEY (user_id) REFERENCES users(id), FOREIGN KEY (product_id) REFERENCES products(id));
