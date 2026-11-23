-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 23, 2026 at 11:00 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `kniznica_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `knihy`
--

CREATE TABLE `knihy` (
  `id` int(11) NOT NULL,
  `nazov` varchar(180) DEFAULT NULL,
  `autor` varchar(120) DEFAULT NULL,
  `rok` int(11) NOT NULL,
  `cena` decimal(10,2) NOT NULL DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `knihy`
--

INSERT INTO `knihy` (`id`, `nazov`, `autor`, `rok`, `cena`) VALUES
(1, 'Dula', 'Elina', 2028, 89.99),
(2, 'Kolobok', 'SSSR', 1999, 1.00),
(3, 'Lokomotiv', 'poliakova', 2019, 0.01),
(4, 'Paladij', 'Lakusta', 1029, 190.23);

-- --------------------------------------------------------

--
-- Table structure for table `pouzivatelia`
--

CREATE TABLE `pouzivatelia` (
  `id` int(11) NOT NULL,
  `meno` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `heslo_hash` varchar(255) NOT NULL,
  `vytvoreny` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pouzivatelia`
--

INSERT INTO `pouzivatelia` (`id`, `meno`, `email`, `heslo_hash`, `vytvoreny`) VALUES
(1, 'Dmytro', 'oureska@gmail.com', '$2b$10$2x6Rm9Tn3.GVGYhk/hjEjuB68PM6ShGe5nA/.Cj9crzrFFvJ3zNEW', '2026-11-23 09:29:04'),
(2, 'Elinka', 'Elinka228666@gmail.com', '$2b$10$7UsthkPnzTtsWm.eXP2gqeiW.yPqjHSFK.2WU5efvaKxrihpZh5He', '2026-11-23 09:29:45'),
(3, 'Lakusta', 'Lakusta@gmail.com', '$2b$10$AyOs6xJ6.cAjZA.ZKP2/yumzI0wcogbpTbuKnWxm7ey7CQd1nkkqy', '2026-11-23 09:30:02'),
(4, 'Sierikov', 'xsierikov@stuba.sk', '$2b$10$P.z4SPw8y/CUgp5zvhzfgOH9d5kAbFMcNaOTwAd9kHbIz3ZGHLxbu', '2026-11-23 09:30:30');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `knihy`
--
ALTER TABLE `knihy`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pouzivatelia`
--
ALTER TABLE `pouzivatelia`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `knihy`
--
ALTER TABLE `knihy`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `pouzivatelia`
--
ALTER TABLE `pouzivatelia`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
