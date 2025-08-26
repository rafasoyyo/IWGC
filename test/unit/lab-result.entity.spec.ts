import { LabResult } from '../../src/domain/lab-result.entity';

describe('LabResult entity', () => {
  it('initializes with queued and 0 attempts', () => {
    const lr = new LabResult({
      patientId: 'p1',
      labType: 'blood',
      result: 'ok',
      receivedAt: new Date(),
    });
    const j = lr.toJSON();
    expect(j.status).toBe('queued');
    expect(j.attempts).toBe(0);
  });

  it('transitions states correctly', () => {
    const lr = new LabResult({
      patientId: 'p1',
      labType: 'blood',
      result: 'ok',
      receivedAt: new Date(),
    });

    lr.markProcessing();
    expect(lr.status).toBe('processing');

    lr.markProcessed();
    expect(lr.status).toBe('processed');
    expect(lr.error).toBeNull();

    lr.markFailed('err');
    expect(lr.status).toBe('failed');
    expect(lr.attempts).toBeGreaterThan(0);
    expect(lr.error).toBe('err');

    lr.markDeadLetter('dead');
    expect(lr.status).toBe('dead-lettered');
    expect(lr.error).toBe('dead');
  });
});
