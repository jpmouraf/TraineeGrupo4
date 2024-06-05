/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router, Request, Response, NextFunction } from "express";
import AdminService from "../service/AdminService";
import UserService from "../../User/service/UserService";
import { verifyJWT } from "../../../middlewares/auth";
import { checkRole } from "../../../middlewares/auth";

const AdminRouter = Router();

AdminRouter.put("/account/update", verifyJWT, checkRole(["admin"]), verifyJWT, async (req: Request, res: Response, next: NextFunction) => {
	try {
        
		const body = {
			id: 0,
			email: req.body.email,
			name: req.body.name,
			password: req.body.password,
			role: req.body.role,
			photo: req.body.photo,
		};
		const user = await AdminService.updateAdmin(Number(req.user.id), body);
		res.json(user);

	} catch (error) {
        
		next(error);

	}
});

AdminRouter.delete("/account/delete", verifyJWT, checkRole(["admin"]), verifyJWT, async (req: Request, res: Response, next: NextFunction) => {
	try {
        
		const user = await UserService.delete(Number(req.user.id));
		res.json(user);

	} catch (error) {
        
		next(error);

	}
});

AdminRouter.get("/account", verifyJWT, checkRole(["admin"]), verifyJWT, async (req: Request, res: Response, next: NextFunction) => {
	try {
		
		const user = await UserService.getMyUser(Number(req.user.id));
		res.json(user);

	} catch (error) {
		
		next(error);

	}
});


















export default AdminRouter;