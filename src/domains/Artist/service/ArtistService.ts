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
            })
        return artist;
    }

    async getArtistbyId(wantedId: number) {
        try {
            const artist = await prisma.artist.findFirst({
                where: {
                    id: wantedId
                }
            })
            return artist;
        } catch (error) {
            console.log("Erro ao procurar o artista", error)
        }
    }

    async getArtists() {
        try {
            const artists = await prisma.artist.findMany({
                orderBy: {
                    name: "asc"
                }
            })
            return artists;
        } catch (error) {
            console.log("Erro ao procurar os artistas", error)
        }
    }

    async updateArtist(id: number, body: Artist) {
        try {
            const updatedArtist = await prisma.artist.update({
                data: {
                    name: body.name,
                    photo: body.photo,
                    streams: body.streams
                },
                where: {
                    id: id
                }
            })
            return updatedArtist;
        } catch (error) {
            console.log("Erro ao atualizar o artista", error)
        }
    }

    async delete(wantedId: number) 
    {
        const artist = await prisma.artist.delete({ where: {id: wantedId}});
        return artist;
    }
}

export default new ArtistService