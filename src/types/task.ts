import { ObjectId } from "mongoose";

export default interface task{
    title:string,
    startDate:string,
    taskTime:string
    taskCreated:ObjectId|string,
    taskAssigneddTo:ObjectId|string,
}