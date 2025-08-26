export type LabType = 'blood' | 'urine' | 'other';

export interface LabResultProps {
  patientId: string;
  labType: LabType;
  result: string;
  receivedAt: Date;
  status?: 'queued' | 'processing' | 'processed' | 'failed' | 'dead-lettered';
  attempts?: number;
  error?: string | null;
}

export class LabResult {
  private props: LabResultProps;

  constructor(props: LabResultProps) {
    this.props = { attempts: 0, status: 'queued', error: null, ...props };
  }

  get patientId() { return this.props.patientId; }
  get labType() { return this.props.labType; }
  get result() { return this.props.result; }
  get receivedAt() { return this.props.receivedAt; }
  get status() { return this.props.status ?? 'queued'; }
  get attempts() { return this.props.attempts ?? 0; }
  get error() { return this.props.error ?? null; }

  markProcessing() { this.props.status = 'processing'; }
  markProcessed() { this.props.status = 'processed'; this.props.error = null; }
  markFailed(error: string) {
    this.props.status = 'failed';
    this.props.error = error;
    this.props.attempts = (this.props.attempts ?? 0) + 1;
  }
  markDeadLetter(error: string) {
    this.props.status = 'dead-lettered';
    this.props.error = error;
  }

  toJSON() { return { ...this.props }; }
}
