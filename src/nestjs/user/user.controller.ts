import { CreateUserUseCase } from '@core/user/application/usecases/create-user/create-user.usecase';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CreateUserRequestDto } from './dtos/create-user-request-dto';
import { HttpResponse } from '../@shared/http-response';
import { GetUserByIdUseCase } from '@core/user/application/usecases/get-user/get-user-by-id.usecase';
import { GetAllUsersUseCase } from '@core/user/application/usecases/get-user/get-all-users.usecase';
import { UpdateUserUseCase } from '@core/user/application/usecases/update/update-user.usecase';
import { UpdateUserRequestDto } from './dtos/update-user-request-dto';
import { UserPresenter } from './user.presenter';

@Controller('user')
export class UserController {
  @Inject(CreateUserUseCase)
  private readonly createUserUseCase: CreateUserUseCase;

  @Inject(GetUserByIdUseCase)
  private readonly getUserByIdUseCase: GetUserByIdUseCase;

  @Inject(GetAllUsersUseCase)
  private readonly getAllUsersUseCase: GetAllUsersUseCase;

  @Inject(UpdateUserUseCase)
  private readonly updateUserUseCase: UpdateUserUseCase;

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateUserRequestDto): Promise<HttpResponse> {
    console.log(UserController.name, JSON.stringify(dto));
    const [user, error] = (await this.createUserUseCase.execute(dto)).asArray();

    if (error) throw error;

    return HttpResponse.create({
      userId: user.uuid().value,
    });
  }

  @Get('/:userId')
  @HttpCode(200)
  async getById(
    @Param('userId', new ParseUUIDPipe({ errorHttpStatusCode: 422 }))
    userId: string,
  ): Promise<HttpResponse> {
    const [user, error] = (
      await this.getUserByIdUseCase.execute({ userId })
    ).asArray();

    if (error) throw error;
    const userOutput = UserPresenter.fromUser(user);
    return HttpResponse.ok(userOutput);
  }

  @Get()
  @HttpCode(200)
  async getAll(): Promise<HttpResponse> {
    const [users, error] = (await this.getAllUsersUseCase.execute()).asArray();
    if (error) throw error;
    const usersOutput = UserPresenter.fromUsers(users);
    return HttpResponse.ok(usersOutput);
  }

  @Put('/:userId')
  @HttpCode(204)
  async update(
    @Param('userId', new ParseUUIDPipe({ errorHttpStatusCode: 422 }))
    userId: string,
    @Body() dto: UpdateUserRequestDto,
  ): Promise<void> {
    const data = await this.updateUserUseCase.execute({ ...dto, userId });
    if (data.isFail()) {
      throw data.error;
    }
  }
}
