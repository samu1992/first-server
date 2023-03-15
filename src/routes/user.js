import { Router } from "express";
import { userModel } from "../models/user.js";

const userRouter = Router()

userRouter.get("/", async(req, res) => {
    try{
        const users = await userModel.find()
        res.send({resultado: 'success', valores: users})
    } catch(error) {
        res.send("error message:", error)
    }
});

export default userRouter
