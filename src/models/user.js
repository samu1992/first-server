import {Schema, model} from "mongoose";

const userCollection = 'users';
const userSchema = new Schema({
    name: String,
    lastName: String,   
    email: {
        type: String,
        unique: true
    },
    password: String
})

export const userModel = model(userCollection, userSchema)