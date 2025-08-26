import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';

import { ConfigModule } from './config/config.module';
import { LabResultsController } from './interfaces/http/lab-results.controller';
import { StatusController } from './interfaces/http/status.controller';
import { HealthController } from './interfaces/http/health.controller';
import { DashboardController } from './interfaces/http/dashboard.controller';
import { LabResultsService } from './application/services/lab-results.service';
import { LabResultRepository } from './domain/lab-result.repository';
import { LabResultMongoRepository } from './infrastructure/db/mongo/lab-result.mongo.repository';
import { LabResultModel, LabResultSchema } from './infrastructure/db/mongo/schemas/lab-result.schema';
import { BullMqModule } from './infrastructure/queue/bullmq.module';
import { LabResultsProcessor } from './infrastructure/queue/lab-results.processor';
import { LAB_RESULTS_QUEUE, DEAD_LETTER_QUEUE } from './infrastructure/queue/queues';

@Module({
  imports: [
    ConfigModule,
    BullMqModule,
    TerminusModule,
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        uri: cfg.get<string>('MONGO_URI', 'mongodb://localhost:27017/iwgc'),
      }),
    }),
    MongooseModule.forFeature([{ name: LabResultModel.name, schema: LabResultSchema }]),
    BullModule.registerQueue(
      { name: LAB_RESULTS_QUEUE },
      { name: DEAD_LETTER_QUEUE },
    ),
  ],
  controllers: [LabResultsController, StatusController, HealthController, DashboardController],
  providers: [
    LabResultsService,
    LabResultsProcessor,
    { provide: LabResultRepository, useClass: LabResultMongoRepository } as any
  ],
})
export class AppModule {}
