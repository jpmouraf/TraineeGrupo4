/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-unexpected-multiline */
import prisma from "../../../../config/prismaClient";
import { User } from "@prisma/client";
import {selectItems} from "./excludeAttributes";
import bcrypt from "bcrypt";


class UserService {
	async encryptPassword(password: string) {
	    const saltRounds = 10;
		const encrypted = await bcrypt.hash(password, saltRounds);
		return encrypted;
	}
	async create(body: User) {
		const encrypted = await this.encryptPassword(body.password);
		const user = await prisma.user.create
		({
			data: {
				email: body.email,
				name: body.name,
				password: encrypted,
				photo: body.photo,
				role: body.role,
			}
		});
		return user;
	}

	async getUserbyId(wantedId: number) {
		const user = await prisma.user.findFirst({
			where: {
				id: wantedId,
			},
			select: selectItems
		});
		return user;
	}

	async getUsers() {
		const users = await prisma.user.findMany({
			orderBy: {
				name: "asc",
			},
			select: selectItems
		});
		return users;
	}

	async updateUser(id: number, body: User) {
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
		});
		return updatedUser;
	}

	//alteração para comitar
	async linkMusic(idUser: number, idMusic: number) 
	{
		const link = await prisma.user.update({
			data: {
				music: {
					connect: {
						id: idMusic,
					},
				},
			},
			where: {
				id: idUser,
			}
		});
		return link;
	}

	async delete(wantedId: number) 
	{
		const user = await prisma.user.delete({ where: {id: wantedId}});
		return user;
	}
}

export default new UserService();