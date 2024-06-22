import prisma from "../../../../config/prismaClient";
import { Music } from "@prisma/client";
import { QueryError } from "../../../../errors/QueryError";
import { InvalidParamError } from "../../../../errors/InvalidParamError";
import { PermissionError } from "../../../../errors/PermissionError";





class MusicService {
	async create(body: Music) {

		if (typeof body.name !== "string"){
			throw new InvalidParamError("O nome inserido está em um formato inválido!");
		}
		if ( typeof body.genre !== "string"){
			throw new InvalidParamError("O gênero inserido está em um formato inválido!");
		}
		if ( typeof body.album !== "string"){
			throw new InvalidParamError("O álbum inserido está em um formato inválido!");
		}
		if ( typeof body.artistId !== "number"){
			throw new InvalidParamError("O id do artista está em um formato inválido!");
		}
		const checkArtist = await prisma.artist.findUnique({
			where: {
				id: body.artistId
			}
		});
		if (!checkArtist){
			throw new QueryError("Esse artista não existe.");
		}
		
		const music = await prisma.music.create({
			data: {
				name: body.name,
				genre: body.genre,
				album: body.album,
				artist: {
					connect: {
						id: body.artistId,
					},
				}
			}
		});
		return music;
	}

	async getMusicbyId(wantedId: number) {
	
		const music = await prisma.music.findFirst({
			where: {
				id: wantedId
			}
		});

		if (!music){
			throw new QueryError("Música não encontrada.");
		}

		return music;

	}

	async getMusics() {

		const musics = await prisma.music.findMany({
			orderBy: {
				name: "asc",
			}
		});
		if (musics.length == 0){
			throw new QueryError("Não existem músicas cadastradas.");
		}
		return musics;

	}

	async updateMusic(id: number, body: Partial<Music>) {
		if ((typeof body.name !== "string" &&  typeof body.name !== "undefined")){
			throw new InvalidParamError("O nome inseridos está em um formato inválido!");
		}
		if ( (typeof body.genre !== "string" &&  typeof body.genre !=="undefined") ){
			throw new InvalidParamError("O gênero inserido está em um formato inválido!");
		}
		if ((typeof body.album !== "string" && typeof body.album !== "undefined")){
			throw new InvalidParamError("O álbum inserido está em um formato inválido!");
		}
		if ((typeof body.artistId !== "number" && typeof body.artistId !== "undefined")){
			throw new InvalidParamError("O Id de artista inserido está em um formato inválido!");
		}
		if (body.artistId != undefined){
			const checkArtist = await prisma.artist.findUnique({
				where: {
					id: body.artistId
				}
			});
			if (!checkArtist){
				throw new QueryError("Esse artista não existe.");
			}
		}
		if (body.id !== undefined){
			throw new PermissionError("O id não pode ser modificado");
		}
		const updatedMusic = await prisma.music.update({
			data: {
				name: body.name,
				genre: body.genre,
				album: body.album,
				artistId: body.artistId
			},
			where: {
				id: id,
			}
		});
		return updatedMusic;

	}


	async delete(wantedId: number) 
	{
		const checkMusic = await prisma.music.findUnique({
			where: {
				id: wantedId
			}
		});
		if (!checkMusic){
			throw new QueryError("Essa música não existe.");
		}

		const music = await prisma.music.delete({ where: {id: wantedId}});
		return music;
	}
}

export default new MusicService();