-- -----------------------------------------------------
-- Author: Aaliyah Long and Andy Li (Group 22)
-- Title: Creating tables and Sample Data for Furry Friends Pet Adoption
-- Date: July 24, 2025
-- Originality: All work is original
-- Description: This SQL DDL file defines the schema for managing pet adoptions at the Furry Friends Pet Adoption Center.
-- -----------------------------------------------------

-- Disable Foreign Key Checks 
SET FOREIGN_KEY_CHECKS = 0;
SET AUTOCOMMIT = 0;   

-- Drop all tables to prevent conflicts
DROP TABLE IF EXISTS Contacts;
DROP TABLE IF EXISTS PetRaces;
DROP TABLE IF EXISTS Pets;
DROP TABLE IF EXISTS Applications;
DROP TABLE IF EXISTS AppQuestions;
DROP TABLE IF EXISTS AppAnswers;

-- -----------------------------------------------------
-- Create tables
-- -----------------------------------------------------

-- Create Contacts Table
CREATE TABLE `Contacts` (
  `contactID` INT NOT NULL AUTO_INCREMENT,
  `firstName` VARCHAR(45) NOT NULL,
  `lastName` VARCHAR(45) NOT NULL,
  `phoneNumber` VARCHAR(45) NOT NULL,
  `streetAddress` VARCHAR(45) NULL,
  `city` VARCHAR(45) NULL,
  `zipCode` VARCHAR(45) NULL,
  PRIMARY KEY (`contactID`));

-- Create PetRaces Table
CREATE TABLE `PetRaces` (
  `petRaceID` INT NOT NULL AUTO_INCREMENT,
  `petRace` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`petRaceID`));

-- Create Pets Table
CREATE TABLE `Pets` (
  `petID` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  `age` INT NULL,
  `sex` VARCHAR(1) NULL,
  `weightLB` DECIMAL NULL,
  `adopted` TINYINT NULL DEFAULT 0,
  `note` VARCHAR(200) NULL,
  `imageURL` VARCHAR(2000) NULL,
  `petRaceID` INT NOT NULL,
  PRIMARY KEY (`petID`),
  CONSTRAINT `fk_Pets_Pet Types`
    FOREIGN KEY (`petRaceID`)
    REFERENCES `PetRaces` (`petRaceID`)
    ON DELETE CASCADE);

