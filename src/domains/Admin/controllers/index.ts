/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router, Request, Response, NextFunction } from "express";
import UserService from "../../User/service/UserService";
import ArtistService from "../../Artist/service/ArtistService";
import MusicService from "../../Music/service/MusicService";
import { notLoggedIn, login, verifyJWT, logout } from "../../../middlewares/auth";
import { checkRole } from "../../../middlewares/auth";
import AdminService from "../service/AdminService";

const AdminRouter = Router();
AdminRouter.post("/login", notLoggedIn, login);
AdminRouter.post("/logout", verifyJWT, logout);

AdminRouter.post("/account/create",checkRole(["admin"]),verifyJWT, async (req: Request, res: Response, next: NextFunction) => {
	try {

		const body = req.body;
		const newUser = await AdminService.createByAdmin(body);
		res.json(newUser);

	} catch (error) {

		next(error);

	}
});

AdminRouter.get("/account",checkRole(["admin"]),verifyJWT, async (req: Request, res: Response, next: NextFunction) => {
	try {
        
		const users = await UserService.getUsers();
		res.json(users);

	} catch (error) {
        
		next(error);

	}
});

AdminRouter.get("/account/:id",checkRole(["admin"]),verifyJWT, async (req: Request, res: Response, next: NextFunction) => {
	try {
        
		const user = await UserService.getUserbyId(Number(req.params.id));
		res.json(user);

	} catch (error) {
        
		next(error);

	}
});

AdminRouter.put("/linkAdminMusic/:idUser/:idMusic", checkRole(["admin"]),verifyJWT, async (req: Request, res: Response, next: NextFunction) => {
	try {
        
		const link = await UserService.linkMusic(Number(req.params.idUser), Number(req.params.idMusic));
		res.json(link);

	} catch (error) {
        
		next(error);

	}
});

AdminRouter.delete("/unlinkAdminMusic/:idUser/:idMusic",checkRole(["admin"]),verifyJWT, async (req: Request, res: Response, next: NextFunction) => {
	try {
        
		const unlink = await UserService.unlinkMusic(Number(req.params.idUser), Number(req.params.idMusic));
		res.json(unlink);

	} catch (error) {
	    next(error);
	}
});















export default AdminRouter;