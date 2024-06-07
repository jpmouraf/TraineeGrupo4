import { Request, Response, NextFunction } from "express";
import prisma from "../../config/prismaClient";
import { PermissionError } from "../../errors/PermissionError";
import { compare } from "bcrypt";
import statusCodes from "../../utils/constants/statusCodes";
import { User } from "@prisma/client";
import { JwtPayload, sign, verify } from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { TokenError } from "../../errors/TokenError";
import { userRoles} from "../../utils/constants/userRoles";


function generateJWT(user: User, res: Response) {
	const body = {
		id: user.id,
		email: user.email,
		role: user.role,
		name: user.name,
	};

	const token = sign({ user: body }, process.env.SECRET_KEY || "", { expiresIn: process.env.JWT_EXPIRATION });

	res.cookie("jwt", token, {
		httpOnly: true,
		secure: process.env.NODE_ENV !== "development",
	});
}

function cookieExtractor(req: Request) {
	let token = null;

	if (req.cookies) {
		token = req.cookies["jwt"];
	}

	return token;
}


export function verifyJWT(req:Request, res: Response, next: NextFunction){
	try{
		const token = cookieExtractor(req);
		if (token){
			const decoded = verify(token, process.env.SECRET_KEY || "") as JwtPayload;
			req.user = decoded.user;
		}

		if (req.user == null){
			throw new TokenError("Você precisa estar logado para realizar essa ação!");
		}
		next();
	} catch(error){
		next(error);
	}
}

export async function login(req: Request, res: Response, next: NextFunction) {
	try {

		const user = await prisma.user.findUnique({
			where: {
				email: req.body.email
			}
		});

		if(!user) {
			throw new PermissionError("Email e/ou senha incorretos!");
		}

		const match = compare(req.body.password, user.password);

		if(!match){
			throw new PermissionError("Email e/ou senha incorretos!");
		}

		generateJWT(user, res);

		res.status(statusCodes.SUCCESS).json("Login realizado com sucesso!");

	} catch (error) {

		next(error);

	}
}

export async function notLoggedIn(req: Request, res: Response, next: NextFunction) {
	try {

		const token = cookieExtractor(req);

		if(token){
			res.status(400);
			throw new TokenError("Você já está logado!");
		}

		next();

	} catch (error) {

		next(error);

	}

}

export async function logout (req: Request, res: Response, next: NextFunction) {
	try {
		res.clearCookie("jwt", { httpOnly: true, 
			secure: process.env.NODE_ENV !== "development"  });
		const token = cookieExtractor(req);
		if (!token){
			throw new TokenError("Faça o logout novamente.");
		}

		res.status(statusCodes.SUCCESS).json("Logout realizado com sucesso!");

	} catch (error) {
		next(error);
	}
}


export function checkRole(allowedRoles: string[]) {
	return (req: Request, res: Response, next: NextFunction) => {
		try {
			const user = req.user as User;

			if (!user) {
				res.status(statusCodes.UNAUTHORIZED);
				throw new Error("Usuário não autenticado");
			}
			const hasPermission = allowedRoles.some(role => role === user.role);
			if (!hasPermission) {
				res.status(statusCodes.FORBIDDEN);
				throw new Error("Você não tem permissão para acessar essa rota!");
			}
			next();
		} catch (error) {
			next(error);
		}
	};
}