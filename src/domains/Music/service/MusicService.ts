import prisma from "../../../../config/prismaClient";
import { Music } from "@prisma/client";

class MusicService {
	async create(body: Music) {
		const music = await prisma.music.create
		({
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
		try {
			const music = await prisma.music.findFirst({
				where: {
					id: wantedId
				}
			});
			return music;
		} catch (error) {
			console.log("Erro ao procurar a música", error);
		}
	}

	async getMusics() {
		try {
			const musics = await prisma.music.findMany({
				orderBy: {
					name: "asc",
				}
			});
			return musics;
		} catch (error) {
			console.log("Erro ao procurar as músicas", error);
		}
	}

	async updateMusic(id: number, body: Music) {
		try {
			const updatedMusic = await prisma.music.update({
				data: {
					name: body.name,
					genre: body.genre,
					album: body.album
				},
				where: {
					id: id,
				}
			});
			return updatedMusic;
		} catch (error) {
			console.log("Erro ao atualizar a música", error);
		}
	}

	async delete(wantedId: number) 
	{
		const music = await prisma.music.delete({ where: {id: wantedId}});
		return music;
	}
}

export default new MusicService();