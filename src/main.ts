import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { applyGlobalConfig } from './nestjs/@shared/global-config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  applyGlobalConfig(app);

  const port = process.env.PORT ?? 3000;

  await app.listen(port, () => {
    console.log(`App running at port ${port}`);
  });
}
bootstrap();
