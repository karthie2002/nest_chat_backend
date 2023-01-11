import { IsString, MinLength, MaxLength, IsNotEmpty } from 'class-validator';

export class FetchAllGroupsDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  @MinLength(24)
  userId: string;
}

// ! not used
export class EditGroupDescDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  @MinLength(24)
  groupId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  newGroupDesc: string;
}
