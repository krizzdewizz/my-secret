import { generatePassword } from './generate-password';

describe('generatePassword', () => {
  new Array(10).fill(0).forEach(() => {
    const password = generatePassword();
    it(`should generate password: ${password}`, () => {
      expect(password).toBeDefined();
      expect(password).toHaveLength(20);
    });
  });
});
