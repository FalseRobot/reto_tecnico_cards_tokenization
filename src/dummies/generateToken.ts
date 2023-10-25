import {
  lambda_handler,
  generateTokenAPIGatewayProxyEvent,
} from "../handlers/generateToken";

const body: generateTokenAPIGatewayProxyEvent = {
  email: "rpenilla00@gmail.com",
  card_number: 5118420413040344,
  cvv: 123,
  expiration_year: "2025",
  expiration_month: "09",
  auth_header: "Bearer pk_test_12345"
};

console.log(">>> Starting lambda execution ...");
const result = lambda_handler(body);
console.log(result)
console.log(">>> Lambda execution Finished.");
