/* eslint-disable no-mixed-spaces-and-tabs */
import prisma from "../../../../config/prismaClient";
import { User } from "@prisma/client";
import bcrypt from "bcrypt";

class AdminService {
	async encryptPassword(password: string) {
		const saltRounds = 10;
		const encrypted = await bcrypt.hash(password, saltRounds);
		return encrypted;
	}
	async updateAdmin(id: number, body: User) {
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
