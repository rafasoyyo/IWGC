import { IsISO8601, IsIn, IsNotEmpty, IsString } from 'class-validator';

export class CreateLabResultDto {
  @IsString() @IsNotEmpty()
  patientId!: string;

  @IsIn(['blood', 'urine', 'other'])
  labType!: 'blood' | 'urine' | 'other';

  @IsString() @IsNotEmpty()
  result!: string;

  @IsISO8601()
  receivedAt!: string;
}
