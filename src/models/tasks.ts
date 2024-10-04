import mongoose, { Schema, model } from "mongoose";
import task from "../types/task";

const taskSchema: Schema<task> = new Schema({
    title: {
        type: String,
        required: true
    },
    startDate: {
        type: String,
        required: true
    },
    taskTime: {
        type: String,
        required: true
    },
    taskCreated:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'manager',
        }
    ,
    taskAssigneddTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'employee',

    }
});

const taskModel = model<task>('task', taskSchema);

export default taskModel;
