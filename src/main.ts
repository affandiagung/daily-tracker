import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('The API documentation for my project')
    .setVersion('1.0')
    .addBearerAuth() // If using JWT auth
    .build();

  const api = 'swagger'
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(api, app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(
    `Application is running on: http://localhost:${process.env.PORT} ] \nSwagger documentation is on http://localhost:${process.env.PORT}/${api} `,
  );
}
bootstrap();
