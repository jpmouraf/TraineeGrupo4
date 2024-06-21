/* eslint-disable quotes */
import UserService from "./UserService";
import { prismaMock } from '../../../../config/singleton';
import { QueryError } from "../../../../errors/QueryError";
import { PermissionError } from "../../../../errors/PermissionError";
import { selectItems } from "./excludeAttributes";
import bcrypt from "bcrypt";

// import { User } from "@prisma/client";
// import { PrismaClient} from "@prisma/client";
const user={
	id: 0,
	email:'Alice@gmail.com',
	name:'Alice',
	password:'12345',
	photo:null,
	role: 'user' 
};

jest.mock('bcrypt');
describe('Encrypt password', () => {
	test('Tenta encriptar a senha ==> retorna encrypted', async () => {
		const password= "12345";
		const encrypted='encrypted';
		const saltRounds=10;
		(bcrypt.hash as jest.Mock).mockResolvedValue(encrypted);
		await expect(UserService.encryptPassword(password)).resolves.toEqual(encrypted);
		expect(bcrypt.hash).toHaveBeenCalledWith(password, saltRounds);
	});
});
describe('User-create', () =>{
	test('O usuário é criado corretamente ==> retorna o usuário', async()=>{
		const encrypted2 = await UserService.encryptPassword(user.password);
		const user2={
			id: user.id,
			email: user.email,
			name:user.name,
			password:encrypted2,
			photo:user.photo,
			role: user.role 
		};
		prismaMock.user.create.mockResolvedValue(user2);
		await expect(UserService.create(user2)).resolves.toEqual(user2);
		expect(prismaMock.user.create).toHaveBeenCalledWith({data: {
			email: user.email,
			name: user.name,
			password: encrypted2,
			photo: user.photo,
			role: "user",
		}});

	});

	test('Usuário tenta cadastrar com email já existente ==> lança erro', async()=>{
		const user2={
			id: 1,
			email:'Alice@gmail.com',
			name:'Alice Silva',
			password:'12345',
			photo:null,
			role: 'user' 
		};
		prismaMock.user.findUnique.mockResolvedValue(user); 
		await expect(UserService.create(user2)).rejects.toThrow(
			new QueryError("Email já cadastrado!")
		);
		expect(prismaMock.user.findUnique).toHaveBeenCalledWith({where:{email: user.email}});
		expect(prismaMock.user.create).not.toHaveBeenCalled();
	});

});
describe('GetUsersbyId', () => {
	test('Tenta achar um usuário inexistente ==> Lança erro', async () => {
		prismaMock.user.findFirst.mockResolvedValue(null);
		await expect(UserService.getUserbyId(9)).rejects.toThrow(
			new QueryError("Usuário não cadastrado!")
		);
		expect(prismaMock.user.findFirst).toHaveBeenCalledWith({where:{id: 9},select:selectItems});
	});
	test('Tenta achar um usuário que existe ==> retorna usuário', async () => {

		prismaMock.user.findFirst.mockResolvedValue(user);
		await expect(UserService.getUserbyId(user.id)).resolves.toEqual(user);
		expect(prismaMock.user.findFirst).toHaveBeenCalledWith({
			where:{id: user.id}, select: selectItems
		});
	});
});

describe('GetUsers', () => {
	test('Tenta listar todos os usuários ==> retorna os usuários', async () => {
		const users=[user,
			{
				id: 1,
				email:'Julia@gmail.com',
				name:'Julia Silva',
				password:'12345',
				photo:null,
				role: 'user' 
			}];
		prismaMock.user.findMany.mockResolvedValue(users);
		await expect(UserService.getUsers()).resolves.toEqual([{
			id: 0, 
			email:'Alice@gmail.com', 
			name:'Alice', 
			password:'12345',
			photo:null,
			role: 'user'
		},
		{
			id: 1,
			email:'Julia@gmail.com',
			name:'Julia Silva',
			password:'12345',
			photo:null,
			role: 'user'
		}]);
		expect(prismaMock.user.findMany).toHaveBeenCalledWith({
			orderBy: {
				name: "asc",
			},
			select: selectItems
		});
		expect(prismaMock.user.findMany).toHaveBeenCalledTimes(1);


	});
	test('Tenta listar usuários mas nenhum está cadastrado ==> Lança erro', async () => {
		prismaMock.user.findMany.mockResolvedValue([]);
		await expect(UserService.getUsers()).rejects.toThrow(
			new QueryError("Nenhum usuário cadastrado!")
		);
		expect(prismaMock.user.findMany).toHaveBeenCalledTimes(1);

	});
    
});
describe('updateUser', () => {
	test('Tenta atualizar usuário ==> retorna usuário atualizado', async () => {

		const user2={
			id: 0,
			email:'Alice2@gmail.com',
			name:'Alice Silva',
			password:'12345',
			photo:null,
			role: 'user' 
		};
		const body={
			email:'Alice2@gmail.com',
			name:'Alice Silva', 
			photo: user.photo
		};
		prismaMock.user.update.mockResolvedValue(user2);
		await expect(UserService.updateUser(user.id, body)).resolves.toEqual({
			id: 0,
			email:'Alice2@gmail.com',
			name:'Alice Silva',
			password:'12345',
			photo:null,
			role: 'user' 
		});
		expect(prismaMock.user.update).toHaveBeenCalledWith({ data: {
			email: body.email,
			name: body.name,
			photo: body.photo,
			role: "user",
		},
		where: {
			id: user.id,
		}});
	});

	test('Tenta alterar o ID de um usuário ==> Lança erro', async () => {


		const body={
			id: 3,
			email:'Alice2@gmail.com',
			name:'Alice Silva', 
			photo: user.photo
		};
		prismaMock.user.update.mockRejectedValue(new PermissionError("ID não pode ser alterado!"));
		await expect(UserService.updateUser(user.id, body)).rejects.toEqual(new PermissionError("ID não pode ser alterado!"));
    
		expect(prismaMock.user.update).not.toHaveBeenCalled();
	});
});
describe('UpdateUserPassword', () => {
	test('Atualiza senha com sucesso ==> retorna senha', async () => {

		const body={
			password: "123"
		};

		const encrypted2 = await UserService.encryptPassword(body.password);
		const user2={
			id: user.id,
			email: user.email,
			name:user.name,
			password:encrypted2,
			photo:user.photo,
			role: user.role 
		};
		prismaMock.user.update.mockResolvedValue(user2);
		await expect(UserService.updateUserPassword(user.id, body)).resolves.toEqual(user2);
		expect(prismaMock.user.update).toHaveBeenCalledWith({
			data: {
				password: encrypted2
			},
			where: {
				id: user.id,
			}
		});
	});
});
describe('Name of the group', () => {
    
});