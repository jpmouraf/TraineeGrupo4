/* eslint-disable no-unexpected-multiline */
import prisma from "../../../../config/prismaClient";
import { Artist } from "@prisma/client";

class ArtistService {
	async create(body: Artist) {
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
		return artist;
	}

	async getArtists() {

		const artists = await prisma.artist.findMany({
			orderBy: {
				name: "asc"
			}
		});
		return artists;

	}

	async updateArtist(id: number, body: Artist) {
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
		const artist = await prisma.artist.delete({ where: {id: wantedId}});
		return artist;
	}
}

export default new ArtistService;