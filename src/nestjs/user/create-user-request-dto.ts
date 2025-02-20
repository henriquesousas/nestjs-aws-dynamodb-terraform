import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserRequestDto {
  @MinLength(1, { message: 'Nome deve estar entre 5 e 100 caracteres' })
  @MaxLength(100, { message: 'Nome deve estar entre 5 e 100 caracteres' })
  name: string;

  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @IsString()
  @MinLength(5, { message: 'Senha deve estar entre 5 e 10 caracteres' })
  @MaxLength(10, { message: 'Senha deve estar entre 5 e 10 caracteres' })
  password: string;
}
