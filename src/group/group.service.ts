import { Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { FetchGroupDto } from './dto/fetch-group.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
interface ConnectUser {
  id: string;
}
@Injectable()
export class GroupService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(group: CreateGroupDto) {
    const sorted = [...group.userIds].sort();
    let connectUser: ConnectUser[] = [];
    sorted.forEach((each: string) => {
      connectUser.push({ id: each });
    });
    try {
      const groupData = await this.prismaService.group.create({
        data: {
          userIds: group.userIds,
          groupName: group.name,
          user: {
            connect: connectUser,
          },
          userJson: sorted.reduce(function (result, item, index) {
            result[`user${index + 1}`] = item;
            return result;
          }, {}),
        },
      });
      return { created: true, groupData };
    } catch (error) {
      console.log(error);
    }
  }
  // return group.userIds;

  async findGroup(fetchGroup: FetchGroupDto) {
    return await this.prismaService.user.findMany({
      select: {
        id: true,
      },
      where: {
        id: {
          notIn: fetchGroup.userIds,
        },
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} group`;
  }
}
