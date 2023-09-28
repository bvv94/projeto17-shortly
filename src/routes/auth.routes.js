import { Router } from "express";
import { sign_in, sign_out, sign_up } from "../controllers/auth.controller.js";
import validateSchema from "../middlewares/validateSchema.schemas.js";
import { loginSchema, userSchema } from "../schemas/auth.schemas.js";
import validateAuth from "../middlewares/validateAuth.middlewares.js";

const authRouter = Router();

authRouter.post("/signup", validateSchema(userSchema), sign_up);
authRouter.post("/signin", validateSchema(loginSchema), sign_in);
//authRouter.post("sign_out", validateAuth, sign_out);

export default authRouter;