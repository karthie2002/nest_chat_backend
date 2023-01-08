import { MaxLength, MinLength, IsString, IsNotEmpty } from 'class-validator';

export class DeleteMessageDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  @MinLength(24)
  messageId: string;
}
