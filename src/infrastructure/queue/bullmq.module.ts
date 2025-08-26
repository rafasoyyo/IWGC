import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import { LAB_RESULTS_QUEUE, DEAD_LETTER_QUEUE } from './queues';

@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        connection: {
          host: cfg.get<string>('REDIS_HOST', 'localhost'),
          port: parseInt(cfg.get<string>('REDIS_PORT', '6379'), 10),
          db: parseInt(cfg.get<string>('REDIS_DB', '0'), 10),
        },
        prefix: cfg.get<string>('QUEUE_PREFIX', 'iwgc'),
      }),
    }),
    BullModule.registerQueue(
      { name: LAB_RESULTS_QUEUE },
      { name: DEAD_LETTER_QUEUE },
    ),
  ],
  exports: [BullModule],
})
export class BullMqModule {}
