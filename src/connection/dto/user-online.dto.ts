import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
export class UserOnlineDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  online: boolean;
}
