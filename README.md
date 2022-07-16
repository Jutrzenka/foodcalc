# LINK DO WERSJI DEMO:
Niestety na networkmanager nie działał DirectAdmin i nie byłem w stanie uploudować aplikacji.
## Struktura bazy danych:
![image](https://user-images.githubusercontent.com/93550588/179328724-646566ce-5de5-473b-abee-1970869ead20.png)
### mega-food-app.sql
```
-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Czas generowania: 16 Lip 2022, 03:08
-- Wersja serwera: 10.4.22-MariaDB
-- Wersja PHP: 8.0.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Baza danych: `mega-food-app`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `product`
--

CREATE TABLE `product` (
  `id` varchar(24) NOT NULL,
  `userId` varchar(36) NOT NULL,
  `name` varchar(64) NOT NULL,
  `energy` smallint(8) UNSIGNED DEFAULT NULL,
  `carbohydrates` smallint(3) UNSIGNED DEFAULT NULL,
  `fat` smallint(3) UNSIGNED DEFAULT NULL,
  `protein` smallint(3) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `product_recipe`
--

CREATE TABLE `product_recipe` (
  `id` varchar(24) NOT NULL,
  `userId` varchar(36) NOT NULL,
  `productId` varchar(24) NOT NULL,
  `recipeId` varchar(24) NOT NULL,
  `amount` int(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `recipe`
--

CREATE TABLE `recipe` (
  `id` varchar(24) NOT NULL,
  `userId` varchar(36) NOT NULL,
  `name` varchar(64) NOT NULL,
  `description` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `token`
--

CREATE TABLE `token` (
  `id` varchar(24) NOT NULL,
  `userId` varchar(36) NOT NULL,
  `actuallyCode` varchar(36) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `user`
--

CREATE TABLE `user` (
  `id` varchar(36) NOT NULL,
  `name` varchar(26) NOT NULL,
  `email` varchar(64) NOT NULL,
  `login` varchar(30) NOT NULL,
  `password` varchar(60) DEFAULT NULL,
  `role` varchar(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `product_id_uindex` (`id`),
  ADD KEY `product_user_id_fk` (`userId`);

--
-- Indeksy dla tabeli `product_recipe`
--
ALTER TABLE `product_recipe`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_recipe_user_id_fk` (`userId`),
  ADD KEY `product_recipe_product_id_fk` (`productId`),
  ADD KEY `product_recipe_recipe_id_fk` (`recipeId`);

--
-- Indeksy dla tabeli `recipe`
--
ALTER TABLE `recipe`
  ADD PRIMARY KEY (`id`),
  ADD KEY `recipe_user_id_fk` (`userId`);

--
-- Indeksy dla tabeli `token`
--
ALTER TABLE `token`
  ADD UNIQUE KEY `token_actuallyCode_uindex` (`actuallyCode`),
  ADD KEY `token_user_id_fk` (`userId`);

--
-- Indeksy dla tabeli `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_email_uindex` (`email`),
  ADD UNIQUE KEY `user_login_uindex` (`login`),
  ADD UNIQUE KEY `user_id_uindex` (`id`);

--
-- Ograniczenia dla zrzutów tabel
--

--
-- Ograniczenia dla tabeli `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `product_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Ograniczenia dla tabeli `product_recipe`
--
ALTER TABLE `product_recipe`
  ADD CONSTRAINT `product_recipe_product_id_fk` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `product_recipe_recipe_id_fk` FOREIGN KEY (`recipeId`) REFERENCES `recipe` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `product_recipe_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ograniczenia dla tabeli `recipe`
--
ALTER TABLE `recipe`
  ADD CONSTRAINT `recipe_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Ograniczenia dla tabeli `token`
--
ALTER TABLE `token`
  ADD CONSTRAINT `token_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
```
