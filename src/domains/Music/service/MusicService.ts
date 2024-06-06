import prisma from "../../../../config/prismaClient";
import { Music } from "@prisma/client";
import { QueryError } from "../../../../errors/QueryError";
import { InvalidParamError } from "../../../../errors/InvalidParamError";





class MusicService {
	async create(body: Music) {

		if (typeof body.name !== "string" || typeof body.genre !== "string"||typeof body.album !== "string"|| typeof body.artistId !== "number"){
			throw new InvalidParamError("Os dados inseridos são inválidos!");
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
		if (!musics){
			throw new QueryError("Não existem músicas cadastradas.");
		}
		return musics;

	}

	async updateMusic(id: number, body: Music) {
		if ((typeof body.name !== "string" &&  typeof body.name !== "undefined") || (typeof body.genre !== "string" &&  typeof body.genre !=="undefined") ||(typeof body.album !== "string" && typeof body.album !== "undefined")||(typeof body.artistId !== "number" && typeof body.artistId !== "undefined")){
			throw new InvalidParamError("Os dados inseridos são inválidos!");
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
			throw new QueryError("O id não pode ser modificado");
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