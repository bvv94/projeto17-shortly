import { Router } from "express";
import validateAuth from "../middlewares/validateAuth.middlewares.js";
import { shorten } from "../controllers/urls.controllers.js";

const urlRouter = Router();

urlRouter.post("/urls/shorten", validateAuth, shorten);
urlRouter.get("/urls/:id", validateAuth, shorten);
urlRouter.get ("/urls/open/:shortUrl",)
urlRouter.delete("/urls/:id")

export default urlRouter;