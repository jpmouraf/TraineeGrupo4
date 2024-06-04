import { Request, Response, NextFunction } from "express";
import prisma from "../../config/prismaClient";
import { PermissionError } from "../../errors/PermissionError";
import { compare } from "bcrypt";
import statusCodes from "../../utils/constants/statusCodes";
import { User } from "@prisma/client";
import { sign, verify } from "jsonwebtoken";

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

        res.status(statusCodes.NO_CONTENT).json("Login realizado com sucesso!");

    } catch (error) {
        next(error);
    }
}