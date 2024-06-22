/* eslint-disable no-mixed-spaces-and-tabs */
import prisma from "../../../../config/prismaClient";
import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import { QueryError } from "../../../../errors/QueryError";
import { InvalidParamError } from "../../../../errors/InvalidParamError";
import adminRegex from "../../../../utils/constants/verifyEmail";

class AdminService {

	async encryptPassword(password: string) {
		const saltRounds = 10;
		const encrypted = await bcrypt.hash(password, saltRounds);
		return encrypted;
	}
	async updateAdmin(id: number, body:Partial<User>) {

		if ((typeof body.name !== "string" &&  typeof body.name !== "undefined") ){
			throw new InvalidParamError("Os nome inserido é inválido!");
		}
		if ((typeof body.photo !== "string" &&  typeof body.photo !== "undefined") ){
			throw new InvalidParamError("A foto inserida está em formato errado.");
		}
		if ( (typeof body.email !== "string" &&  typeof body.email !=="undefined") ){
			throw new InvalidParamError("Email inválido!");
		}
		if (body.email !== undefined){
			if(!adminRegex.test(body.email)) {
				throw new QueryError("Formato de email inválido!");
			}
		}
		if ((typeof body.password !== "undefined")){
			throw new InvalidParamError("Não é possível modificar a senha por essa rota!");
		}
		if ((body.role !== "user" && typeof body.role !== "undefined" && body.role !== "admin")){
			throw new InvalidParamError("A role inserida é inválida!");
		}
		const checkUser = await prisma.user.findUnique({
			where: {
				id: id
			}
		});

		if (!checkUser){
			throw new QueryError("Esse usuario não existe.");
		}
		if (body.id !== undefined || body.id == 0){
			throw new QueryError("O id não pode ser modificado!");
		}
		if (typeof body.email !== "undefined"){
			if(!adminRegex.test(body.email)) {
				throw new QueryError("Formato de email inválido!");
			}
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
	async updateAdminPassword(id: number, body: Partial<User>) {

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
		if (typeof body.name !== "string" ){
			throw new InvalidParamError("O nome está em um formato inválido!");
		}
		if ((typeof body.photo !== "string"  &&  body.photo !== null) ){
			throw new InvalidParamError("A foto inserida está em um formato inválido!");
		}
		if ( typeof body.email !== "string" ){
			throw new InvalidParamError("Email está em um formato inválido!");
		}
		if (typeof body.password !== "string"){
			throw new InvalidParamError("A senha está em um formato inválido!");
		}
		if ( body.role !== "user" && body.role !== "admin"  ){
			throw new InvalidParamError("O role está em um formato inválido!");
		}

		if (body.id !== undefined){
			throw new QueryError("O id não pode ser modificado!");
		}
		if(!adminRegex.test(body.email)) {
			throw new QueryError("Formato de email inválido!");
		}
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
