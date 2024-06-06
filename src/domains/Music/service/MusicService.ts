import prisma from "../../../../config/prismaClient";
import { Music } from "@prisma/client";
import { PermissionError } from "../../../../errors/PermissionError";
import { QueryError } from "../../../../errors/QueryError";
import { TokenError } from "../../../../errors/TokenError";
import { NotAuthorizedError } from "../../../../errors/NotAuthorizedError";
import { LoginError } from "../../../../errors/LoginError";
import { InvalidRouteError } from "../../../../errors/InvalidRouteError";
import { InvalidParamError } from "../../../../errors/InvalidParamError";





class MusicService {
	async create(body: Music) {

		if (typeof body.name !== "string" || typeof body.genre !== "string"||typeof body.album !== "string"|| typeof body.artistId !== "number"){
			throw new InvalidParamError("Os dados inseridos são inválidos!");
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
		return music;

	}

	async getMusics() {

		const musics = await prisma.music.findMany({
			orderBy: {
				name: "asc",
			}
		});
		return musics;

	}

	async updateMusic(id: number, body: Music) {

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

	}

	async delete(wantedId: number) 
	{
		const music = await prisma.music.delete({ where: {id: wantedId}});
		return music;
	}
}

export default new MusicService();