import { IsString } from 'class-validator';
export class FetchGroupDto {
  @IsString()
  userIds: string[];
}
