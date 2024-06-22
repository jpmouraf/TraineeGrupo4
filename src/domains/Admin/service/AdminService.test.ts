/* eslint-disable quotes */
import prisma from "../../../../config/prismaClient";
import { prismaMock } from "../../../../config/singleton";
import { InvalidParamError } from "../../../../errors/InvalidParamError";
import { QueryError } from "../../../../errors/QueryError";
import AdminService from "./AdminService";
import bcrypt from "bcrypt"; 

const admin = {
	id: 0,
	name: "Administrador",
	email: "admin@gmail.com",
	password: "12345",
	photo: null,
	role: "admin"
};

const user : any= {
    name: 'usuário',
    email: 'user@gmail.com',
    password: '12345', 
    photo: null,
    role: 'user'
};


jest.mock("bcrypt", () => ({ 
	hash: jest.fn(), 
})); 

describe("Encrypt password", () => { 
	test("Tenta encriptar a senha ==> retorna encrypted", async () => { 
		const password= "12345"; 
		const encrypted="encrypted"; 
		const saltRounds=10; 
		(bcrypt.hash as jest.Mock).mockResolvedValue(encrypted); 
		await expect(AdminService.encryptPassword(password)).resolves.toEqual(encrypted); 
		expect(bcrypt.hash).toHaveBeenCalledWith(password, saltRounds); 
	}); 
});

describe("updateAdmin", () => {

	const body = {
		name: "Administrador Atualizado"
	};

	const updatedAdmin = {
		id: 0,
		name: "Administrador Atualizado",
		email: "admin@gmail.com",
		password: "12345",
		photo: null,
		role: "admin"
	};

	const bodyPassword = {
		password: "12345"
	};

	const bodyId = {
		id: 1
	};

	test("entrada com atributos a serem alterados ==> atributos são alterados no banco de dados", async () => {

		prismaMock.user.findUnique.mockResolvedValue(admin);

		prismaMock.user.update.mockResolvedValue(updatedAdmin);

		await expect(AdminService.updateAdmin(admin.id, body)).resolves.toEqual(updatedAdmin);
	});

	test("tenta modificar a senha por essa rota ==> lança exceção", async () => {

		prismaMock.user.findUnique.mockRejectedValue(new InvalidParamError("Não é possível modificar a senha por essa rota!"));

		await expect(AdminService.updateAdmin(admin.id, bodyPassword)).rejects.toThrow(
			new InvalidParamError("Não é possível modificar a senha por essa rota!")
		);
	});

	test("tentar mudar um usuário que não existe ==> lança exceção", async () => {

		prismaMock.user.findUnique.mockResolvedValue(null);

		await expect(AdminService.updateAdmin(admin.id, body)).rejects.toThrow(
			new QueryError("Esse usuario não existe.")
		);
	});

	test("tenta mudar o id do usuário ==> lança exceção", async () => {

		prismaMock.user.findUnique.mockResolvedValue(admin);

		prismaMock.user.findUnique.mockRejectedValue(new QueryError("O id não pode ser modificado!"));

		await expect(AdminService.updateAdmin(admin.id, bodyId)).rejects.toThrow(
			new QueryError("O id não pode ser modificado!")
		);
	});
});

describe('UpdateAdminPassword', () => {
	test('Atualiza senha com sucesso ==> retorna senha', async () => {

		const body={
			password: "123"
		};

		const encrypted2 = await AdminService.encryptPassword(body.password);
		const Admin2={
			id: admin.id,
			email: admin.email,
			name:admin.name,
			password:encrypted2,
			photo:admin.photo,
			role: admin.role 
		};
		prismaMock.user.findUnique.mockResolvedValueOnce(Admin2);
		prismaMock.user.update.mockResolvedValue(Admin2);
		await expect(AdminService.updateAdminPassword(admin.id, body)).resolves.toEqual(Admin2);
		expect(prismaMock.user.update).toHaveBeenCalledWith({
			data: {
				password: encrypted2
			},
			where: {
				id: admin.id,
			}
		});
		expect(prismaMock.user.findUnique).toHaveBeenCalledWith({where:{id: admin.id}});
	});      
	test('Tenta atualizar a senha de um usuário inexistente ==> Lança erro ', async () => {
		prismaMock.user.findUnique.mockResolvedValue(null);
		const userID=9;
		const body={
			password: "123"
		};
		await expect(AdminService.updateAdminPassword(userID,body)).rejects.toThrow(
			new QueryError("Esse usuario não existe.")
		);
		expect(prismaMock.user.update).not.toHaveBeenCalled();
		expect(prismaMock.user.findUnique).toHaveBeenCalledWith({where:{id: userID}});

	});  
});

describe('createByAdmin' , () => {
    test('Admin cria um usuário com sucesso ==> retorna o usuário cadastrado', async () => {
        prismaMock.user.create.mockResolvedValue(user);

        await expect(AdminService.createByAdmin(user)).resolves.toEqual(user);
    });

    test('Tenta cria um usuário com um email já cadastrado ==> gera erro', async () => {
        prismaMock.user.findUnique.mockResolvedValue(user);

        const newUser :any = {
            name: 'usuário2',
            email: 'user@gmail.com',
            password: '12345', 
            photo: null,
            role: 'user'
        };

        prismaMock.user.create.mockRejectedValue(new QueryError("Email já cadastrado.."));

        await expect(AdminService.createByAdmin(newUser)).rejects.toThrow(
            new QueryError("Email já cadastrado..")
        );
    });

    test('usuário informa a senha em um formato errado ==> gera erro', async () => {
        const user2 : any = {
            name: 'usuário',
            email: 'user@gmail.com',
            password: 12345, 
            photo: null,
            role: 'user'
        }

        prismaMock.user.create.mockResolvedValue(user2);

        await expect(AdminService.createByAdmin(user2)).rejects.toThrow(
            new InvalidParamError("A senha está em um formato inválido!")
        );
    });

    test('usuário informa o email em um formato errado ==> gera erro', async () => {
        const user2 : any = {
            name: 'usuário',
            email: 'user.email',
            password: '12345', 
            photo: null,
            role: 'user'
        }

        prismaMock.user.create.mockResolvedValue(user2);

        await expect(AdminService.createByAdmin(user2)).rejects.toThrow(
            new QueryError("Formato de email inválido!")
        );
    });

});