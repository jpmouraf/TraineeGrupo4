import UserService from "./src/domains/User/service/UserService";
import ArtistService from "./src/domains/Artist/service/ArtistService";
import MusicService from "./src/domains/Music/service/MusicService";

async function main() {
    // const body = {
    //     id: 0,
    //     name: "Pedro",
    //     email: "Pedro@gmail.com.br",
    //     photo: null,
    //     password: "123456",
    //     role: "admin"
    // }

    //const user = await UserService.create(body)
    //console.log(user);

    //const findUser = await UserService.getUserbyId(3)
    //console.log(findUser);

    //const findUsers = await UserService.getUsers()
    //console.log(findUsers);

    //const updateUser = await UserService.updateUser(3, body)
    //console.log(updateUser);

    // const deleteUser = await UserService.delete(7)
    // console.log(deleteUser)

    // const newMusic = {
    //     id: 0,
    //     name: "Nome da Música",
    //     genre: "Gênero da Música",
    //     album: "Nome do Álbum",
    //     artistId: 2 
    // };

    //const music = await MusicService.create(newMusic);

    //const findMusic = await MusicService.getMusicbyId(0);
    //console.log(findMusic);

    //const findMusics = await MusicService.getMusics();
    //console.log(findMusics);

    //const updateMusic = await MusicService.updateMusic(0, newMusic)
    //console.log(updateMusic);

    //const deleteMusic = await MusicService.delete(7);
    //console.log(deleteMusic)

    // const deleteArtist = await ArtistService.delete(3);
    // console.log(deleteArtist)

    // const linkUserMusic = await UserService.linkMusic(4, 7);
    // console.log(linkUserMusic);
}

main()