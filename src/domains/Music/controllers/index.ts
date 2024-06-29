import { Router, Request, Response, NextFunction } from "express";
import MusicService from "../service/MusicService";
import { checkRole, verifyJWT } from "../../../middlewares/auth";
import statusCodes from "../../../../utils/constants/statusCodes";


const MusicRouter = Router();

MusicRouter.post("/create", verifyJWT, checkRole(["admin"]), async (req: Request, res: Response, next: NextFunction) => {
	try {
		const body = req.body;
		const newMusic = await MusicService.create(body);
		res.status(statusCodes.CREATED).json(newMusic); 
	} catch (error) {
		
		next(error);
	}
});

MusicRouter.get("/:id", verifyJWT, checkRole(["admin", "user"]), async (req: Request, res: Response, next: NextFunction) => {
	try {
		const music = await MusicService.getMusicbyId(Number(req.params.id));
		res.status(statusCodes.SUCCESS).json(music);
	} catch (error) {
		next(error);
	}
});


MusicRouter.get("/", verifyJWT, checkRole(["admin", "user"]), async (req: Request, res: Response, next: NextFunction) => {
	try {
		const musics = await MusicService.getMusics();
		res.status(statusCodes.SUCCESS).json(musics);
	} catch (error) {
		next(error);
	}  
});

MusicRouter.put("/update/:id", verifyJWT, checkRole(["admin"]), async (req: Request, res: Response, next: NextFunction) => {
	try {
		const body = req.body;
		const updatedMusic = await MusicService.updateMusic(Number(req.params.id), body);
		res.status(statusCodes.SUCCESS).json(updatedMusic);
	} catch (error) {
		next(error);
	}
});

MusicRouter.delete("/delete/:id", verifyJWT, checkRole(["admin"]), async (req: Request, res: Response, next: NextFunction) => {
	try {
		const deletedMusic = await MusicService.delete(Number(req.params.id));
		res.status(statusCodes.SUCCESS).json(deletedMusic);
	} catch (error) {
		next(error);
	}
});

export default MusicRouter;

