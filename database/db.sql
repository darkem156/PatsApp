-- Creating database
CREATE DATABASE pitter;

-- Using database
USE pitter;

-- Create users
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `user_name` varchar(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_name` (`user_name`)
);

-- Create private
CREATE TABLE `private` 
(
  `id` bigint unsigned NOT NULL,
  `user_name` varchar(20) NOT NULL,
  `password` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
);

-- Create sockets
CREATE TABLE `sockets`
(
    `user_name` varchar(20) NOT NULL,
    `socket` varchar(20) NOT NULL
);

-- Create pending_messages
CREATE TABLE `pending_messages`
(
    `sender` varchar(20) NOT NULL,
    `sender_name` varchar(50) NOT NULL,
    `msgText` varchar(1800) NOT NULL,
    `msgDate` varchar(60) NOT NULL,
    `receiver` varchar(20) NOT NULL,
    `receiver_name` varchar(50) NOT NULL
);

ALTER TABLE pending_messages CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;