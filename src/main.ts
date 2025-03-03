import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { applyGlobalConfig } from './nestjs/@shared/global-config';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  applyGlobalConfig(app);

  const configService = app.get(ConfigService);
  const port = configService.get<string>('HTTP_PORT') ?? 8000;

  await app.listen(port, () => {
    console.log(`App running at port ${port}`);
  });
}
bootstrap().catch((err) => {
  console.error('Error during application startup:', err);
});
