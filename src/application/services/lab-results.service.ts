import { Injectable } from '@nestjs/common';
import { LabResult, LabResultProps } from '../../domain/lab-result.entity';
import { LabResultRepository } from '../../domain/lab-result.repository';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

export const LAB_RESULTS_QUEUE = 'lab-results';
export const DEAD_LETTER_QUEUE = 'dead-letter';

@Injectable()
export class LabResultsService {
  constructor(
    private readonly repo: LabResultRepository,
    @InjectQueue(LAB_RESULTS_QUEUE) private readonly queue: Queue,
  ) {}

  async submit(payload: Omit<LabResultProps, 'status' | 'attempts' | 'error' | 'receivedAt'> & { receivedAt: string | Date }) {
    const receivedAt = new Date(payload.receivedAt);
    const lab = new LabResult({ ...payload, receivedAt });
    const id = await this.repo.create(lab);
    await this.queue.add('process', { id }, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 500 },
      removeOnComplete: 1000,
      removeOnFail: 1000
    });
    return { id };
  }

  async status() {
    return this.repo.countByStatus();
  }
}
