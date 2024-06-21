/* eslint-disable quotes */
import UserService from "./UserService";
import { prismaMock } from '../../../../config/singleton';
import { QueryError } from "../../../../errors/QueryError";
import { PermissionError } from "../../../../errors/PermissionError";
import { selectItems } from "./excludeAttributes";

// import { User } from "@prisma/client";
// import { PrismaClient} from "@prisma/client";
describe('User-create', () =>{
	test('O usuário é criado corretamente ==> retorna o usuário', async()=>{
		const user={
			id: 0,
			email:'Alice@gmail.com',
			name:'Alice',
			password:'12345',
			photo:null,
			role: 'user' 
		};
		prismaMock.user.create.mockResolvedValue(user);
		await expect(UserService.create(user)).resolves.toEqual({
			id:0,
			email:'Alice@gmail.com',
			name:'Alice',
			password:'12345',
			photo: null,
			role:"user"
		});

	});

	test('Usuário tenta cadastrar com email já existente ==> lança erro', async()=>{
		const user={
			id: 1,
			email:'Alice@gmail.com',
			name:'Alice',
			password:'12345',
			photo:null,
			role: 'user' 
		};
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
		const user={
			id: 1,
			email:'Alice@gmail.com',
			name:'Alice',
			password:'12345',
			photo:null,
			role: 'user' 
		};
		prismaMock.user.findFirst.mockResolvedValue(user);
		await expect(UserService.getUserbyId(user.id)).resolves.toEqual({
			id:1,
			email:'Alice@gmail.com',
			name:'Alice',
			password:'12345',
			photo: null,
			role:"user"   
		});
		expect(prismaMock.user.findFirst).toHaveBeenCalledWith({
			where:{id: user.id}, select: selectItems
		});
	});
});

describe('GetUsers', () => {
	test('Tenta listar todos os usuários ==> retorna os usuários', async () => {
		const users=[{
			id: 1,
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
		}];
		prismaMock.user.findMany.mockResolvedValue(users);
		await expect(UserService.getUsers()).resolves.toEqual([{
			id: 1, 
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
		const user={
			id: 1,
			email:'Alice@gmail.com',
			name:'Alice',
			password:'12345',
			photo:null,
			role: 'user' 
		};
		const user2={
			id: 1,
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
			id: 1,
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
        const user={
			id: 1,
			email:'Alice@gmail.com',
			name:'Alice',
			password:'12345',
			photo:null,
			role: 'user' 
		};

		const body={
            id: 3,
			email:'Alice2@gmail.com',
			name:'Alice Silva', 
			photo: user.photo
		};
                prismaMock.user.update.mockRejectedValue(new PermissionError("ID não pode ser alterado!"));
		await expect(UserService.updateUser(user.id, body)).rejects.toEqual(new Per"ID não pode ser alterado!");
    
            expect(prismaMock.user.update).not.toHaveBeenCalled();
    });
});
