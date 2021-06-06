import generateErrorBasedOnCurrentEnvironment from '../LoggingUtils/generateErrorBasedOnEnvironment';

const expectedErrorInNonProductionEnv = {
  statusCode: 200,
  message: 'Error Message',
  stack: 'stack trace',
};

const expectedErrorInProductionEnv = {
  statusCode: 500,
  message: 'Internal Server Error',
};

describe('test error returned based on the working environment', () => {
  it('check error returned if env not production', () => {
    expect(
      generateErrorBasedOnCurrentEnvironment(
        200,
        'Error Message',
        'stack trace',
        'development',
      ),
    ).toEqual(expectedErrorInNonProductionEnv);
  });

  it('check error returned if env is production', () => {
    expect(
      generateErrorBasedOnCurrentEnvironment(
        500,
        'Error Message',
        'stack trace',
        'production',
      ),
    ).toEqual(expectedErrorInProductionEnv);
  });
});
