import { Router } from "express";
import authRouter from "./auth.routes.js";
import urlRouter from "../routes/urls.routes.js"
import me from "../controllers/me.controller.js";
import ranking from "../controllers/ranking.controllers.js";
import validateAuth from "../middlewares/validateAuth.middlewares.js";

const router = Router();

router.use(authRouter);
router.use(urlRouter);

router.get("/users/me", validateAuth, me); //não sei se isso aqui vai funcionar
router.get("/ranking", ranking);

export default router;