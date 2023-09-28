import { Router } from "express";
import validateAuth from "../middlewares/validateAuth.middlewares.js";
import { getUrls, openShortUrl, shorten } from "../controllers/urls.controllers.js";

const urlRouter = Router();

urlRouter.post("/urls/shorten", validateAuth, shorten);
urlRouter.get("/urls/:id", validateAuth, getUrls);
urlRouter.get ("/urls/open/:shortUrl", openShortUrl)
urlRouter.delete("/urls/:id")

export default urlRouter;