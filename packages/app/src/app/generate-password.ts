import { encrypt, randomRange } from '@my-secret/my-secret';

export type GeneratePasswordParams = {
  length?: number;
  specialChars?: string;
};
export const generatePassword: (params?: GeneratePasswordParams) => string = ({
  length = 20,
  specialChars = '!@#$%^&*()[];~+?',
}: GeneratePasswordParams = {}) => {
  const rndData = String(Date.now() + Math.random());
  const rndString = encrypt(rndData, rndData).value;

  return new Array(length)
    .fill(0)
    .map(() => {
      if (randomRange(0, 6) > 5) {
        return specialChars[randomRange(0, specialChars.length - 1)];
      }
      return rndString[randomRange(0, rndString.length - 1)];
    })
    .join('');
};
