-- Database initialization script for Smart Medicine Refill System
-- This script creates the database schema and inserts sample data

-- Use the medicine_refill_db database
USE medicine_refill_db;

-- Create users table (will be created automatically by JPA, this is for reference)
-- CREATE TABLE IF NOT EXISTS users (
--     id BIGINT AUTO_INCREMENT PRIMARY KEY,
--     name VARCHAR(50) NOT NULL,
--     email VARCHAR(50) NOT NULL UNIQUE,
--     password VARCHAR(120) NOT NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--     email_notifications_enabled BOOLEAN DEFAULT TRUE
-- );

-- Create medicines table (will be created automatically by JPA, this is for reference)
-- CREATE TABLE IF NOT EXISTS medicines (
--     id BIGINT AUTO_INCREMENT PRIMARY KEY,
--     medicine_name VARCHAR(255) NOT NULL,
--     dosage_per_day INTEGER NOT NULL,
--     total_quantity INTEGER NOT NULL,
--     start_date DATE NOT NULL,
--     refill_date DATE,
--     current_quantity INTEGER,
--     notifications_enabled BOOLEAN DEFAULT TRUE,
--     low_stock_threshold INTEGER DEFAULT 5,
--     status VARCHAR(20) DEFAULT 'OK',
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--     user_id BIGINT NOT NULL,
--     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
-- );

-- Sample Data (Optional - will be created through the application)
-- Note: Passwords are BCrypt hashed for "password123"

-- INSERT INTO users (name, email, password, email_notifications_enabled) VALUES
-- ('John Doe', 'john.doe@example.com', '$2a$10$8ZhYjQGi9.gIkqq5gLNhKekGMa6VZr5q3TjzQ8K8cGN4VExBqHKbC', TRUE),
-- ('Jane Smith', 'jane.smith@example.com', '$2a$10$8ZhYjQGi9.gIkqq5gLNhKekGMa6VZr5q3TjzQ8K8cGN4VExBqHKbC', TRUE),
-- ('Bob Johnson', 'bob.johnson@example.com', '$2a$10$8ZhYjQGi9.gIkqq5gLNhKekGMa6VZr5q3TjzQ8K8cGN4VExBqHKbC', FALSE);

-- Sample medicines for John Doe (user_id = 1)
-- INSERT INTO medicines (medicine_name, dosage_per_day, total_quantity, start_date, current_quantity, user_id, notifications_enabled, low_stock_threshold) VALUES
-- ('Aspirin 81mg', 1, 30, '2024-12-01', 15, 1, TRUE, 5),
-- ('Metformin 500mg', 2, 60, '2024-11-15', 20, 1, TRUE, 7),
-- ('Lisinopril 10mg', 1, 30, '2024-12-05', 25, 1, TRUE, 5);

-- Sample medicines for Jane Smith (user_id = 2)
-- INSERT INTO medicines (medicine_name, dosage_per_day, total_quantity, start_date, current_quantity, user_id, notifications_enabled, low_stock_threshold) VALUES
-- ('Vitamin D3 1000IU', 1, 60, '2024-11-20', 40, 2, TRUE, 10),
-- ('Omega-3 Fish Oil', 1, 30, '2024-12-01', 5, 2, TRUE, 5),
-- ('Calcium Carbonate', 2, 100, '2024-11-10', 80, 2, TRUE, 15);

-- Create indexes for better performance
-- CREATE INDEX IF NOT EXISTS idx_medicines_user_id ON medicines(user_id);
-- CREATE INDEX IF NOT EXISTS idx_medicines_status ON medicines(status);
-- CREATE INDEX IF NOT EXISTS idx_medicines_refill_date ON medicines(refill_date);
-- CREATE INDEX IF NOT EXISTS idx_medicines_notifications ON medicines(notifications_enabled);
-- CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Create view for medicines with calculated fields (optional)
-- CREATE VIEW IF NOT EXISTS medicine_summary AS
-- SELECT 
--     m.id,
--     m.medicine_name,
--     m.dosage_per_day,
--     m.total_quantity,
--     m.current_quantity,
--     m.refill_date,
--     m.status,
--     u.name as user_name,
--     u.email as user_email,
--     DATEDIFF(m.refill_date, CURDATE()) as days_left,
--     ROUND((m.current_quantity / m.total_quantity) * 100, 2) as stock_percentage
-- FROM medicines m
-- JOIN users u ON m.user_id = u.id;

-- Performance optimization settings
-- SET GLOBAL innodb_buffer_pool_size = 268435456; -- 256MB
-- SET GLOBAL max_connections = 200;

-- Grant permissions to the medicine_user
GRANT SELECT, INSERT, UPDATE, DELETE ON medicine_refill_db.* TO 'medicine_user'@'%';
FLUSH PRIVILEGES;

-- Display completion message
SELECT 'Database initialization completed successfully!' as message;