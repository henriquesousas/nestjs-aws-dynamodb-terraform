import { Password } from '../password';

describe('Password unit test', () => {
  describe('Create an password when value between 5 and 10 characters', () => {
    it.each([
      ['11111', false],
      ['1111111111', false],
      ['1111111', false],
    ])(
      'should create an password with %i',
      (number: string, hasErrors: boolean) => {
        const password = new Password(number);
        expect(password.domainNotification.hasErrors()).toBe(hasErrors);
        expect(password.domainNotification.toJSON()).toEqual([]);
      },
    );
  });

  describe('Not create an password when value is less than 5 and more than 10 characters ', () => {
    it.each([
      ['11111111111', true, 'Senha deve estar entre 5 e 10 caracteres'],
      ['1111', true, 'Senha deve estar entre 5 e 10 caracteres'],
    ])(
      'should not create an password with  %i',
      (number: string, hasErrors: boolean, expectedError: string) => {
        const password = new Password(number);
        expect(password.domainNotification.hasErrors()).toBe(hasErrors);
        expect(password.domainNotification.toJSON()).toEqual([
          {
            password: [expectedError],
          },
        ]);
      },
    );
  });
});
