
import { APIGatewayProxyResult } from "aws-lambda";
import {
  sendSuccessfulResponse,
  sendInternalServerErrorResponse,
  sendBadRequestResponse,
} from "./../helpers/general";
import { isLuhnValid, cleanProposed } from "./../helpers/luhn";
import Card from "./../models/Card";

export type generateTokenAPIGatewayProxyEvent = {
  card_number: number;
  cvv: number;
  expiration_month: string;
  expiration_year: string;
  email: string;
};

export const lambda_handler = async (
  event: generateTokenAPIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log("Event: ", event);
  try {
    const { email, card_number, cvv, expiration_year, expiration_month } =
      event;

    const validationResult = isValidCreditCard(
      card_number,
      cvv,
      expiration_month,
      expiration_year,
      email
    );

    if (!validationResult.isValid) {
      console.log("Card Validation ERROR", validationResult.reason);
      return sendBadRequestResponse(
        `Invalid Credit Card! ${validationResult.reason}`
      );
    }

    console.log("Card Validation OK");

    const insertResult = await addCardToDatabase(
      card_number,
      cvv,
      expiration_month,
      expiration_year,
      email
    );

    if (!insertResult)
      return sendInternalServerErrorResponse("Failed to insert into Database");
    return sendSuccessfulResponse("Token Generated Successfully!");
  } catch (error) {
    console.error("Error:", error);
    return sendInternalServerErrorResponse("Internal Server Error");
  }
};

type ValidationResult = {
  isValid: boolean;
  reason: string;
};

const isValidCreditCard = (
  card_number: number,
  cvv: number,
  expiration_month: string,
  expiration_year: string,
  email: string
): ValidationResult => {
  let isValid = true;
  let reason = "";

  const cardNumberStr = card_number.toString();
  if (cardNumberStr.length < 13 || cardNumberStr.length > 16) {
    isValid = false;
    reason = "Invalid card number length";
  } else if (!isValidLuhn(cardNumberStr)) {
    isValid = false;
    reason = "Invalid card number (Luhn algorithm)";
  } else if (cvv < 100 || cvv > 9999) {
    isValid = false;
    reason = "Invalid CVV";
  } else if (expiration_month.length < 1 || expiration_month.length > 2) {
    isValid = false;
    reason = "Invalid expiration month length";
  } else {
    const month = parseInt(expiration_month, 10);
    if (month < 1 || month > 12) {
      isValid = false;
      reason = "Invalid expiration month";
    } else if (expiration_year.length !== 4) {
      isValid = false;
      reason = "Invalid expiration year length";
    } else {
      const currentYear = new Date().getFullYear();
      const year = parseInt(expiration_year, 10);
      if (year < currentYear || year > currentYear + 5) {
        isValid = false;
        reason = "Invalid expiration year";
      } else {
        if (!isValidEmail(email)) {
          isValid = false;
          reason = "Invalid email";
        }
      }
    }
  }
  console.log("Finished Card Validation");
  return {
    isValid,
    reason,
  };
};

const isValidLuhn = (cardNumber: string): boolean => {
  const cleanCreditCardNumber = cleanProposed(cardNumber);
  return isLuhnValid(cleanCreditCardNumber);
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  if (!emailRegex.test(email)) {
    return false; // Email format is invalid
  }

  return email.length >= 5 && email.length <= 100;
};

const addCardToDatabase = async (
  card_number: number,
  cvv: number,
  expiration_month: string,
  expiration_year: string,
  email: string
): Promise<boolean> => {
  try {
    const createdAt = new Date()
    // Create a new card document
    const newCard = new Card({
      card_number: card_number.toString(),
      cvv: cvv.toString(),
      expiration_month: expiration_month,
      expiration_year: expiration_year,
      email: email,
      createdAt: createdAt
    });

    console.log('new card: ', newCard)
    // Save the new card to the database
    await newCard.save();

    // If the card was successfully saved, return true
    return true;
  } catch (error) {
    // If there's an error, return false
    console.error("Error adding card to the database:", error);
    return false;
  }
};
