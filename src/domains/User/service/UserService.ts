import prisma from "../../../../config/prismaClient";
import { User } from "@prisma/client";

class UserService
{
    async create(body : User) 
    {
        await prisma.user.create
        ({
            data: {
                email: body.email,
                name: body.name,
                password: body.password,
                photo: body.photo,
                role: body.role,
            }
        })
    }
}

export default new UserService();