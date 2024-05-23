import prisma from "../../../../config/prismaClient";
import { Artist } from "@prisma/client";

class ArtistService
{
    async create(body: Artist) 
    {
        await prisma.artist.create
        ({
            data: {
                name: body.name,
                photo: body.photo,
                streams: body.streams,
            }
        })
    }
}

export default new ArtistService