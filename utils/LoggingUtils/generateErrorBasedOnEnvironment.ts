import { formatISO } from 'date-fns';

export default function generateErrorBasedOnCurrentEnvironment(
    status: number,
    message: string,
    stack,
    url,
    currentEnvironment: string) {
    let expectedErrorToBeReturned = {};

    if (currentEnvironment != 'production') {
      expectedErrorToBeReturned = {
        statusCode: status,
        message: message,
        stack,
        timestamp: formatISO(Date.now()),
        path: url,
      };
    } else {
      if (status >= 500) {
        message = 'Internal Server Error';
      }

      expectedErrorToBeReturned = {
        statusCode: status,
        message,
        timestamp: formatISO(Date.now()),
      };
    }
    
    return expectedErrorToBeReturned;
}