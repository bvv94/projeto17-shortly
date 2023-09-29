import { Router } from "express";
import validateAuth from "../middlewares/validateAuth.middlewares.js";
import { getUrls, openShortURL, shorten } from "../controllers/urls.controllers.js";

const urlRouter = Router();

urlRouter.post("/urls/shorten", validateAuth, shorten);
urlRouter.get("/urls/:id", getUrls);
urlRouter.get("/urls/open/:shortUrl", openShortURL)
urlRouter.delete("/urls/:id")

export default urlRouter;