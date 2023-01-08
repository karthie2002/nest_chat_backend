import { Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { WebSocketServer, WsException } from '@nestjs/websockets';
import { FetchAllGroupsDto, FetchOneGroupDto } from './dto/fetch-group.dto';
import { DeleteGroupDto } from './dto/delete-group.dto';
import { AddDelUserDto } from './dto/users-group.dto';

interface ConnectUser {
  id: string;
}

@Injectable()
export class GroupService {
  client: any;
  constructor(private readonly prismaService: PrismaService) {}

  //Create a new group - createGroup
  async createGroup(group: CreateGroupDto) {
    const sorted = [...group.userIds].sort();
    let connectUser: ConnectUser[] = [];
    sorted.forEach((each: string) => {
      connectUser.push({ id: each });
    });
    try {
      const groupData = await this.prismaService.group.create({
        data: {
          userIds: group.userIds,
          groupName: group.grpName,
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
      if (error instanceof PrismaClientKnownRequestError) {
        if (
          error.code === 'P2002' &&
          error.meta.target == 'Group_userJson_key'
        ) {
          throw new WsException(
            'Cannot form multiple groups with the same users',
          );
        } else if (error.code === 'P2002') {
          throw new WsException('Group name already exists');
        } else if (error.code === 'P2022') {
          throw new WsException('Invalid command');
        } else {
          throw new WsException('Invalid user');
        }
      } else {
        throw error;
      }
    }
  }

  //All groups in which user exists - fetchAllGroups
  async fetchAllGroups(userId: FetchAllGroupsDto) {
    try {
      const groups = await this.prismaService.group.findMany({
        where: {
          userIds: {
            has: userId.userId,
          },
        },
        select: {
          id: true,
          groupName: true,
          messages: {
            orderBy: {
              createdAt: 'desc',
            },
            take: 1,
            select: {
              createdAt: true,
              content: true,
              groupId: true,
            },
          },
        },
      });
      return groups;
    } catch (error) {
      console.log(error);
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2023') {
          throw new WsException('No groups found!!');
        } else {
          throw new WsException('hello');
        }
      } else {
        throw new WsException('hi');
      }
    }
  }

  // ! Redundancy - same as fetchAllMessages
  async fetchOneGroup(body: FetchOneGroupDto) {
    try {
      const groupData = await this.prismaService.group.findUniqueOrThrow({
        where: {
          id: body.groupId,
        },
        select: {
          groupName: true,
          description: true,
          messages: true,
          userIds: true,
        },
      });
      return groupData;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2023') {
          throw new WsException('Group does not exist');
        } else {
          throw new WsException('Unknown error!!');
        }
      } else {
        throw new WsException('Unknown error!!');
      }
    }
  }

  // ! Yet to be done, Messages in that grp to be deleted
  //Delete one group - deleteGroup
  async deleteGroup(body: DeleteGroupDto) {
    try {
      const groupData = await this.prismaService.group.delete({
        where: {
          id: body.groupId,
        },
        select: {
          id: true,
          groupName: true,
          user: true,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new WsException('Group does not exist');
        } else {
          throw new WsException('Unknown error!!');
        }
      } else {
        throw new WsException('Unknown error!!');
      }
    }
    // const usersData = await this.prismaService.user.updateMany({
    //   where: {
    //     groupIds: {
    //       has: body.groupId,
    //     },
    //   },
    //   data: {},
    // });
  }

  // for (let i = 0; i < usersData.length; i++) {
  //   let obj = usersData[i];
  //   for (var j = 0; j < obj.groupIds.length; j++) {
  //     if (obj[j] === body.groupId) {
  //       obj.groupIds.splice(j, 1);
  //     }
  //   }
  //   console.log(obj);
  // for (const groupId in obj.groupIds) {
  //   if (groupId == body.groupId) {
  //   }
  // }

  // ! Yet to be done
  async addUserToGroup(body: AddDelUserDto) {
    // try {
    //   const userData = await this.prismaService.user.findUniqueOrThrow({
    //     where: {
    //       id: body.userId,
    //     },
    //     select: {
    //       groupIds: true,
    //       id: true,
    //       username: true,
    //     },
    //   });
    //   if (userData.groupIds.includes(body.groupId)) {
    //     const groupData = await this.prismaService.group.update({
    //       where: {
    //         id: body.groupId,
    //       },
    //       data: {
    //         userIds: {
    //           push: {
    //             id: body.userId,
    //           },
    //         },
    //         userJson: {
    //           push: {
    //             id: body.userId,
    //           },
    //         },
    //       },
    //     });
    //     return groupData;
    //   } else {
    //     throw new WsException('error');
    //   }
    // } catch (error) {
    //   if (error instanceof PrismaClientKnownRequestError) {
    //     if (error.code === 'P2025') {
    //       throw new WsException('User does not exist');
    //     } else {
    //       throw new WsException('Unknown error!!');
    //     }
    //   } else {
    //     throw new WsException('Unknown error!!');
    //   }
    // }
  }

  // ! Yet to be done
  // ! Dont use this endpoint
  async delUserFromGroup(body: AddDelUserDto) {
    try {
      const userData = await this.prismaService.user.findUniqueOrThrow({
        where: {
          id: body.userId,
        },
        select: {
          groupIds: true,
          id: true,
          username: true,
        },
      });
      if (userData.groupIds.includes(body.groupId)) {
        const groupData = await this.prismaService.group.update({
          where: {
            id: body.groupId,
          },
          data: {
            userJson: {
              delete: {
                id: body.userId,
              },
            },
          },
        });
        return groupData;
      } else {
        throw new WsException('error');
      }
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new WsException('User does not exist');
        } else {
          throw new WsException('Unknown error!!');
        }
      } else {
        throw new WsException('Unknown error!!');
      }
    }
  }
}
