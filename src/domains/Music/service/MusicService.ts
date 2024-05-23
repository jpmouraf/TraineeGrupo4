import prisma from "../../../../config/prismaClient";
import { Music } from "@prisma/client";

class MusicService 
{
    async create(body: Music) 
    {
        await prisma.music.create
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
        })
    }
}

export default new MusicService();