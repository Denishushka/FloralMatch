import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';
import { returnUserObject } from './return-user.object';
import { UserDto } from './user.dto'; 
import { hash } from 'bcryptjs'; 

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    // Метод для получения пользователя по ID
    async byId(id: number, selectObject: Prisma.UserSelect = {}) {
        const user = await this.prisma.user.findUnique({
            where: {
                id,
            },
            select: {
                ...returnUserObject,
                favorite: {
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        images: true,
                        slug: true,
                    },
                },
                ...selectObject,
            },
        });

        if (!user) {
            throw new NotFoundException('User not found'); 
        }

        return user;
    }

    async updateProfile(id: number, dto: UserDto) {
        const isSameUser = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (isSameUser && id !== isSameUser.id) {
            throw new BadRequestException('Email already in use'); 
        }

        const user = await this.byId(id);

        return this.prisma.user.update({
            where: {
                id,
            },
            data: {
                email: dto.email,
                name: dto.name,
                avatarPath: dto.avatarPath,
                phone: dto.phone,
                password: dto.password ? await hash(dto.password, 10) : user.password, 
            },
        });
    }

    async toggleFavorite(userId: number, productId: number) {
        const user = await this.byId(userId);

        if (!user) throw new NotFoundException('User not found!');

        const isExists = user.favorite.some((product) => product.id === productId); 

        await this.prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                favorite: {
                    [isExists ? 'disconnect' : 'connect']: {
                        id: productId,
                    },
                },
            },
        });
        return "Success";
    }
}
