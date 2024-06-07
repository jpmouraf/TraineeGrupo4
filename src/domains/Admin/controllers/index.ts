/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router, Request, Response, NextFunction } from "express";
import UserService from "../../User/service/UserService";
import ArtistService from "../../Artist/service/ArtistService";
import MusicService from "../../Music/service/MusicService";
import { notLoggedIn, login, verifyJWT, logout } from "../../../middlewares/auth";
import { checkRole } from "../../../middlewares/auth";

const AdminRouter = Router();


















export default AdminRouter;