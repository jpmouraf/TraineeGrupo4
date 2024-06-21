// import UserService from "./src/domains/User/service/UserService";
// import ArtistService from "./src/domains/Artist/service/ArtistService";
// import MusicService from "./src/domains/Music/service/MusicService";

// async function main() {
//     // const body = {
//     id: 0,
//     name: "Pedro",
//     email: "pedro@gmail.com",
//     photo: null,
//     password: "123456",
//     role: "admin"
//     // }

//     // const user = await UserService.create(body)
//     // console.log(user);

//     // const findUser = await UserService.getUserbyId()
//     // console.log(findUser);

//     // const findUsers = await UserService.getUsers()
//     // console.log(findUsers);

//     // const updateUser = await UserService.updateUser(, body)
//     // console.log(updateUser);

//     // const deleteUser = await UserService.delete()
//     // console.log(deleteUser)

//     // const newArtist = {
//     //     id: 0,
//     //     name: "João",
//     //     photo: null,
//     //     streams: 100
//     // }

//     // const createArtist = await ArtistService.create(newArtist);
//     // console.log(createArtist);

//     // const getArtistbyId = await ArtistService.getArtistbyId()
//     // console.log(getArtistbyId);

//     // const getArtists = await ArtistService.getArtists();
//     // console.log(getArtists);

//     // const updateArtists = await ArtistService.updateArtist(, newArtist);
//     // console.log(updateArtists);

//     // const deleteArtist = await ArtistService.delete(5);
//     // console.log(deleteArtist);

//     // const newMusic = {
//     //     id: 0,
//     //     name: "Nome da Música",
//     //     genre: "Gênero da Música",
//     //     album: "Nome do Álbum",
//     //     artistId: 3 
//     // };

//     // const music = await MusicService.create(newMusic);
//     // console.log(music);

//     // const findMusic = await MusicService.getMusicbyId();
//     // console.log(findMusic);

//     // const findMusics = await MusicService.getMusics();
//     // console.log(findMusics);

//     // const updateMusic = await MusicService.updateMusic(, newMusic)
//     // console.log(updateMusic);

//     // const deleteMusic = await MusicService.delete();
//     // console.log(deleteMusic);

//     // const linkUserMusic = await UserService.linkMusic();
//     // console.log(linkUserMusic);
// }

// main()

import { app } from "./config/expressConfig";
import dotenv from "dotenv";

dotenv.config();

app.listen(process.env.PORT, () => {
	console.log("Servidor hosteado na porta " + process.env.PORT);
});