import { APIGatewayProxyResult } from "aws-lambda";
import { lambda_handler, generateTokenAPIGatewayProxyEvent } from "./../handlers/generateToken";

// Mock the mongoose module and its connect function
jest.mock('mongoose', () => ({
  connect: jest.fn(),
  Schema: jest.fn(),
}));

describe("lambda_handler", () => {
  beforeAll(() => {
    // Mock the environment variable
    process.env.MONGODB_URI = "mongodb+srv://admin2:vybhdZVN9m@cluster0.gywv7oz.mongodb.net/tokenizacion_tarjetas";
  });

  it("Generate Token Successful Case", async () => {
    // Mock functions as needed
    const mockEvent: generateTokenAPIGatewayProxyEvent = {
      email: "rpenilla00@gmail.com",
      card_number: 5118420413040344,
      cvv: 123,
      expiration_year: "2025",
      expiration_month: "09",
      auth_header: "Bearer pk_test_12345",
    };

    // Import mongoose inside the test so that it uses the mocked version
    const mongoose = require('mongoose');

    const result: APIGatewayProxyResult = await lambda_handler(mockEvent);

    expect(result.statusCode).toBe(200);
    expect(result.body).toContain("Token Generated Successfully");
  });

  afterAll(() => {
    // Restore the original environment variable after testing
    delete process.env.MONGODB_URI;
  });
});