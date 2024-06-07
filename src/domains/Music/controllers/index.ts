

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Router, Request, Response, NextFunction } from "express";
import MusicService from "../service/MusicService";
import { checkRole, verifyJWT } from "../../../middlewares/auth";

const MusicRouter = Router();

MusicRouter.post("/create", verifyJWT, checkRole(["admin"]), async (req: Request, res: Response, next: NextFunction) => {
	try {
		const body = req.body;
		const newMusic = await MusicService.create(body);
		res.json(newMusic); 
	} catch (error) {
		next(error);
	}
});

MusicRouter.get("/:id", verifyJWT, checkRole(["admin", "user"]), async (req: Request, res: Response, next: NextFunction) => {
	try {
		const music = await MusicService.getMusicbyId(Number(req.params.id));
		res.json(music);
	} catch (error) {
		next(error);
	}
});


MusicRouter.get("/", verifyJWT, checkRole(["admin", "user"]), async (req: Request, res: Response, next: NextFunction) => {
	try {
		const musics = await MusicService.getMusics();
		res.json(musics);
	} catch (error) {
		next(error);
	}  
});

MusicRouter.put("/update/:id", verifyJWT, checkRole(["admin"]), async (req: Request, res: Response, next: NextFunction) => {
	try {
		const body = req.body;
		const updatedMusic = await MusicService.updateMusic(Number(req.params.id), body);
		res.json(updatedMusic);
	} catch (error) {
		next(error);
	}
});

MusicRouter.delete("/delete/:id", verifyJWT, checkRole(["admin"]), async (req: Request, res: Response, next: NextFunction) => {
	try {
		const deletedMusic = await MusicService.delete(Number(req.params.id));
		res.json(deletedMusic);
	} catch (error) {
		next(error);
	}
});

export default MusicRouter;

