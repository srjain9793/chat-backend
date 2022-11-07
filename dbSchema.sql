/*
SQLyog Community v12.4.3 (64 bit)
MySQL - 8.0.22 : Database - uc_chatdb
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`uc_chatdb` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `uc_chatdb`;

/*Table structure for table `chat_group_members` */

DROP TABLE IF EXISTS `chat_group_members`;

CREATE TABLE `chat_group_members` (
  `id` int NOT NULL AUTO_INCREMENT,
  `group_id` int DEFAULT NULL,
  `member_id` int DEFAULT NULL,
  `is_member` tinyint(1) DEFAULT NULL,
  `is_admin` tinyint DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `group_id` (`group_id`),
  KEY `member_id` (`member_id`),
  CONSTRAINT `chat_group_members_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `chat_groups` (`grp_id`),
  CONSTRAINT `chat_group_members_ibfk_2` FOREIGN KEY (`member_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Table structure for table `chat_groups` */

DROP TABLE IF EXISTS `chat_groups`;

CREATE TABLE `chat_groups` (
  `grp_id` int NOT NULL AUTO_INCREMENT,
  `grp_name` varchar(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `grp_create_date` datetime DEFAULT CURRENT_TIMESTAMP,
  `grp_createdby` int NOT NULL,
  `grp_isactive` tinyint DEFAULT '1',
  PRIMARY KEY (`grp_id`),
  KEY `grp_createdby` (`grp_createdby`),
  CONSTRAINT `chat_groups_ibfk_1` FOREIGN KEY (`grp_createdby`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Table structure for table `chat_msgs` */

DROP TABLE IF EXISTS `chat_msgs`;

CREATE TABLE `chat_msgs` (
  `msg_id` int NOT NULL AUTO_INCREMENT,
  `group_id` int DEFAULT NULL,
  `msg_text` varchar(300) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`msg_id`),
  KEY `group_id` (`group_id`),
  CONSTRAINT `chat_msgs_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `chat_groups` (`grp_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(60) DEFAULT NULL,
  `email` varchar(60) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
