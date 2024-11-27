
const errorMessage = require('./errorConstants');

module.exports = () => (err, req, res, next) => {
  const error = {};

  switch (err.message) {
    case errorMessage.AUTHORIZATION_TOKEN:
      error.message = 'No authorization token was found';
      error.status = 401;
      error.errorCode = 1;
      break;
    case errorMessage.MISSING_PARAMETERS:
      error.message = 'Missing parameters';
      error.status = 400;
      error.errorCode = 2;
      break;
    case errorMessage.NOT_ACCEPTABLE:
      error.status = 406;
      error.message = 'Not acceptable';
      error.errorCode = 3;
      break;
    case errorMessage.NOT_FOUND:
      error.status = 404;
      error.message = 'Not Found';
      error.errorCode = 4;
      break;
    case errorMessage.FORBIDDEN:
      error.status = 403;
      error.message = 'Insufficient privileges';
      error.errorCode = 5;
      break;
    case errorMessage.INVALID_VALUE:
      error.status = 400;
      error.message = 'Value is not valid';
      error.errorCode = 6;
      break;
    case errorMessage.BAD_REQUEST:
      error.status = 400;
      error.message = 'Bad Request';
      error.errorCode = 7;
      break;
    case errorMessage.CREDENTIALS_ERROR:
      error.status = 401;
      error.message = 'Wrong credentials';
      error.errorCode = 8;
      break;
    case errorMessage.INVALID_EMAIL:
      error.status = 400;
      error.message = 'Please fill a valid email address';
      error.errorCode = 9;
      break;
    case errorMessage.DUPLICATE_EMAIL:
      error.status = 406;
      error.message = 'This email address is already registered';
      error.errorCode = 10;
      break;
    case errorMessage.UNAUTHORIZED_ERROR:
      error.status = 401;
      error.message = 'Invalid credentials';
      error.errorCode = 11;
      break;
    case 'jwt expired':
      error.status = 401;
      error.message = 'Token expired';
      error.errorCode = 12;
      break;
    case errorMessage.EMAIL_NOT_VERIFIED:
      error.status = 403;
      error.message = 'Please verify your email before logging in.'
      error.errorCode = 13;
    case errorMessage.INVALID_VERIFICATION_TOKEN:
      error.status = 403;
      error.message = "Invalid verification token",
        error.errorCode = 14;
    case errorMessage.ALREADY_ACTIVATED_PROFILE:
      error.status = 406
      error.message = "Already activated profile"
      error.errorCode = 15;
    case errorMessage.USER_WITH_EMAIL_ALREADY_EXISTS:
      error.status = 403;
      error.message = "Already activated profile"
      error.errorCode = 16;
    case errorMessage.INVALID_DATE:
      error.status = 403;
      error.message = "Invalid Date"
      error.errorCode = 17;
    default:
      error.status = 500;
      error.message = 'Oops, an error occurred';
      error.errorCode = 0;
  }

  // if (error.status === 500) {
  //   logError(req, err);
  //   if (environments.NODE_ENV === 'test') console.log(err);
  // }

  // if (environments.NODE_ENV === 'development') {
  //   error.stack = err.stack;
  // }

  return res.status(error.status).send(error);
};