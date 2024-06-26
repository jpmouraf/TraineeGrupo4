import { Router, Request, Response, NextFunction } from "express";
import UserService from "../service/UserService";
import { notLoggedIn, login, verifyJWT, logout } from "../../../middlewares/auth";
import { checkRole } from "../../../middlewares/auth";
import statusCodes from "../../../../utils/constants/statusCodes";


const UserRouter = Router();

UserRouter.post("/login", notLoggedIn, login);

UserRouter.post("/logout", verifyJWT, logout);


UserRouter.post("/account/create", async (req: Request, res: Response, next: NextFunction) => {
	try {

		const body = req.body;
		const newUser = await UserService.create(body);
		res.status(statusCodes.CREATED).json(newUser);

	} catch (error) {

		next(error);

	}
});


UserRouter.get("/account",verifyJWT, checkRole(["admin", "user"]), async (req: Request, res: Response, next: NextFunction) => {

	try {
        
		const user = await UserService.getUserbyId(Number(req.user.id));
		res.status(statusCodes.SUCCESS).json(user);

	} catch (error) {
        
		next(error);

	}
});


UserRouter.put("/account/update", verifyJWT, checkRole(["admin", "user"]), async (req: Request, res: Response, next: NextFunction) => {
	try {
        
		const body = req.body;
		const user = await UserService.updateUser(Number(req.user.id), body);
		res.status(statusCodes.SUCCESS).json(user);

	} catch (error) {
        
		next(error);

	}
});
UserRouter.put("/account/password/update", verifyJWT, checkRole(["admin", "user"]), async (req: Request, res: Response, next: NextFunction) => {
	try {
        
		const body = req.body;
		const user = await UserService.updateUserPassword(Number(req.user.id), body);
		res.status(statusCodes.SUCCESS).json(user);

	} catch (error) {
        
		next(error);

	}
});
UserRouter.put("/account/password/update/:id", verifyJWT, checkRole(["admin", "user"]), async (req: Request, res: Response, next: NextFunction) => {
	try {
        
		const body = req.body;
		const user = await UserService.updateUserPassword(Number(req.user.id), body);
		res.json(user);

	} catch (error) {
        
		next(error);

	}
});

UserRouter.put("/linkUserMusic/account/:idMusic", verifyJWT, checkRole(["admin", "user"]), async (req: Request, res: Response, next: NextFunction) => {
	try {
        
		const link = await UserService.linkMusic(Number(req.user.id), Number(req.params.idMusic));
		res.status(statusCodes.SUCCESS).json(link);

	} catch (error) {
        
		next(error);

	}
});

UserRouter.delete("/unlinkUserMusic/account/:idMusic", verifyJWT, checkRole(["admin", "user"]), async (req: Request, res: Response, next: NextFunction) => {
	try {
        
		const unlink = await UserService.unlinkMusic(Number(req.user.id), Number(req.params.idMusic));
		res.status(statusCodes.SUCCESS).json(unlink);

	} catch (error) {
		next(error);
	}
});

UserRouter.get("/account/listenedMusics",verifyJWT,checkRole(["admin", "user"]), async (req: Request, res: Response, next: NextFunction) => {
	try {
		
		const listenedMusics = await UserService.listenedMusics(Number(req.user.id));
		res.status(statusCodes.SUCCESS).json(listenedMusics);
	} catch (error) {
		next(error);
	}
});

UserRouter.delete("/account/delete", verifyJWT, checkRole(["admin", "user"]), async (req: Request, res: Response, next: NextFunction) => {
	try {
        
		const user = await UserService.delete(Number(req.user.id));
		res.clearCookie("jwt", { httpOnly: true, 
			secure: process.env.NODE_ENV !== "development"  });
		res.status(statusCodes.SUCCESS).json(user);

	} catch (error) {
        
		next(error);

	}
});


export default UserRouter;