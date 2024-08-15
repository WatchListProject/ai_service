import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { join } from 'path';
import * as dotenv from 'dotenv';

dotenv.config();


async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      package: 'ai',
      url: '0.0.0.0:5004',
      protoPath: join(__dirname, '../node_modules/protos/ai_service.proto'),
    },
  });
  await app.listen();
}
bootstrap();