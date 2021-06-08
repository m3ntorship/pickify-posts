export default function generateErrorBasedOnCurrentEnvironment(
  status: number,
  message: string | string[],
  stack,
  currentEnvironment: string,
) {
  let expectedErrorToBeReturned = {};

  if (currentEnvironment != 'production') {
    expectedErrorToBeReturned = {
      status_code: status,
      message: message,
      stack,
    };
  } else {
    if (status >= 500) {
      message = 'Internal Server Error';
    }

    expectedErrorToBeReturned = {
      status_code: status,
      message,
    };
  }

  return expectedErrorToBeReturned;
}
