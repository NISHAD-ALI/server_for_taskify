import { ObjectId } from "mongoose";

export default interface manager{
    name:string,
    password:string,
    email:string,
    image:string,
    employees:[ObjectId],
    tasksCreated:[ObjectId],
}