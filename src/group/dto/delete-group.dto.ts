import { IsString, MinLength, MaxLength, IsNotEmpty } from 'class-validator';
export class DeleteGroupDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(24)
  @MinLength(24)
  groupId: string;
}
