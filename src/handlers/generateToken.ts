
import { APIGatewayProxyResult } from "aws-lambda";
import {
  sendSuccessfulResponse,
  sendInternalServerErrorResponse,
  sendBadRequestResponse,
  sendForbiddenErrorResponse
} from "./../helpers/general";
import { isLuhnValid, cleanProposed } from "./../helpers/luhn";
import Consumer from "./../models/Consumer";
import Card from "./../models/Card";


export type generateTokenAPIGatewayProxyEvent = {
  card_number: number;
  cvv: number;
  expiration_month: string;
  expiration_year: string;
  email: string;
  auth_header: string
};

export const lambda_handler = async (
  event: generateTokenAPIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log("Event: ", event);
  try {
    const { email, card_number, cvv, expiration_year, expiration_month, auth_header } =
      event;
    const [, pk] = auth_header.split(' ')
    const authValidation = await isAuthHeaderValid(pk)
    if(!authValidation) {
      console.log("Invalid Auth Header");
      return sendForbiddenErrorResponse(
        'PK Invalido! Comercio No Permitido'
      );
    }
    console.log("Auth Header OK");

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

    if (!insertResult.wasAdded) {
      return sendInternalServerErrorResponse("Failed to insert into Database");
    }
      
    return sendSuccessfulResponse(`Token Generated Successfully! Your token is ${insertResult.token}`);
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

const generateRandomValue = (length) => {
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let randomValue = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomValue += characters.charAt(randomIndex);
  }

  return randomValue;
}

type InsertResult = {
  wasAdded: boolean;
  token: string;
};

const addCardToDatabase = async (
  card_number: number,
  cvv: number,
  expiration_month: string,
  expiration_year: string,
  email: string
): Promise<InsertResult> => {
  let wasAdded = false
  let token = ''
  try {
    const createdAt = new Date()
    token = generateRandomValue(16)
    // Create a new card document
    const newCard = new Card({
      card_number: card_number.toString(),
      cvv: cvv.toString(),
      expiration_month,
      expiration_year,
      email,
      createdAt,
      token
    });

    console.log('new card: ', newCard)
    // Save the new card to the database
    await newCard.save();
    wasAdded = true

    return {
      wasAdded,
      token,
    };
  } catch (error) {
    // If there's an error, return false
    console.error("Error adding card to the database:", error);
    return {
      wasAdded,
      token: '',
    };
  }
};

const isAuthHeaderValid = async (authHeader: string):Promise<boolean> => {
  try {
    console.log('to check', authHeader)
    const consumer = await Consumer.findOne({ pk: authHeader}).exec();
    if (consumer) {
      console.log('Consumer found!', consumer);
      return true;
    } else {
      console.log('Consumer not found for pk:', authHeader);
      return false;
    }
  } catch (error) {
    console.error("Error:", error);
    return false
  }
};