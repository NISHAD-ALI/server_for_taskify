import mongoose, { Schema, model } from "mongoose";
import manager from "../types/manager";

const managerSchema: Schema<manager> = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: 'https://res.cloudinary.com/dxriwp8sx/image/upload/v1723214021/profile_uk9sbs.png'
    },
    employees: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'employee',
            default: []
        }
    ],
    tasksCreated: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Posts',
            default: []
        }
    ],
});

const managerModel = model<manager>('manager', managerSchema);

export default managerModel;
