-- Migration: Add payment_date column to orders table
-- Purpose: Track when payment was made
-- Run this if your orders table already exists

-- Add payment_date column if not exists
IF NOT EXISTS(SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'orders' AND COLUMN_NAME = 'payment_date')
BEGIN
    ALTER TABLE orders
    ADD payment_date DATETIMEOFFSET;
    
    PRINT 'Column payment_date added successfully to orders table';
END
ELSE
BEGIN
    PRINT 'Column payment_date already exists in orders table';
END
GO
