/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router, Request, Response, NextFunction } from "express";
import UserService from "../../User/service/UserService";
import ArtistService from "../../Artist/service/ArtistService";
import MusicService from "../../Music/service/MusicService";
import { notLoggedIn, login, verifyJWT, logout } from "../../../middlewares/auth";
import { checkRole } from "../../../middlewares/auth";

const AdminRouter = Router();
AdminRouter.post("/login", notLoggedIn, login);
AdminRouter.post("/logout", verifyJWT, logout);

AdminRouter.put("/update/:id", checkRole(["admin"]), verifyJWT,async (req: Request, res: Response, next: NextFunction) => {
	try {
        
		const body = req.body;
		const user = await UserService.updateUser(Number(req.params.id), body);
		res.json(user);

	} catch (error) {
        
		next(error);

	}
});

AdminRouter.delete("/unlinkUserMusic/:idUser/:idMusic",checkRole(["admin"]),verifyJWT, async (req: Request, res: Response, next: NextFunction) => {
	try {
        
		const unlink = await UserService.unlinkMusic(Number(req.params.idUser), Number(req.params.idMusic));
		res.json(unlink);

	} catch (error) {
	    next(error);
	}
});

















export default AdminRouter;