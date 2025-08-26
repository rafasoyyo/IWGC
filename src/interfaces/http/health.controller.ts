import { Controller, Get } from '@nestjs/common';
import { HealthCheck } from '@nestjs/terminus';
import { InjectConnection } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

import { Connection } from 'mongoose';
import Redis from 'ioredis';

@Controller('health')
export class HealthController {
  constructor(private cfg: ConfigService, @InjectConnection() private connection: Connection) {}

  @Get()
  @HealthCheck()
  async check() {
    const redisHost = this.cfg.get('REDIS_HOST', 'localhost');
    const redisPort = parseInt(this.cfg.get('REDIS_PORT', '6379'), 10);
    const client = new Redis({ host: redisHost, port: redisPort });
    try {
      await client.connect();
      const pong = await client.ping();
      await client.disconnect();
      const mongoOk = !!(this.connection && this.connection.readyState === 1);
      return {
        status: 'ok',
        info: { mongo: mongoOk ? 'up' : 'down', redis: pong === 'PONG' ? 'up' : 'down' },
      };
    } catch (e:any) {
      return { status: 'error', error: e.message ?? String(e) };
    }
  }
}
