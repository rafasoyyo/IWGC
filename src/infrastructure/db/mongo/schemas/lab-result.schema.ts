import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LabResultDocument = HydratedDocument<LabResultModel>;

@Schema({ timestamps: true })
export class LabResultModel {
  @Prop({ required: true }) patientId!: string;
  @Prop({ required: true, enum: ['blood', 'urine', 'other'] }) labType!: string;
  @Prop({ required: true }) result!: string;
  @Prop({ required: true }) receivedAt!: Date;
  @Prop({ required: true, enum: ['queued', 'processing', 'processed', 'failed', 'dead-lettered'], default: 'queued' }) status!: string;
  @Prop({ default: 0 }) attempts!: number;
  @Prop({ type: String, default: null }) error!: string | null;
}

export const LabResultSchema = SchemaFactory.createForClass(LabResultModel);
LabResultSchema.index({ patientId: 1, receivedAt: -1 });
