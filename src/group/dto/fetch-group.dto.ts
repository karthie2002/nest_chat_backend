import { IsString, MinLength, MaxLength, IsNotEmpty } from 'class-validator';

export class FetchAllGroupsDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  @MinLength(24)
  userId: string;
}

// ! not used
export class FetchOneGroupDto {
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
