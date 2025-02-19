import { Name } from '../name';

function generateABigName(size: number = 100): string {
  let bigName = '';
  for (let i = 1; i <= size; i++) {
    bigName += 'a';
  }

  return bigName;
}

describe('Name unit test', () => {
  describe('valid Name', () => {
    it.each([['nome 1'], [generateABigName()]])(
      'should create a valid name %i',
      (aName: string) => {
        const name = new Name(aName);
        expect(name.domainNotification.hasErrors()).toBe(false);
        expect(name.value).toBe(aName);
      },
    );
  });

  describe.only('invalid Name', () => {
    it.each([[''], ['       '], [generateABigName(101)]])(
      'should add error on notification when invalid name is %i',
      (aName: string) => {
        const name = new Name(aName);
        expect(name.domainNotification.hasErrors()).toBe(true);
        expect(name.value).toBe(aName);
      },
    );
  });
});
