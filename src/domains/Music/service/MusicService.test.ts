import { prismaMock } from "../../../../config/singleton";
import { PermissionError } from "../../../../errors/PermissionError";
import { QueryError } from "../../../../errors/QueryError";
import MusicService from "./MusicService";

const music = {
	id: 0,
	name: "Nome da Música",
	genre: "Gênero da Música",
	album: "Álbum da Música",
	artistId: 0
};

const music2 = {
	id: 1,
	name: "Nome da Música 2",
	genre: "Gênero da Música 2",
	album: "Álbum da Música 2",
	artistId: 0
};

const artist = {
	id: 0,
	name: "Nome do Artista",
	photo: null,
	streams: 100000
};

describe("create", () => {

	test("entra com os dados para uma nova música ==> música é criada no banco de dados", async () => {

		prismaMock.artist.findUnique.mockResolvedValue(artist);
		
		prismaMock.music.create.mockResolvedValue(music);

		await expect(MusicService.create(music)).resolves.toEqual(music);
	});

	test("artista da música não existe ==> lança exceção", async () => {
		
		prismaMock.artist.findUnique.mockResolvedValue(null);

		await expect(MusicService.create(music)).rejects.toThrow(
			new QueryError("Esse artista não existe.")
		);
	});
});

describe("getMusicbyId", () => {

	test("entrada com id da música procurada ==> encontra a música procurada", async () => {

		prismaMock.music.findFirst.mockResolvedValue(music);

		await expect(MusicService.getMusicbyId(music.id)).resolves.toEqual(music);
	});

	test("não encontra música com o id especificado no banco de dados ==> lança exceção", async () => {
		
		prismaMock.music.findFirst.mockResolvedValue(null);

		await expect(MusicService.getMusicbyId(music.id)).rejects.toThrow(
			new QueryError("Música não encontrada.")
		);
	});
});

describe("getMusics", () => {

	test("chama a função ==> retorna todas as músicas cadastradas no banco de dados", async () => {
		
		prismaMock.music.findMany.mockResolvedValue([music, music2]);

		await expect(MusicService.getMusics()).resolves.toEqual([music, music2]);
	});

	test("não encontra nenhuma música no banco de dados ==> lança exceção", async () => {
		
		prismaMock.music.findMany.mockResolvedValue([]);

		await expect(MusicService.getMusics()).rejects.toThrow(
			new QueryError("Não existem músicas cadastradas.")
		);
	});
});

describe("updateMusic", () => {

	const updatedMusic = {
		id: 0,
		name: "Novo Nome Música",
		genre: "Gênero da Música",
		album: "Álbum da Música",
		artistId: 0
	};

	const body = {
		name: "Novo Nome Música",
		genre: "Gênero da Música",
		album: "Álbum da Música",
		artistId: 0
	};

	const bodyId = {
		id: 0,
		name: "Novo Nome Música",
		genre: "Gênero da Música",
		album: "Álbum da Música",
		artistId: 0
	};

	test("entrada com os atributos a serem modificados ==> retorno da música com os atributos modificados", async () => {
		
		prismaMock.artist.findUnique.mockResolvedValue(artist);
		
		prismaMock.music.update.mockResolvedValue(updatedMusic);

		await expect(MusicService.updateMusic(music.id, body)).resolves.toEqual(updatedMusic);
	});

	test("não encontra artista do usuário a ser atualizado ==> lança exceção", async () => {
		
		prismaMock.artist.findUnique.mockResolvedValue(null);

		await expect(MusicService.updateMusic(music.id, updatedMusic)).rejects.toThrow(
			new QueryError("Esse artista não existe.")
		);
	});

	test("tenta mudar o id da música ==> lança exceção", async () => {
		
		prismaMock.artist.findUnique.mockResolvedValue(artist);
		
		prismaMock.music.findUnique.mockResolvedValue(null);

		await expect(MusicService.updateMusic(music.id, bodyId)).rejects.toThrow(
			new PermissionError("O id não pode ser modificado")
		);
	});
});

describe("delete", () => {

	test("entrada com o id da música a ser deletada ==> retorna música deletada", async () => {
		
		prismaMock.music.findUnique.mockResolvedValue(music);

		prismaMock.music.delete.mockResolvedValue(music);

		await expect(MusicService.delete(music.id)).resolves.toEqual(music);
	});

	test("não encontra música a ser deletada ==> lança exceção", async () => {
		
		prismaMock.music.findUnique.mockResolvedValue(null);

		await expect(MusicService.delete(music.id)).rejects.toThrow(
			new QueryError("Essa música não existe.")
		);
	});
});

//commit