import { Request, Response, NextFunction } from "express";
import prisma from "../../config/prismaClient";
import { PermissionError } from "../../errors/PermissionError";
import { compare } from "bcrypt";
import statusCodes from "../../utils/constants/statusCodes";
import { User } from "@prisma/client";
import { sign, verify } from "jsonwebtoken";
import cookieParser from "cookie-parser";

function generateJWT(user: User, res: Response){
    const body = {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
    };

    const token = sign({user: body}, process.env.SECRET_KEY || "", {expiresIn: process.env.JWT_EXPIRATION});

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
    });
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

        res.status(statusCodes.NO_CONTENT).json("Login realizado com sucesso!");

    } catch (error) {

        next(error);

    }
}