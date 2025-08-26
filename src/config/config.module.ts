import { Module } from '@nestjs/common';
import { ConfigModule as NestConfig } from '@nestjs/config';

@Module({
  imports: [
    NestConfig.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      cache: true,
      expandVariables: true,
      load: [],
    }),
  ],
})
export class ConfigModule {}
