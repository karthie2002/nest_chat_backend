import { IsString, MinLength, MaxLength, IsNotEmpty } from 'class-validator';
export class CreateGroupDto {
  @IsString({ each: true })
  @MinLength(24)
  @MaxLength(24)
  userIds: string[];

  @IsNotEmpty()
  @IsString()
  name: string;
}

