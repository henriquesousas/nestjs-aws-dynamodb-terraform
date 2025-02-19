export class UserAlreadyExistException extends Error {
  constructor() {
    super('Usuário já cadastrada em nossa base');
  }
}
