import { Router, Request, Response, NextFunction, response } from "express";
import MusicService from "../service/MusicService";

const MusicRouter = Router();

MusicRouter.post("/create", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = req.body;
        const newMusic = await MusicService.create(body);
        res.json(newMusic); 
    } catch (error) {
        next(error);
    }
});

MusicRouter.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const music = await MusicService.getMusicbyId(Number(req.params.id));
        res.json(music);
    } catch (error) {
        next(error);
    }
});


MusicRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
   try {
        const musics = await MusicService.getMusics();
        res.json(musics);
   } catch (error) {
       next(error);
   }  
});

MusicRouter.put("/update/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = req.body;
        const updatedMusic = await MusicService.updateMusic(Number(req.params.id), body);
        res.json(updatedMusic);
    } catch (error) {
        next(error);
    }
});

MusicRouter.delete("/delete/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deletedMusic = await MusicService.delete(Number(req.params.id));
        res.json(deletedMusic);
    } catch (error) {
        next(error);
    }
})

export default MusicRouter;

