import crypto from 'crypto';

export const generateSixDigitCode = () => {
  return crypto.randomInt(100000, 1000000).toString();
};

export const hashCode = (code) => {
  return crypto.createHash('sha256').update(code).digest('hex');
};

export const expiresInMinutes = (minutes) => {
  return Date.now() + minutes * 60 * 1000;
};
