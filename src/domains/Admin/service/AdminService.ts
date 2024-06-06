/* eslint-disable no-mixed-spaces-and-tabs */
import prisma from "../../../../config/prismaClient";
import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import { PermissionError } from "../../../../errors/PermissionError";
import { QueryError } from "../../../../errors/QueryError";
import { TokenError } from "../../../../errors/TokenError";
import { NotAuthorizedError } from "../../../../errors/NotAuthorizedError";
import { LoginError } from "../../../../errors/LoginError";
import { InvalidRouteError } from "../../../../errors/InvalidRouteError";
import { InvalidParamError } from "../../../../errors/InvalidParamError";

class AdminService {
	async encryptPassword(password: string) {
		const saltRounds = 10;
		const encrypted = await bcrypt.hash(password, saltRounds);
		return encrypted;
	}
	async updateAdmin(id: number, body: User) {

		if ((typeof body.name !== "string" &&  typeof body.name !== "undefined") || (typeof body.email !== "string" &&  typeof body.email !=="undefined") ||(typeof body.password !== "string" && typeof body.password !== "undefined")||(typeof body.role !== "string" && typeof body.role !== "undefined")){
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
		const updatedAdmin = await prisma.user.update({
			data: {
				email: body.email,
				name: body.name,
				password: encrypted,
				photo: body.photo,
				role: body.role,
			},
			where: {
				id: id,
			}
		});
		return updatedAdmin;
	
	}

	async createByAdmin(body: User) {
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
