/* eslint-disable no-unexpected-multiline */
import prisma from "../../../../config/prismaClient";
import { Artist } from "@prisma/client";
import { NotAuthorizedError } from "../../../../errors/NotAuthorizedError";
import { InvalidParamError } from "../../../../errors/InvalidParamError";
import { QueryError } from "../../../../errors/QueryError";

class ArtistService {
	async create(body: Artist) {

		if(!body.name){
			throw new InvalidParamError("Deve-se constar o nome do artista para ele ser cadastrado.");
		}
		if(!body.streams){
			throw new InvalidParamError("Deve-se constar o número de streams do artista");
		}
		if(typeof body.name != "string"){
			throw new InvalidParamError("O nome do artista deve ser uma string.");
		}
		if(typeof body.streams != "number"){
			throw new InvalidParamError("O número de streams do artista deve ser um número.");
		}
		if(typeof body.photo != "string"){
			throw new InvalidParamError("O foto inserida está no formato errado.");
		}

		const artist = await prisma.artist.create
		({
			data: {
				name: body.name,
				photo: body.photo,
				streams: body.streams,
			}
		});
		return artist;
	}

	async getArtistbyId(wantedId: number) {

		const artist = await prisma.artist.findFirst({
			where: {
				id: wantedId
			}
		});

		if(!artist){
			throw new QueryError("O artista que você está buscando não está cadastrado");
		}

		return artist;
	}

	async getArtists() {

		const artists = await prisma.artist.findMany({
			orderBy: {
				name: "asc"
			}
		});

		if(!artists){
			throw new QueryError("Não há nenhum artista cadastrado.");
		}

		return artists;

	}

	async updateArtist(id: number, body: Artist) {

		if(body.id){
			throw new NotAuthorizedError("Você não tem autorização para realizar essas mudanças.");
		}
		if(typeof body.name != "string" && typeof body.name != "undefined"){
			throw new InvalidParamError("O nome colocado deve ser uma string.");
		}
		if(typeof body.photo != "string" && typeof body.photo != "undefined"){
			throw new InvalidParamError("A foto adicionado está no formato errado.");
		}
		if(typeof body.streams != "number" && typeof body.streams != "undefined"){
			throw new InvalidParamError("O nome colocado deve ser uma string.");
		}

		const checkArtist = await prisma.artist.findUnique({
			where: {
				id: id,
			}
		});

		if(!checkArtist){
			throw new InvalidParamError("O artista procurado não está cadastrado.");
		}

		const updatedArtist = await prisma.artist.update({
			data: {
				name: body.name,
				photo: body.photo,
				streams: body.streams
			},
			where: {
				id: id
			}
		});
		return updatedArtist;
	}

	async delete(wantedId: number) 
	{
		const checkArtist = await prisma.artist.findUnique({
			where: {
				id: wantedId,
			}
		});

		if(!checkArtist){
			throw new InvalidParamError("Você não pode deletar um artista que não está cadastrado.");
		}
		
		const artist = await prisma.artist.delete({ where: {id: wantedId}});
		return artist;
	}

	async listArtistMusics(wantedId: number) {

		const checkArtist = await prisma.artist.findUnique({
			where: {
				id: wantedId,
			}
		});

		if(!checkArtist){
			throw new InvalidParamError("O artista das músicas buscadas não está cadastrado.");
		}

		const musics = await prisma.artist.findFirst({
			where: {
				id: wantedId,
			},
			select: {
				music: true,
			},
			orderBy: {
				name: "asc",
			}

		});

		return musics;
	}
}

export default new ArtistService;