-- Create Applications Table
CREATE TABLE `Applications` (
  `applicationID` INT NOT NULL AUTO_INCREMENT,
  `approvalState` VARCHAR(100) NOT NULL DEFAULT 'under-review',
  `applicationDate` DATE NOT NULL,
  `note` VARCHAR(200) NULL,
  `contactID` INT NOT NULL,
  `petID` INT NOT NULL,
  PRIMARY KEY (`applicationID`),
  CONSTRAINT `fk_Application Questions_Contacts1`
    FOREIGN KEY (`contactID`)
    REFERENCES `Contacts` (`contactID`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_Application_Pets1`
    FOREIGN KEY (`petID`)
    REFERENCES `Pets` (`petID`)
    ON DELETE CASCADE);

-- Create AppQuestions Table
CREATE TABLE `AppQuestions` (
  `appQuestionID` INT NOT NULL AUTO_INCREMENT,
  `question` VARCHAR(250) NOT NULL,
  PRIMARY KEY (`appQuestionID`));

-- Create AppAnswers Table
CREATE TABLE `AppAnswers` (
  `appAnswerID` INT NOT NULL AUTO_INCREMENT,
  `answer` VARCHAR(250) NULL,
  `applicationID` INT NOT NULL,
  `appQuestionID` INT NOT NULL,
  PRIMARY KEY (`appAnswerID`),
  CONSTRAINT `fk_AppAnswers_Applications1`
    FOREIGN KEY (`applicationID`)
    REFERENCES `Applications` (`applicationID`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_AppAnswers_AppQuestions1`
    FOREIGN KEY (`appQuestionID`)
    REFERENCES `AppQuestions` (`appQuestionID`)
    ON DELETE CASCADE);

-- -----------------------------------------------------
-- Inserting Sample Data
-- -----------------------------------------------------

START TRANSACTION;
-- Insert all Contacts
INSERT INTO Contacts
(firstName, lastName, phoneNumber, streetAddress, city, zipCode) 
VALUES
('Ash','Ketchum','1112223333','Route 1','Pallet',10000),
('Brock','Harrison','1800555593','Route 2','Pewter',10001),
('Misty','Williams','4204204201','Route 3','Viridian',10002),
('Red','Caprison','3140003141','Route 42','Viridian',10003),
('Cynthia','Lane','6666666666','Route 999','Vermillion',10004);

-- Insert all PetRaces
INSERT INTO PetRaces
(petRace)
VALUES
('Cat'),
('Dog'),
('Rabbit');

-- Insert all Pets
INSERT INTO Pets
(name, age, sex, weightLB, adopted, note, imageURL, petRaceID) 
VALUES
('Pikachu',3,'M',3,1,'Likes to sleep at 3PM.','https://drive.google.com/file/d/1nHQb6Ks9iYbQLdj-gq-h7M2kUwup4muN/view?usp=drive_link',3),
('Onix', 10, 'F', 90, 1,'Not potty trained! Might reck the house!','https://drive.google.com/file/d/1dJKwY3_rjGfvkLtim6qhdpNPY0yGUIE1/view?usp=drive_link',2),
('Staryu', 2,'F', 6, 0,'Likes to be rocked gently and twirled around.','https://drive.google.com/file/d/1xKdNWZediFfE8XNltg8huQItJ6prSrO_/view?usp=drive_link',2),
('Charmander', 5,'M', 5, 0,'Likes oran berries.','https://drive.google.com/file/d/13ppSKxj6nsk8MYiJ8nINfIqFNXU7Tvgv/view?usp=drive_link',1),
('Garchomp', 999,'M', 9999, 0,'Need to sand down his claws every few weeks!','https://drive.google.com/file/d/1jZ6zdch74HN5SXBnyDSHKw4WyIqOFLNc/view?usp=drive_link',1);

-- Insert all Applications
INSERT INTO `Applications` 
(`approvalState`, `applicationDate`, `note`, `contactID`, `petID`) 
VALUES
('under-review', '2024-09-23', NULL, 2, 1),
('approved', '2024-10-12', 'Sounds like a great fit. Will have to get Charmander fixed first before release.', 1, 4),
('not approved', '2024-10-19', 'Not a good fit.', 5, 3),
('approved', '2024-10-23', 'Yay', 3, 3),
('under-review', '2024-09-23', 'Yay', 4, 5);

-- Insert all AppQuestions
INSERT INTO `AppQuestions` 
(`question`) 
VALUES
('What pet are you trying to adopt?'),
('What is your living situation? Apartment/house?'),
('If you are trying to adopt a dog, do you have a yard?'),
('If you are trying to adopt a cat, will it be an outdoor or indoor cat?'),
('What is the living environment? Busy, loud, quiet, relaxing?'),
('Do you own any pets already?'),
('If you currently own any pets, how many are there, what types are they, and what is their behavior towards other animals?'),
('What is your reasoning for wanting to adopt this pet?'),
('Are there any other things you would like us to know?');

-- Insert all AppAnswers
INSERT INTO `AppAnswers` 
(`answer`, `applicationID`, `appQuestionID`) 
VALUES
('No', 1, 6),
('Pikachu', 1, 1),
('We want to get another cat for our cat, Milo, so she isn\'t lonely.', 2, 8),
('We think we would be a great fit for Staryu because we are a very loving family.', 3, 9),
('THE GREAT OUTDOORS CAT', 5, 4);

-- Re-enable Foreign Key Checks
SET FOREIGN_KEY_CHECKS = 1;
SET AUTOCOMMIT = 1;
COMMIT;
