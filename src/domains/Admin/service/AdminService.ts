/* eslint-disable no-mixed-spaces-and-tabs */
import prisma from "../../../../config/prismaClient";
import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import { QueryError } from "../../../../errors/QueryError";
import { InvalidParamError } from "../../../../errors/InvalidParamError";

class AdminService {
	async validEmail(email: string) {
		const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		return regex.test(email);
	}

	async encryptPassword(password: string) {
		const saltRounds = 10;
		const encrypted = await bcrypt.hash(password, saltRounds);
		return encrypted;
	}
	async updateAdmin(id: number, body: User) {

		if ((typeof body.name !== "string" &&  typeof body.name !== "undefined") || (typeof body.photo !== "string" &&  typeof body.photo !== "undefined") || (typeof body.email !== "string" &&  typeof body.email !=="undefined") ||(typeof body.role !== "string" && typeof body.role !== "undefined")){
			throw new InvalidParamError("Os dados inseridos são inválidos!");
		}
		if ((typeof body.password !== "undefined")){
			throw new InvalidParamError("Não é possível modificar a senha por essa rota!");
		}
		const checkUser = await prisma.user.findUnique({
			where: {
				id: id
			}
		});

		if (!checkUser){
			throw new QueryError("Esse usuario não existe.");
		}
		if (body.id !== undefined){
			throw new QueryError("O id não pode ser modificado!");
		}
		if (typeof body.email !== "undefined"){
			const validation = await this.validEmail(body.email);
			if (!validation) {
				throw new InvalidParamError("Email inválido!");}
		}
		const updatedAdmin = await prisma.user.update({
			data: {
				email: body.email,
				name: body.name,
				photo: body.photo,
				role: body.role,
			},
			where: {
				id: id,
			}
		});
		return updatedAdmin;
	
	}
	async updateAdminPassword(id: number, body: User) {

		if (typeof body.password !== "string" ){
			throw new InvalidParamError("Os dados inseridos são inválidos!");
		}
		
		const checkUser = await prisma.user.findUnique({
			where: {
				id: id
			}
		});

		if (!checkUser){
			throw new QueryError("Esse usuario não existe.");
		}

		
		const encrypted = await this.encryptPassword(body.password);
		const updatedPassword = await prisma.user.update({
			data: {
				password: encrypted,
			},
			where: {
				id: id,
			}
		});
		return updatedPassword;
	
	}

	async createByAdmin(body: User) {

		const checkUser = await prisma.user.findUnique({
			where: {
				email: body.email
			}
		});
		if (checkUser){
			throw new QueryError("Email já cadastrado..");
		}
		if (typeof body.name !== "string" ||(typeof body.photo !== "string"  &&  body.photo !== null)|| typeof body.email !== "string"  ||typeof body.password !== "string"||typeof body.role !== "string" ){
			throw new InvalidParamError("Os dados inseridos são inválidos!");
		}
		if (body.id !== undefined){
			throw new QueryError("O id não pode ser modificado!");
		}
		const validation = await this.validEmail(body.email);
		if (!validation) {
			throw new InvalidParamError("Email inválido!");}

		const encrypted = await this.encryptPassword(body.password);
		const user = await prisma.user.create({
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
}
	

export default new AdminService();
