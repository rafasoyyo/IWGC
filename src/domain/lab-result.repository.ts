import { LabResult } from './lab-result.entity';

export abstract class LabResultRepository {
  abstract create(lab: LabResult): Promise<string>; // returns id
  abstract update(id: string, lab: Partial<LabResult['toJSON']>): Promise<void>;
  abstract markStatus(id: string, status: string, patch?: Partial<ReturnType<LabResult['toJSON']>>): Promise<void>;
  abstract countByStatus(): Promise<{ processed: number; failed: number; deadLettered: number; queued: number; processing: number; }>;
}
