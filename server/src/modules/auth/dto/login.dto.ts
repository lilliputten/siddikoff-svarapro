import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  initData: string;

  @IsString()
  @IsOptional()
  startPayload?: string;
}
