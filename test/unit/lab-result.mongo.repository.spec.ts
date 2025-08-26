import { LabResultMongoRepository } from './../../src/infrastructure/db/mongo/lab-result.mongo.repository';
import { LabResult } from './../../src/domain/lab-result.entity';

describe('LabResultMongoRepository', () => {
  const mockModel = () => ({
    create: jest.fn().mockImplementation((x) => Promise.resolve({ _id: 'oid', ...x })),
    updateOne: jest.fn().mockReturnThis(),
    exec: jest.fn().mockResolvedValue(null),
    aggregate: () => ({
      exec: () => [{ _id: 'processed', count: 2 }]
    }),
  });

  it('create returns id', async () => {
    const model = mockModel();
    const repo = new LabResultMongoRepository(model as any);
    const id = await repo.create(new LabResult({ patientId: 'p', labType: 'blood', result: 'r', receivedAt: new Date() }));
    expect(id).toBe('oid');
    expect(model.create).toHaveBeenCalled();
  });

  it('countByStatus aggregates', async () => {
    const model = mockModel();
    const repo = new LabResultMongoRepository(model as any);
    const counts = await repo.countByStatus();
    expect(counts.processed).toBe(2);
  });
});
