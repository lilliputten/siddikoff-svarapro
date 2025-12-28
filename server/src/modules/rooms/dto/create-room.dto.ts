import {
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateRoomDto {
  @IsNumber()
  @Min(1, { message: 'Minimum bet must be at least $1' })
  minBet: number;

  @IsIn(['public', 'private'])
  type: 'public' | 'private';

  @IsOptional()
  @IsString()
  @MinLength(6)
  @MaxLength(6)
  @Matches(/^\d{6}$/, { message: 'Password must be exactly 6 digits' })
  password?: string;
}
