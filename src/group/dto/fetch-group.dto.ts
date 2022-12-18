import { IsString, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
export class FetchGroupDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  @MinLength(24)
  id: string;
}
