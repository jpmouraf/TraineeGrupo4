/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-unexpected-multiline */
import prisma from "../../../../config/prismaClient";
import { User } from "@prisma/client";
import {selectItems} from "./excludeAttributes";
import bcrypt from "bcrypt";
import { InvalidParamError } from "../../../../errors/InvalidParamError";
import { QueryError } from "../../../../errors/QueryError";


class UserService {
	async encryptPassword(password: string) {
		const saltRounds = 10;
		const encrypted = await bcrypt.hash(password, saltRounds);
		return encrypted;
	}
	async create(body: User) {
		const checkUser = await prisma.user.findUnique({
			where: {
				email: body.email,
			},
		});
		if(checkUser) {
			throw new QueryError("Email já cadastrado!");
		}

		if(body.email == null) {
			throw new InvalidParamError("email não informado!");
		}

		const encrypted = await this.encryptPassword(body.password);
		const user = await prisma.user.create
		({
			data: {
				email: body.email,
				name: body.name,
				password: encrypted,
				photo: body.photo,
				role: "user",
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
		const encrypted = await this.encryptPassword(body.password);
		const updatedUser = await prisma.user.update({
			data: {
				email: body.email,
				name: body.name,
				password: encrypted,
				photo: body.photo,
				role: "user",
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
			},
			select: selectItems
		});
		return link;
	}

	async unlinkMusic(idUser: number, idMusic: number) {
		const unlink = await prisma.user.update({
			data: {
				music: {
					disconnect: {
						id: idMusic,
					},
				},
			},
			where: {
				id: idUser,
			},
			select: selectItems
		});
		return unlink;
	}

	async listenedMusics(wantedId: number) {
		const listened = await prisma.user.findFirst({
		    where: {
				id: wantedId,
			},
			select: {
			    music: true
			}
		});
		return listened;
	}

	async delete(wantedId: number) 
	{
		const user = await prisma.user.delete({ where: {id: wantedId}});
		return user;
	}
}

export default new UserService();