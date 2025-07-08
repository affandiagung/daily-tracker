import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as morgan from 'morgan';
import { AllExceptionsFilter } from './custom/helper/http.response';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AllExceptionsFilter());
  const mode = process.env.NODE_ENV === 'test' ? 'TESTING' : 'PRODUCTION';
  const config = new DocumentBuilder()
    .setTitle(`Daily Tracker API -  ` + mode)
    .setDescription('The API documentation for my project')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  app.use(
    morgan(
      ':date[web] \t| :method :url \t| :status \t| :res[content-length] - :response-time ms',
    ),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  const api = 'swagger';
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(api, app, document);

  await app.listen(process.env.PORT ?? 3000);
  console.log(
    `\nServer in mode ${process.env.NODE_ENV === 'test' ? 'TESTING' : 'PRODUCTION'} `,
  );

  console.log(`
    ▓█████▄  ▄▄▄       ██▓ ██▓   ▓██   ██▓   ▄▄▄█████▓ ██▀███   ▄▄▄       ▄████▄   ██ ▄█▀▓█████  ██▀███  
    ▒██▀ ██▌▒████▄    ▓██▒▓██▒    ▒██  ██▒   ▓  ██▒ ▓▒▓██ ▒ ██▒▒████▄    ▒██▀ ▀█   ██▄█▒ ▓█   ▀ ▓██ ▒ ██▒
    ░██   █▌▒██  ▀█▄  ▒██▒▒██░     ▒██ ██░   ▒ ▓██░ ▒░▓██ ░▄█ ▒▒██  ▀█▄  ▒▓█    ▄ ▓███▄░ ▒███   ▓██ ░▄█ ▒
    ░▓█▄   ▌░██▄▄▄▄██ ░██░▒██░     ░ ▐██▓░   ░ ▓██▓ ░ ▒██▀▀█▄  ░██▄▄▄▄██ ▒▓▓▄ ▄██▒▓██ █▄ ▒▓█  ▄ ▒██▀▀█▄  
    ░▒████▓  ▓█   ▓██▒░██░░██████▒ ░ ██▒▓░     ▒██▒ ░ ░██▓ ▒██▒ ▓█   ▓██▒▒ ▓███▀ ░▒██▒ █▄░▒████▒░██▓ ▒██▒
    ▒▒▓  ▒  ▒▒   ▓▒█░░▓  ░ ▒░▓  ░  ██▒▒▒      ▒ ░░   ░ ▒▓ ░▒▓░ ▒▒   ▓▒█░░ ░▒ ▒  ░▒ ▒▒ ▓▒░░ ▒░ ░░ ▒▓ ░▒▓░
    ░ ▒  ▒   ▒   ▒▒ ░ ▒ ░░ ░ ▒  ░▓██ ░▒░        ░      ░▒ ░ ▒░  ▒   ▒▒ ░  ░  ▒   ░ ░▒ ▒░ ░ ░  ░  ░▒ ░ ▒░
    ░ ░  ░   ░   ▒    ▒ ░  ░ ░   ▒ ▒ ░░       ░        ░░   ░   ░   ▒   ░        ░ ░░ ░    ░     ░░   ░ 
      ░          ░  ░ ░      ░  ░░ ░                    ░           ░  ░░ ░      ░  ░      ░  ░   ░                            
                                                                                        
    `);

  console.log(
    `
    Application is running on: http://localhost:${process.env.PORT} 
    Swagger documentation is on http://localhost:${process.env.PORT}/${api} 
    `,
  );
}
bootstrap();
