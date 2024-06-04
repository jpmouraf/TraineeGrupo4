import { Router, Request, Response, NextFunction } from "express";
import UserService from "../service/UserService";
import { notLoggedIn, login } from "../../../middlewares/auth";

const UserRouter = Router();

UserRouter.post("/login", notLoggedIn, login);

UserRouter.post("/create", async (req: Request, res: Response, next: NextFunction) => {
	try {

		const body = req.body;
		const newUser = await UserService.create(body);
		res.json(newUser);

	} catch (error) {

		next(error);

	}
});

UserRouter.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
	try {
        
		const user = await UserService.getUserbyId(Number(req.params.id));
		res.json(user);

	} catch (error) {
        
		next(error);

	}
});

UserRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
	try {
        
		const users = await UserService.getUsers();
		res.json(users);

	} catch (error) {
        
		next(error);

	}
});

UserRouter.put("/update/:id", async (req: Request, res: Response, next: NextFunction) => {
	try {
        
		const body = req.body;
		const user = await UserService.updateUser(Number(req.params.id), body);
		res.json(user);

	} catch (error) {
        
		next(error);

	}
});

UserRouter.put("/linkUserMusic/:idUser/:idMusic", async (req: Request, res: Response, next: NextFunction) => {
	try {
        
		const link = await UserService.linkMusic(Number(req.params.idUser), Number(req.params.idMusic));
		res.json(link);

	} catch (error) {
        
		next(error);

	}
});

UserRouter.delete("/delete/:id", async (req: Request, res: Response, next: NextFunction) => {
	try {
        
		const user = await UserService.delete(Number(req.params.id));
		res.json(user);

	} catch (error) {
        
		next(error);

	}
});


export default UserRouter;