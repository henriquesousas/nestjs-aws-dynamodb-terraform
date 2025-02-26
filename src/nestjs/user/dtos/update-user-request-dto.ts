import { MaxLength, MinLength } from 'class-validator';

export class UpdateUserRequestDto {
  @MinLength(1, { message: 'Nome deve estar entre 5 e 100 caracteres' })
  @MaxLength(100, { message: 'Nome deve estar entre 5 e 100 caracteres' })
  name: string;
}
