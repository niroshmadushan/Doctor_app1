-- =============================================================================
-- MySQL Database DDL Schema for Customer Request Managemnt Potal (Order Management & E-Commerce)
-- Target Database: doctordb
-- =============================================================================

CREATE DATABASE IF NOT EXISTS `doctordb` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `doctordb`;

-- 1. Customers Table
CREATE TABLE IF NOT EXISTS `customers` (
    `id` VARCHAR(50) PRIMARY KEY,
    `name` VARCHAR(150) NOT NULL,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `shipping_address` TEXT NOT NULL,
    `total_spent` DECIMAL(12, 2) DEFAULT 0.00,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Products Catalog & Inventory Table
CREATE TABLE IF NOT EXISTS `products` (
    `id` VARCHAR(50) PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `category` VARCHAR(100) NOT NULL,
    `unit_price` DECIMAL(10, 2) NOT NULL,
    `stock_quantity` INT NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_product_category` (`category`)
) ENGINE=InnoDB;

-- 3. Orders Table
CREATE TABLE IF NOT EXISTS `orders` (
    `id` VARCHAR(50) PRIMARY KEY,
    `customer_name` VARCHAR(150) NOT NULL,
    `customer_email` VARCHAR(255) NOT NULL,
    `total_amount` DECIMAL(12, 2) NOT NULL,
    `priority` ENUM('Low', 'Medium', 'High') DEFAULT 'Medium',
    `status` ENUM('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled') DEFAULT 'Pending',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_order_status` (`status`)
) ENGINE=InnoDB;

-- Seed Initial Demo Data
INSERT INTO `products` (`id`, `name`, `category`, `unit_price`, `stock_quantity`) VALUES
('PROD-01', 'Enterprise Server Node 4U', 'Hardware', 850.00, 14),
('PROD-02', 'High-Speed NVMe Storage 2TB', 'Storage', 240.00, 42),
('PROD-03', 'Managed Switch 48-Port PoE', 'Networking', 490.00, 28)
ON DUPLICATE KEY UPDATE `unit_price`=VALUES(`unit_price`);

INSERT INTO `orders` (`id`, `customer_name`, `customer_email`, `total_amount`, `priority`, `status`) VALUES
('ORD-1001', 'Acme Cloud Systems', 'procurement@acme.com', 1940.00, 'High', 'Pending'),
('ORD-1002', 'Vanguard Analytics', 'tech@vanguard.io', 730.00, 'Medium', 'Processing'),
('ORD-1003', 'Aura Retail Partners', 'orders@aura.com', 2450.00, 'Medium', 'Delivered')
ON DUPLICATE KEY UPDATE `status`=VALUES(`status`);
