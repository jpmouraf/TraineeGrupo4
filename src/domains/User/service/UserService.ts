import prisma from "../../../../config/prismaClient";
import { User } from "@prisma/client";

class UserService {
    async create(body: User) {
        const user = await prisma.user.create
            ({
                data: {
                    email: body.email,
                    name: body.name,
                    password: body.password,
                    photo: body.photo,
                    role: body.role,
                }
            })
        return user;
    }

    async getUserbyId(wantedId: number) {
        try {
            const user = await prisma.user.findFirst({
                where: {
                    id: wantedId,
                }
            })
            return user;
        } catch (error) {
            console.log("Erro ao procurar usuário: ", error);
        }
    }

    async getUsers() {
        try {
            const users = await prisma.user.findMany({
                orderBy: {
                    name: "asc",
                }
            })
            return users;
        } catch (error) {
            console.log("Erro ao procurar usuários: ", error);
        }
    }

    async updateUser(id: number, body: User) {
        try {
            const updatedUser = await prisma.user.update({
                data: {
                    email: body.email,
                    name: body.name,
                    password: body.password,
                    photo: body.photo,
                    role: body.role,
                },
                where: {
                    id: id,
                }
            })
            return updatedUser;
        } catch (error) {
            console.log("Erro ao atualizar usuário: ", error);
        }
    }

    async delete(wantedId: number) 
    {
        const user = await prisma.user.delete({ where: {id: wantedId}});
        return user;
    }
}

export default new UserService();