import {
  MaxLength,
  MinLength,
  IsString,
  IsNotEmpty,
  IsBoolean,
} from 'class-validator';

export class CreateChatDto {
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

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  content: string;
}

export class JoinLeaveRoomDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  @MinLength(24)
  groupId: string;
}

export class TypingDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  @MinLength(24)
  groupId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  @MinLength(24)
  userId: string;

  @IsBoolean()
  @IsNotEmpty()
  isTyping: boolean;
}
