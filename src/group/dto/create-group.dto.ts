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

export class FetchGroupDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  @MinLength(24)
  id: string;
}
