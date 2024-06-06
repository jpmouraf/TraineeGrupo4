/* eslint-disable quotes */
import { Router, Request, Response, NextFunction } from 'express';
import ArtistService from "../service/ArtistService";
import { checkRole, verifyJWT } from '../../../middlewares/auth';
import statusCodes from '../../../../utils/constants/statusCodes';

const ArtistRouter = Router();

ArtistRouter.post("/create", verifyJWT, checkRole(["admin"]), async (req: Request, res: Response, next: NextFunction) =>{
	try {
        
		const artists = await ArtistService.create(req.body);
		res.status(statusCodes.CREATED).json(artists);
        
	} catch (error) {
		next(error);
	}
});

ArtistRouter.get("/:id", verifyJWT, checkRole(["admin", "user"]), async (req: Request, res: Response, next: NextFunction) =>{
	try {
    
		const artists = await ArtistService.getArtistbyId(Number(req.params.id));
		res.status(statusCodes.SUCCESS).json(artists);
    
	} catch (error) {
		next(error);
	}
});


ArtistRouter.get("/", verifyJWT, checkRole(["admin", "user"]), async (req: Request, res: Response, next: NextFunction) =>{
	try {

		const artists = await ArtistService.getArtists();
		res.status(statusCodes.SUCCESS).json(artists);

	} catch (error) {
		next(error);
	}
});

ArtistRouter.put("/update/:id", verifyJWT, checkRole(["admin"]), async (req: Request, res: Response, next: NextFunction) =>{
	try {
            
		const artists = await ArtistService.updateArtist(Number(req.params.id), req.body);
		res.status(statusCodes.SUCCESS).json(artists);
            
	} catch (error) {
		next(error);
	}
});


ArtistRouter.delete("/delete/:id", verifyJWT, checkRole(["admin"]), async (req: Request, res: Response, next: NextFunction) =>{
	try {
                
		const artists = await ArtistService.delete(Number(req.params.id));
		res.status(statusCodes.SUCCESS).json(artists);
                
	} catch (error) {
		next(error);
	}
});

ArtistRouter.get("/musics/:id", verifyJWT, checkRole(["admin","user"]), async (req: Request, res: Response, next: NextFunction) => {
	try {
		
		const musics = await ArtistService.listArtistMusics(Number(req.params.id));
		res.status(statusCodes.SUCCESS).json(musics);

	} catch (error) {
		
		next(error);

	}
});


export default ArtistRouter;