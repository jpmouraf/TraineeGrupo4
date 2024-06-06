/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router, Request, Response, NextFunction } from "express";
import AdminService from "../service/AdminService";
import UserService from "../../User/service/UserService";
import { verifyJWT } from "../../../middlewares/auth";
import { checkRole } from "../../../middlewares/auth";
import statusCodes from "../../../../utils/constants/statusCodes";


const AdminRouter = Router();

AdminRouter.put("/account/update", verifyJWT, checkRole(["admin"]), verifyJWT, async (req: Request, res: Response, next: NextFunction) => {
	try {
        
		const body = req.body;
		const user = await AdminService.updateAdmin(Number(req.user.id), body);
		res.status(statusCodes.SUCCESS).json(user);

	} catch (error) {
        
		next(error);

	}
});

AdminRouter.put("/update/:id", verifyJWT, checkRole(["admin"]), verifyJWT, async (req: Request, res: Response, next: NextFunction) => {
	try {
        
		const body = req.body;
		const user = await AdminService.updateAdmin(Number(req.params.id), body);
		res.status(statusCodes.SUCCESS).json(user);

	} catch (error) {
        
		next(error);

	}
});

AdminRouter.delete("/delete/:id", verifyJWT, checkRole(["admin"]), verifyJWT, async (req: Request, res: Response, next: NextFunction) => {
	try {
        
		const user = await UserService.delete(Number(req.params.id));
		res.status(statusCodes.SUCCESS).json(user);

	} catch (error) {
        
		next(error);

	}
});


AdminRouter.post("/create", verifyJWT,checkRole(["admin"]), async (req: Request, res: Response, next: NextFunction) => {
	try {

		const body = req.body;
		const newUser = await AdminService.createByAdmin(body);
		res.status(statusCodes.SUCCESS).json(newUser);

	} catch (error) {

		next(error);

	}
});

AdminRouter.get("/:id", verifyJWT, checkRole(["admin"]), async (req: Request, res: Response, next: NextFunction) => {
	try {
        
		const user = await UserService.getUserbyId(Number(req.params.id));
		res.status(statusCodes.SUCCESS).json(user);

	} catch (error) {
        
		next(error);

	}
});

AdminRouter.get("/", verifyJWT, checkRole(["admin"]), async (req: Request, res: Response, next: NextFunction) => {
	try {
        
		const users = await UserService.getUsers();
		res.status(statusCodes.SUCCESS).json(users);

	} catch (error) {
        
		next(error);

	}
});

export default AdminRouter;
