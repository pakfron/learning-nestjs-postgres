import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import config from 'config';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.use(loggerFn);

  const configServer: { port: number } = config.get('server');

  await app.listen(configServer.port);
}
bootstrap();
