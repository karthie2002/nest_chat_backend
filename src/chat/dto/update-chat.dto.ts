import { MaxLength, MinLength, IsString, IsNotEmpty } from 'class-validator';

export class UpdateMessageDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  @MinLength(24)
  messageId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  @MinLength(24)
  updatedContent: string;
}

export class MessageReadDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  @MinLength(24)
  messageId: string;
}
