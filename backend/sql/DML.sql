-- -----------------------------------------------------
-- Author: Aaliyah Long and Andy Li (Group 22)
-- Title: Stored Procedures for Furry Friends Pet Adoption
-- Date: July 31, 2025
-- Originality: All work is original
-- Description: This SQL DML file defines the stored procedures for managing pet adoptions at the Furry Friends Pet Adoption Center.
-- -----------------------------------------------------

-- -------------------------------
-- SELECTS
-- -------------------------------

-- Select all atributes from the Contacts table
SELECT contactID, firstName, lastName, phoneNumber, streetAddress, city, zipCode 
FROM Contacts;

-- Select all atributes from the PetRaces table
SELECT petRaceID, petRace
FROM PetRaces;

-- Select all atributes from the Pets table
SELECT petID, name, age, sex, weightLB, adopted, note, imageURL, petRaceID
FROM Pets;

-- Select all atributes from the Applications table
SELECT applicationID, approvalState, applicationDate, note, contactID, petID 
FROM Applications;

-- Select all atributes from the AppQuestions table
SELECT appQuestionID, question
FROM AppQuestions;

-- Select all atributes from AppAnswers table
SELECT appAnswerID, answer, applicationID, appQuestionID
FROM AppAnswers;

-- -------------------------------
-- INSERT
-- -------------------------------

-- Insert a new application in the Applications table
INSERT INTO Applications (approvalState, applicationDate, note, contactID, petID)
VALUES (@newApprovalState, @newApplicationDate, @newNote, @newContactID, @newPetID);

-- -------------------------------
-- UPDATE
-- -------------------------------

-- Update an application in the Applications table by ID
UPDATE Applications
SET 
approvalState = @newApprovalState,
applicationDate = @newApplicationDate,
note = @newNote,
contactID = @newContactID,
petID = @newPetID
WHERE ApplicationID = @appID;

-- -------------------------------
-- DELETE
-- -------------------------------

-- Delete an application in the Applications table by ID
DELETE FROM Applications
WHERE ApplicationID = @appID;
