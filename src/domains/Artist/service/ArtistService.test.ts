import { prismaMock } from '../../../../config/singleton';
import { InvalidParamError } from '../../../../errors/InvalidParamError';
import { QueryError } from "../../../../errors/QueryError";
import ArtistService from './ArtistService';

describe('ArtistService - create', () => {
    test('deve criar um novo artista', async () => {
        const artist = {
            id: 1,
            name: "cantor",
            photo: null,
            streams: 1000
        };

        prismaMock.artist.create.mockResolvedValue(artist);

        await expect(ArtistService.create(artist)).resolves.toEqual({
            id: 1,
            name: "cantor",
            photo: null,
            streams: 1000
        });
    });

    test('o nome do artista não é fornecido para cadastro ==> lança exceção', async () => {
        const artist = {
            id: 1,
            name: '',
            photo: null,
            streams: 1000
        };

        await expect(ArtistService.create(artist)).rejects.toThrow(
            new InvalidParamError("Deve-se constar o nome do artista para ele ser cadastrado.")
        );
    });

    test('o número de streams não é fornecido ==> lança exceção', async () => {
        const artist : any = {
            id: 1,
            name: 'cantor',
            photo: null,
            streams: null
        };

        await expect(ArtistService.create(artist)).rejects.toThrow(
            new InvalidParamError("Deve-se constar o número de streams do artista")
        );
    });

    test('o nome do artista não é uma string ==> lança exceção', async () => {
        const artist : any = {
            id: 1,
            name: 10,
            photo: null,
            streams: 1000
        };

        await expect(ArtistService.create(artist)).rejects.toThrow(
            new InvalidParamError("O nome do artista deve ser uma string.")
        );
    });
});

    test('o número de streams deve ser um número inteiro ==> lança exceção', async () => {
        const artist : any = {
            id: 1,
            name: 'cantor',
            photo: null,
            streams: 'mil'
        };

        await expect(ArtistService.create(artist)).rejects.toThrow(
            new InvalidParamError("O número de streams do artista deve ser um número.")
        )
    });

    test('a foto não esta no formato string ou não é nula ==> lança exceção', async () => {
        const artist : any = {
            id: 1,
            name: 'cantor',
            photo: 10,
            streams: 1000
        };

        await expect(ArtistService.create(artist)).rejects.toThrow(
            new InvalidParamError("O foto inserida está no formato errado.")
        )
    });

describe('getArtistbyId' , () => {
    test('um usuário cadastrado com seu id ==> retorna o usuário', async () => {
        const artist = {
            id: 1,
            name: 'cantor',
            photo: null,
            streams: 1000
        };

        prismaMock.artist.findFirst.mockResolvedValue(artist)

        await expect(ArtistService.getArtistbyId(1)).resolves.toEqual(artist);
    });

    test('tenta buscar um usuário inexistente ==> gera erro', async () => {
        const artistId = 1;
        prismaMock.artist.findFirst.mockResolvedValue(null)

        await expect(ArtistService.getArtistbyId(artistId)).rejects.toThrow(
            new QueryError("O artista que você está buscando não está cadastrado")
        );

        expect(prismaMock.artist.findFirst).toHaveBeenCalledWith({where: {id: artistId}})
    });
    
});

describe('getArtists' , () => {
    test('dois usuários estão cadastrados ==> retorna dois usuários', async () => {
        const firstUser = {
            id: 1,
            name: 'cantor',
            photo: null,
            streams: 1000
        };
        const secondUser = {
            id: 2,
            name: 'vocalista',
            photo: null,
            streams: 2000
        };

        prismaMock.artist.findMany.mockResolvedValue([firstUser, secondUser]);

        const artists = await ArtistService.getArtists();

        expect(artists).toEqual([firstUser, secondUser]);
    });

    test('nao há nenhum usuário cadastrado ==> gera erro', async () => {
        prismaMock.artist.findFirst.mockResolvedValue(null);

        await expect(ArtistService.getArtists()).rejects.toThrow(
            new QueryError("Não há nenhum artista cadastrado.")
        )
    });

});

describe('updateArtist' , () => {

});

describe('delete' , () => {

});

describe('listArtistMusics' , () => {

});