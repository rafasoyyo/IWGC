import { Processor, WorkerHost, OnWorkerEvent, InjectQueue } from '@nestjs/bullmq';
import { Job, Queue } from 'bullmq';
import { LAB_RESULTS_QUEUE, DEAD_LETTER_QUEUE } from './queues';
import { InjectModel } from '@nestjs/mongoose';
import { LabResultModel } from '../db/mongo/schemas/lab-result.schema';
import { Model } from 'mongoose';

function structuredLog(message: string, meta: Record<string, any> = {}) {
  const payload = { ts: new Date().toISOString(), msg: message, ...meta };
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(payload));
}

@Processor(LAB_RESULTS_QUEUE)
export class LabResultsProcessor extends WorkerHost {
  constructor(
    @InjectModel(LabResultModel.name) private readonly model: Model<LabResultModel>,
    @InjectQueue(DEAD_LETTER_QUEUE) private readonly deadLetter: Queue,
  ) { super(); }

  @OnWorkerEvent('active')
  onActive(job: Job) {
    structuredLog('Job started', { jobId: job.id, name: job.name });
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    structuredLog('Job success', { jobId: job.id });
  }

  @OnWorkerEvent('failed')
  async onFailed(job: Job, err: Error) {
    structuredLog('Job failed', { jobId: job?.id, attemptsMade: job?.attemptsMade, error: err?.message });
    if (job && job.attemptsMade >= (job.opts.attempts ?? 3)) {
      // dead-letter
      await this.deadLetter.add('dead', job.data, { removeOnComplete: 1000 });
      const id = job.data.id as string;
      await this.model.updateOne({ _id: id }, { $set: { status: 'dead-lettered', error: err.message } }).exec();
      structuredLog('Job dead-lettered', { jobId: job.id, docId: id });
    }
  }

  async process(job: Job<{ id: string }>): Promise<void> {
    const id = job.data.id;
    await this.model.updateOne({ _id: id }, { $set: { status: 'processing' } }).exec();

    // Simulate variable processing delay
    await new Promise((res) => setTimeout(res, 5000 + Math.random()*100));

    // Simulate transient error with 20% probability
    if (Math.random() < 0.2) {
      const err = new Error('Transient processing error');
      await this.model.updateOne({ _id: id }, { $inc: { attempts: 1 }, $set: { status: 'failed', error: err.message } }).exec();
      throw err;
    }

    // "Process" the result (no-op)
    await this.model.updateOne({ _id: id }, { $set: { status: 'processed', error: null } }).exec();
  }
}
