/* eslint-disable quotes */
import UserService from "./UserService";
import { prismaMock } from '../../../../config/singleton';
import { QueryError } from "../../../../errors/QueryError";
import { PermissionError } from "../../../../errors/PermissionError";
import { selectItems } from "./excludeAttributes";
import bcrypt from "bcrypt";

// import { User } from "@prisma/client";
// import { PrismaClient} from "@prisma/client";


const newArtist = {
	id: 0,
	name: "João",
	photo: null,
	streams: 100
};
const music={
	id: 0,
	name: "music",
	genre: "pop",
	album: "hits",
	artistId: newArtist.id
};
const music2={
	id: 2,
	name: "music2",
	genre: "pop",
	album: "hits",
	artistId: newArtist.id,
};
const user={
	id: 0,
	email:'Alice@gmail.com',
	name:'Alice',
	password:'12345',
	photo:null,
	role: 'user',
	music: [music2]
};
const user3={
	id: 3,
	email:'Delete@gmail.com',
	name:'delete',
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
		await expect(UserService.getUsers()).resolves.toEqual(users);
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
	test('Tenta alterar o role de um usuário ==> Lança erro', async () => {


		const body={
			email:'Alice2@gmail.com',
			name:'Alice Silva',
			role:'admin',
			photo: user.photo
		};
		prismaMock.user.update.mockRejectedValue(
			new PermissionError("Você não tem permissão para alterar o role!")
		);
		await expect(UserService.updateUser(user.id, body)).rejects.toEqual(
			new PermissionError("Você não tem permissão para alterar o role!")
		);
    
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
		prismaMock.user.findUnique.mockResolvedValueOnce(user2);
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
describe('LinkUserMusic', () => {
	test('Linka um user com uma musica ==> retorna link', async () => {

		prismaMock.user.findUnique.mockResolvedValueOnce(user); 
		prismaMock.music.findUnique.mockResolvedValueOnce(music);
		prismaMock.user.update.mockResolvedValue(user);
		await expect(UserService.linkMusic(user.id,music.id)).resolves.toEqual(user);
	
		expect(prismaMock.user.update).toHaveBeenCalledWith({
			data: {
				music: {
					connect: {
						id: music.id
					}
				}
			},
			where: {
				id: user.id
			},
			select: selectItems
		});
	});
	test('Tenta linkar usuário com música que não exste ==> Lança erro', async () => {
		prismaMock.user.findUnique.mockResolvedValueOnce(user);
		prismaMock.music.findUnique.mockResolvedValueOnce(null);
		const musicId=9;
		await expect(UserService.linkMusic(user.id,musicId)).rejects.toThrow(
			new QueryError("Música não encontrada!")
		);
		expect(prismaMock.music.findUnique).toHaveBeenCalledWith({where:{id: musicId}});
		expect(prismaMock.user.findUnique).toHaveBeenCalledWith({where:{id: user.id}});

		expect(prismaMock.user.update).not.toHaveBeenCalled();
	});

	test('Tenta linkar música com usuário que não existe ==> Lança erro', async () => {
		const userId=9;
		prismaMock.user.findUnique.mockResolvedValueOnce(null);
		prismaMock.music.findUnique.mockResolvedValueOnce(music);
		await expect(UserService.linkMusic(userId,music.id)).rejects.toThrow(
			new QueryError("Usuário não encontrado!")
		);
		expect(prismaMock.user.findUnique).toHaveBeenCalledWith({where:{id: userId}});
		expect(prismaMock.user.update).not.toHaveBeenCalled();
	});

	test('Tenta ouvir uma música que já está constada como ouvida ==> Lança erro' , async() => {
		prismaMock.user.findUnique.mockResolvedValueOnce(user);
        prismaMock.music.findUnique.mockResolvedValueOnce(music);
        prismaMock.user.findFirst.mockResolvedValueOnce(user);

        await expect(UserService.linkMusic(user.id, music.id)).rejects.toThrow(
            new QueryError("Música já foi ouvida pelo usuário")
        );
	});
});
describe('UnlinkUserMusic', () => {
	test('Remove relacionamento user e music ==> retorna user.', async () => {
		prismaMock.user.findUnique.mockResolvedValueOnce(user); 
		prismaMock.music.findUnique.mockResolvedValueOnce(music);
		prismaMock.user.findFirst.mockResolvedValue(user);
		prismaMock.user.update.mockResolvedValue(user);
		await expect(UserService.unlinkMusic(user.id,music.id)).resolves.toEqual(user);
	
		expect(prismaMock.user.update).toHaveBeenCalledWith({
			data: {
				music: {
					disconnect: {
						id: music.id,
					},
				},
			},
			where: {
				id: user.id,
			},
			select: selectItems
		});
	});
	test('Tenta remover relacionamento de usuário com música que não existe ==> Lança erro', async () => {
		prismaMock.user.findUnique.mockResolvedValueOnce(user);
		prismaMock.music.findUnique.mockResolvedValueOnce(null);
		const musicId=9;
		await expect(UserService.unlinkMusic(user.id,musicId)).rejects.toThrow(
			new QueryError("Música não encontrada!")
		);
		expect(prismaMock.music.findUnique).toHaveBeenCalledWith({where:{id: musicId}});
		expect(prismaMock.user.findUnique).toHaveBeenCalledWith({where:{id: user.id}});
		expect(prismaMock.user.update).not.toHaveBeenCalled();
	});

	test('Tenta remover relacionamento de música com usuário que não exste ==> Lança erro', async () => {
		const userId=9;
		prismaMock.user.findUnique.mockResolvedValueOnce(null);
		prismaMock.music.findUnique.mockResolvedValueOnce(music);
		await expect(UserService.unlinkMusic(userId,music.id)).rejects.toThrow(
			new QueryError("Usuário não encontrado!")
		);
		expect(prismaMock.user.findUnique).toHaveBeenCalledWith({where:{id: userId}});
		expect(prismaMock.user.update).not.toHaveBeenCalled();
	});

	test('Tenta desouvir uma música que não foi escutada ==> Lança erro' , async() => {
		prismaMock.user.findUnique.mockResolvedValueOnce(user);
        prismaMock.music.findUnique.mockResolvedValueOnce(music);
        prismaMock.user.findFirst.mockResolvedValueOnce(null);

        await expect(UserService.unlinkMusic(user.id, music.id)).rejects.toThrow(
            new QueryError("Música não foi ouvida pelo usuário")
        );
	});
});

describe('listenedMusics', () => {
	test('Tenta listar músicas de um usuário que não existe ==> Lança erro', async () => {
		const userId=9;
		prismaMock.user.findUnique.mockResolvedValueOnce(null);
		await expect(UserService.listenedMusics(userId)).rejects.toThrow(
			new QueryError("Usuário não encontrado!")
		);
		expect(prismaMock.user.findUnique).toHaveBeenCalledWith({where:{id: userId}});
		expect(prismaMock.user.findFirst).not.toHaveBeenCalled();
	});
	test('Lista músicas ouvidas por um usuário ==> Retorna músicas', async () => {
		prismaMock.user.findUnique.mockResolvedValueOnce(user);
		prismaMock.user.findFirst.mockResolvedValue(user);
		const listenedMusics= await UserService.listenedMusics(user.id);
		expect(listenedMusics).toEqual(user);
		expect(prismaMock.user.findUnique).toHaveBeenCalledWith({where:{id: user.id}});
		expect(prismaMock.user.findFirst).toHaveBeenCalledWith({
			where: {
				id: user.id,
			},
			select: {
				music: true
			}
		});
	});});

describe('deleteUser', () => {
	test('A conta do usuário é deletada com sucesso ==> Retorna user', async () => {
		prismaMock.user.findUnique.mockResolvedValue(user3);
		prismaMock.user.delete.mockResolvedValue(user3);
		const retorno = await UserService.delete(user3.id);
		expect(retorno).toEqual(user3);
		expect(prismaMock.user.findUnique).toHaveBeenCalledWith({where:{id: user3.id}});

	});
	test('Tenta deletar usuário que não existe ==> Lança erro', async () => {
		prismaMock.user.findUnique.mockResolvedValue(null);
		const userID=9;    
		await expect(UserService.delete(userID)).rejects.toThrow(
			new QueryError("Usuário que deseja deletar não está cadastrado!"));
    
		expect(prismaMock.user.findUnique).toHaveBeenCalledWith({where: {id: userID}});
		expect(prismaMock.user.delete).not.toHaveBeenCalled();
	});
});