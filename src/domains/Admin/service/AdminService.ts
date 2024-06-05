import prisma from "../../../../config/prismaClient";
import { User } from "@prisma/client";

class AdminService {
	async updateAdmin(id: number, body: User) {
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
}

export default new AdminService();