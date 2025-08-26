import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('App (e2e)', () => {
  let app: INestApplication;

  type store = {
    payload: string;
    status: 'processed' | 'failed' | 'deadLettered' | 'queued' | 'processing';
    id: string;
  };

  const fakeService = {
    _store: new Map<string, store>(),
    async submit(payload: any) {
      const id = 'test-' + (Math.random() * 100000 | 0);
      this._store.set(id, { ...payload, status: 'queued', id });
      return { id };
    },
    async status() {
      // compute simple counts
      const vals: store[] = Array.from(this._store.values());
      const counts = { processed: 0, failed: 0, deadLettered: 0, queued: 0, processing: 0 };
      for (const v of vals) counts[v.status] = (counts[v.status] || 0) + 1;
      return counts;
    }
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider('LabResultsService')
      .useValue(fakeService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/lab-results (POST) should accept valid payload', async () => {
    const payload = {
      patientId: 'p1',
      labType: 'blood',
      result: 'ok',
      receivedAt: new Date().toISOString()
    };
    const res = await request(app.getHttpServer()).post('/lab-results').send(payload).expect(202);
    expect(res.body.id).toBeDefined();
    expect(res.body.status).toBe('queued');
  });

  it('/lab-results (POST) should reject invalid payload', async () => {
    const payload = { patientId: '', labType: 'invalid', result: '', receivedAt: 'not-a-date' };
    await request(app.getHttpServer()).post('/lab-results').send(payload).expect(400);
  });

  it('/status (GET) should return counts', async () => {
    const res = await request(app.getHttpServer()).get('/status').expect(200);
    expect(res.body).toHaveProperty('processed');
    expect(res.body).toHaveProperty('queued');
  });

  it('/health (GET) should return something', async () => {
    const res = await request(app.getHttpServer()).get('/health').expect(200);
    expect(res.body).toBeDefined();
  });
});
