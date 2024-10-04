import { ObjectId } from "mongoose";

export default interface employee{
    name:string,
    password:string,
    email:string,
    image:string,
    taskAssigned:[ObjectId],
    manager:ObjectId,
}