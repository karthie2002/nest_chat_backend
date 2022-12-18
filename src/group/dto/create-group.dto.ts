import { IsString } from 'class-validator';
export class CreateGroupDto {
  @IsString({ each: true })
  userIds: string[];
  @IsString()
  name: string;
}
