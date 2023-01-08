import { MaxLength, MinLength, IsString, IsNotEmpty } from 'class-validator';

export class FetchAllMessagesDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  @MinLength(24)
  userId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  @MinLength(24)
  groupId: string;
}

