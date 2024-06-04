/* eslint-disable quotes */
import { Router, Request, Response, NextFunction } from 'express';
import ArtistService from "../service/ArtistService";

const ArtistRouter = Router();

ArtistRouter.post("/create", async (req: Request, res: Response, next: NextFunction) =>{
	try {
        
		const artists = await ArtistService.create(req.body);
		res.json(artists);
        
	} catch (error) {
		next(error);
	}
});

ArtistRouter.get("/:id", async (req: Request, res: Response, next: NextFunction) =>{
	try {
    
		const artists = await ArtistService.getArtistbyId(Number(req.params.id));
		res.json(artists);
    
	} catch (error) {
		next(error);
	}
});


ArtistRouter.get("/", async (req: Request, res: Response, next: NextFunction) =>{
	try {

		const artists = await ArtistService.getArtists();
		res.json(artists);

	} catch (error) {
		next(error);
	}
});

ArtistRouter.put("/update/:id", async (req: Request, res: Response, next: NextFunction) =>{
	try {
            
		const artists = await ArtistService.updateArtist(Number(req.params.id), req.body);
		res.json(artists);
            
	} catch (error) {
		next(error);
	}
});


ArtistRouter.delete("/delete/:id", async (req: Request, res: Response, next: NextFunction) =>{
	try {
                
		const artists = await ArtistService.delete(Number(req.params.id));
		res.json(artists);
                
	} catch (error) {
		next(error);
	}
});


export default ArtistRouter;