import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LabResult } from '../../../domain/lab-result.entity';
import { LabResultRepository } from '../../../domain/lab-result.repository';
import { LabResultModel } from './schemas/lab-result.schema';

@Injectable()
export class LabResultMongoRepository implements LabResultRepository {
  constructor(@InjectModel(LabResultModel.name) private readonly model: Model<LabResultModel>) {}

  async create(lab: LabResult): Promise<string> {
    const created = await this.model.create(lab.toJSON());
    return created._id.toString();
  }

  async update(id: string, lab: any): Promise<void> {
    await this.model.updateOne({ _id: id }, { $set: lab }).exec();
  }

  async markStatus(id: string, status: string, patch: any = {}): Promise<void> {
    await this.model.updateOne({ _id: id }, { $set: { status, ...patch } }).exec();
  }

  async countByStatus(): Promise<{ processed: number; failed: number; deadLettered: number; queued: number; processing: number; }> {
    const pipeline = [
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ];
    const rows = await this.model.aggregate(pipeline).exec();
    const map: Record<string, number> = Object.fromEntries(rows.map(r => [r._id, r.count]));
    return {
      processed: map['processed'] ?? 0,
      failed: map['failed'] ?? 0,
      deadLettered: map['dead-lettered'] ?? 0,
      queued: map['queued'] ?? 0,
      processing: map['processing'] ?? 0,
    };
  }
}
