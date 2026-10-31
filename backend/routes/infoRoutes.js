import express from "express";
import { getProfileInfo } from "../controllers/infoController.js";

const router = express.Router();

router.get("/", getProfileInfo);

export default router;

