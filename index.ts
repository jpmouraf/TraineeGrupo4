import UserService from "./src/domains/User/service/UserService";
import ArtistService from "./src/domains/Artist/service/ArtistService";
import MusicService from "./src/domains/Music/service/MusicService";

async function main() {
    // const body = {
    //     id: 0,
    //     name: "Pedro",
    //     email: "pedro@gmail.com",
    //     photo: null,
    //     password: "123456",
    //     role: "admin"
    // }

    // const user = await UserService.create(body)
    // console.log(user);

    //const findUser = await UserService.getUserbyId(5)
    //console.log(findUser);

    //const findUsers = await UserService.getUsers()
    //console.log(findUsers);

    // const updateUser = await UserService.updateUser(, body)
    // console.log(updateUser);

    // const deleteUser = await UserService.delete()
    // console.log(deleteUser)

    const newArtist = {
        id: 0,
        name: "Bruno",
        photo: null,
        streams: 150
 }

    //const createArtist = await ArtistService.create(newArtist);
    //console.log(createArtist);

    //const getArtistbyId = await ArtistService.getArtistbyId(5)
    //console.log(getArtistbyId);

    //const getArtists = await ArtistService.getArtists();
    //console.log(getArtists);

    //const updateArtists = await ArtistService.updateArtist(5 , newArtist);
    //console.log(updateArtists);

    // const deleteArtist = await ArtistService.delete(5);
    // console.log(deleteArtist);

    const newMusic = {
        id: 0,
        name: "Galooo",
        genre: "Rap",
        album: "Always",
        artistId: 5 
 };

    //const music = await MusicService.create(newMusic);
    //console.log(music);

    //const findMusic = await MusicService.getMusicbyId(8);
    //console.log(findMusic);

    //const findMusics = await MusicService.getMusics();
    //console.log(findMusics);

    //const updateMusic = await MusicService.updateMusic(8, newMusic)
    //console.log(updateMusic);

    //const deleteMusic = await MusicService.delete(7);
    //console.log(deleteMusic);

    //const linkUserMusic = await UserService.linkMusic(5, 8);
    //console.log(linkUserMusic);
}

main()