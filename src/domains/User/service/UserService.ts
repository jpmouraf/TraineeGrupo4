import prisma from "../../../../config/prismaClient";
import { User } from "@prisma/client";
import {selectItems} from "./excludeAttributes";
import bcrypt from "bcrypt";
import { InvalidParamError } from "../../../../errors/InvalidParamError";
import { QueryError } from "../../../../errors/QueryError";
import { PermissionError } from "../../../../errors/PermissionError";
import  emailRegex  from "../../../../utils/constants/verifyEmail";

class UserService {
	async encryptPassword(password: string) {
		const saltRounds = 10;
		const encrypted = await bcrypt.hash(password, saltRounds);
		return encrypted;
	}
	async create(body: User) {
		if(body.email == null) {
			throw new InvalidParamError("email não informado!");
		}

		const checkUser = await prisma.user.findUnique({
			where: {
				email: body.email,
			},
		});

		if(checkUser) {
			throw new QueryError("Email já cadastrado!");
		}

		if(body.name == null) {
			throw new InvalidParamError("nome não informado!");
		}

		if(body.password == null) {
			throw new InvalidParamError("senha não informada!");
		}

		if(!emailRegex.test(body.email)) {
			throw new QueryError("Formato de email inválido!");
		}

		const encrypted = await this.encryptPassword(body.password);
		const user = await prisma.user.create({
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

		if(typeof wantedId != "number" || !wantedId){
			throw new InvalidParamError("Você deve indicar o ID do usuário!");
		}

		const user = await prisma.user.findFirst({
			where: {
				id: wantedId,
			},
			select: selectItems
		});

		if(!user) {
			throw new QueryError("Usuário não cadastrado!");
		}
		return user;
	}

	async getUsers() {
		const users = await prisma.user.findMany({
			orderBy: {
				name: "asc",
			},
			select: selectItems
		});

		if(users.length==0) {
			throw new QueryError("Nenhum usuário cadastrado!");
		}
		return users;
	}

	async updateUser(id: number, body: Partial<User>) {

		if(typeof id != "number" || !id){
			throw new InvalidParamError("Você deve indicar o ID do usuário!");
		}

		if(body.id !== undefined || body.id == 0) {
			throw new PermissionError("ID não pode ser alterado!");
		}

		if (body.email !== undefined) {
			if (!emailRegex.test(body.email) || body.email == null) {
				throw new QueryError("Formato de email inválido!");
			}
		}
	
		if (body.name !== undefined) {
			if (typeof body.name !== "string" || body.name == null) {
				throw new InvalidParamError("Formato de nome inválido ou não informado!");
			}
		}
	
		if (body.photo !== undefined) {
			if (typeof body.photo != "string" && body.photo != null) {
				throw new QueryError("A foto adicionada está no formato errado.");
			}
		}
	
		if (body.role !== undefined) {
			if (body.role != "user") {
				throw new PermissionError("Você não tem permissão para alterar o role!");
			}
		}
		
		const updatedUser = await prisma.user.update({
			data: {
				email: body.email,
				name: body.name,
				photo: body.photo,
				role: "user",
			},
			where: {
				id: id,
			}
		});
		return updatedUser;
	}


	async updateUserPassword(id: number, body: Partial<User>) {
		if(body.password == null || typeof body.password !== "string") {
			throw new InvalidParamError("Formato de senha inválido!");
		}

		const encrypted = await this.encryptPassword(body.password);
		const updatedUser = await prisma.user.update({
			data: {
				password: encrypted
			},
			where: {
				id: id,
			}
		});
		return updatedUser;
	}

	async linkMusic(idUser: number, idMusic: number) {

		if(typeof idUser != "number" || !idUser){
			throw new InvalidParamError("Você deve indicar o ID do usuário!");
		}

		if(typeof idMusic != "number" || !idMusic){
			throw new InvalidParamError("Você deve indicar o ID da música!");
		}

		const checkUser = await prisma.user.findUnique({
			where: {
				id: idUser,
			}
		});

		if(!checkUser) {
			throw new QueryError("Usuário não encontrado!");
		}

		if(typeof idMusic != "number") {
			throw new InvalidParamError("Id da música inválido");
		}

		const checkMusic = await prisma.music.findUnique({
			where: {
				id: idMusic,
			}
		});

		if(!checkMusic) {
			throw new QueryError("Música não encontrada!");
		}

		const checkAlreadyListened = await prisma.user.findFirst({
			where: {
				id: idUser,
				music: {
					some: {
						id: idMusic,
					}
				}
			} 
		});

		if(checkAlreadyListened) {
			throw new QueryError("Música já foi ouvida pelo usuário");
		}

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

		if(typeof idUser != "number" || !idUser){
			throw new InvalidParamError("Você deve indicar o ID do usuário!");
		}

		if(typeof idMusic != "number" || !idMusic){
			throw new InvalidParamError("Você deve indicar o ID da música!");
		}

		const checkUser = await prisma.user.findUnique({
			where: {
				id: idUser,
			}
		});

		if(!checkUser) {
			throw new QueryError("Usuário não encontrado!");
		}

		if(typeof idMusic != "number") {
			throw new InvalidParamError("Id da música inválido");
		}

		const checkMusic = await prisma.music.findUnique({
			where: {
				id: idMusic,
			}
		});

		if(!checkMusic) {
			throw new QueryError("Música não encontrada!");
		}

		const checkAlreadyListened = await prisma.user.findFirst({
			where: {
				id: idUser,
				music: {
					some: {
						id: idMusic,
					}
				}
			} 
		});

		if(!checkAlreadyListened) {
			throw new QueryError("Música não foi ouvida pelo usuário");
		}

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
		const checkUser = await prisma.user.findUnique({
			where: {
				id: wantedId,
			}
		});

		if(!checkUser) {
			throw new QueryError("Usuário não encontrado!");
		}

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

	async delete(wantedId: number) {

		if(typeof wantedId != "number" || !wantedId){
			throw new InvalidParamError("Você deve indicar o ID do usuário!");
		}

		const checkUser = await prisma.user.findUnique({
			where: {
				id: wantedId,
			},
		});

		if(!checkUser) {
			throw new QueryError("Usuário que deseja deletar não está cadastrado!");
		}
		const user = await prisma.user.delete({ where: {id: wantedId}});
		return user;
	}
}

export default new UserService();