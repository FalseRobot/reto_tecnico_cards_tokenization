import {
    lambda_handler,
    getCardAPIGatewayProxyEvent,
  } from "../handlers/getCard";
  
  const body: getCardAPIGatewayProxyEvent = {
    token: "cqQbFRujLDCwlzN6",
    auth_header: "Bearer pk_test_12345"
  };
  
  console.log(">>> Starting lambda execution ...");
  const result = lambda_handler(body);
  console.log(result)
  console.log(">>> Lambda execution Finished.");
  