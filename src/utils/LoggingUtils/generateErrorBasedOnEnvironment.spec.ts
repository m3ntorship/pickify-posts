import { formatISO } from 'date-fns';

const expectedErrorInNonProductionEnv = {
  statusCode: 200,
  message: '',
  stack: 'stack trace',
  timestamp: formatISO(Date.now()),
  path: 'URL',
};
const expectedErrorInProductionEnv = {
  statusCode: 500,
  message: 'Internal Service Error',
  timestamp: formatISO(Date.now()),
};

function returnCoresspondingError(currentEnvironment: string) {
  if (currentEnvironment != 'production') {
    return expectedErrorInNonProductionEnv;
  }
  return expectedErrorInProductionEnv;
}

describe('test error returned based on the working environment', () => {
  it('check error returned if env not production', () => {
    expect(returnCoresspondingError('development')).toEqual(
      expectedErrorInNonProductionEnv,
    );
  });

  it('check error returned if env is production', () => {
    expect(returnCoresspondingError('production')).toEqual(
      expectedErrorInProductionEnv,
    );
  });
});
