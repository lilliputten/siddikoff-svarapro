import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { RubPaymentMethod } from '../../../services/noros.service';

export class GetBanksDto {
  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  amount?: number;

  @IsOptional()
  @IsEnum(RubPaymentMethod)
  method?: RubPaymentMethod;
}
