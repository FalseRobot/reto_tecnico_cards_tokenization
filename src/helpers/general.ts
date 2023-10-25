import { APIGatewayProxyResult } from "aws-lambda";

export const sendSuccessfulResponse = (
  message: string
): APIGatewayProxyResult => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: `${message}` }),
  };
};

export const sendInternalServerErrorResponse = (
  message: string
): APIGatewayProxyResult => {
  return {
    statusCode: 500,
    body: JSON.stringify({ message: `${message}` }),
  };
};

export const sendForbiddenErrorResponse = (
  message: string
): APIGatewayProxyResult => {
  return {
    statusCode: 403,
    body: JSON.stringify({ message: `${message}` }),
  };
};

export const sendNotFoundErrorResponse = (
  message: string
): APIGatewayProxyResult => {
  return {
    statusCode: 404,
    body: JSON.stringify({ message: `${message}` }),
  };
};

export const sendBadRequestResponse = (
  message: string
): APIGatewayProxyResult => {
  return {
    statusCode: 400,
    body: JSON.stringify({ message: `Invalid Request Body. ${message}` }),
  };
};