
import { APIGatewayProxyResult } from "aws-lambda";
import {
  sendInternalServerErrorResponse,
  sendBadRequestResponse,
  sendForbiddenErrorResponse,
  sendNotFoundErrorResponse
} from "./../helpers/general";
import Consumer from "./../models/Consumer";
import { Document, Schema, Model, model } from 'mongoose';

export type getCardAPIGatewayProxyEvent = {
  token: string;
  auth_header: string
};

export const lambda_handler = async (
  event: getCardAPIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log("Event: ", event);
  try {
    const { token, auth_header } = event;

    if(!isValidToken(token)){
        return sendBadRequestResponse('Invalid Token!')
    }
    console.log("Token OK");

    const [, pk] = auth_header.split(' ')

    const authValidation = await isAuthHeaderValid(pk)
    if(!authValidation) {
      console.log("Invalid Auth Header");
      return sendForbiddenErrorResponse(
        'PK Invalido! Comercio No Permitido'
      );
    }
    console.log("Auth Header OK");

    const findResult = await getCardDetails(token)
    if(findResult === null) {
        return sendNotFoundErrorResponse('Token not found.')
    }
      
    return {
        statusCode: 200,
        body: JSON.stringify({ result: findResult }),
      };
  } catch (error) {
    console.error("Error:", error);
    return sendInternalServerErrorResponse("Internal Server Error");
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

const isValidToken = (token: string): boolean => {
  const validCharacters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return token.length === 16 && [...token].every(char => validCharacters.includes(char));
};

interface ICard {
    card_number: string;
    expiration_month: string;
    expiration_year: string;
    email: string;
    token: string;
  }
  
  interface ICardModel extends ICard, Document {}
  
  const Card: Model<ICardModel> = model('Card', new Schema<ICardModel>({
    card_number: String,
    expiration_month: String,
    expiration_year: String,
    email: String,
    token: String,
  }));

const getCardDetails = async (token: string):Promise<ICard | null> => {
    try {
      const card = await Card.findOne({ token: token }).select('card_number expiration_month expiration_year email token').exec();
      if (card) {
        console.log('Card found! ', card);
        return card;
      } else {
        console.log('Card not found by token:', token);
        return null;
      }
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  };