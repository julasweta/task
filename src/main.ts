import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomConfigService } from './config/config.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const appConfig: CustomConfigService =
    app.get<CustomConfigService>(CustomConfigService);

  app.use(cors());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  //swagger
  const config = new DocumentBuilder()
    .setTitle('Programming School')
    .setDescription('Description Project')
    .setVersion('1.0.')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  await app.listen(appConfig.app_port, () => {
    Logger.log(`http://${appConfig.app_host}}/api`, 'Doc');
  });
}
bootstrap();
