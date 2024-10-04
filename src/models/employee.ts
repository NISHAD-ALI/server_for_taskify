import mongoose, { Schema, model } from "mongoose";
import employee from "../types/employee";

const employeeSchema: Schema<employee> = new Schema({
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
    taskAssigned: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'task',
            default: []
        }
    ],
    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'manager',

    }
});

const employeeModel = model<employee>('employee', employeeSchema);

export default employeeModel;
