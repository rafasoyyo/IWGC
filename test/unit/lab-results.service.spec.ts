import { LabResultsService } from '../../src/application/services/lab-results.service';

describe('LabResultsService', () => {
  it('submit creates repo entry and enqueues job', async () => {
    const createdId = 'abc123';
    const repo = {
      create: jest.fn().mockResolvedValue(createdId),
      countByStatus: jest.fn().mockResolvedValue({ processed:0, failed:0, deadLettered:0, queued:1, processing:0 }),
    };
    const queue = { add: jest.fn().mockResolvedValue(true) };
    const svc = new LabResultsService(repo as any, queue as any);

    const res = await svc.submit({ patientId: 'p1', labType: 'blood', result: 'ok', receivedAt: new Date().toISOString() });
    expect(res.id).toBe(createdId);
    expect(repo.create).toHaveBeenCalled();
    expect(queue.add).toHaveBeenCalledWith('process', { id: createdId }, expect.any(Object));
  });

  it('status delegates to repo', async () => {
    const repo = { countByStatus: jest.fn().mockResolvedValue({ processed:1, failed:0, deadLettered:0, queued:0, processing:0 }) };
    const svc = new LabResultsService(repo as any, {} as any);
    const s = await svc.status();
    expect(s.processed).toBe(1);
  });
});
