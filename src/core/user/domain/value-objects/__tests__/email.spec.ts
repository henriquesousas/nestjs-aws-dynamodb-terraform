import { Email } from '../email';

describe('Email uni test', () => {
  it('should create an  email', () => {
    const emailValue = 'test@gmail.com';
    const email = new Email(emailValue);
    expect(email.value).toBe(emailValue);
  });

  it.each([['test'], ['test@'], ['test.com']])(
    'should add error on notification when email is invalid %i',
    (emailValue: string) => {
      const email = new Email(emailValue);

      expect(email.domainNotification.hasErrors()).toBe(true);
      // expect(email.domainNotification.toJSON()).toEqual(['Email inválido']);
      expect(email.domainNotification.toJSON()).toEqual([
        {
          email: ['Email inválido'],
        },
      ]);
    },
  );
});
