import mongoose from 'mongoose';
const { Schema } = mongoose;

// Task Schema
const TaskSchema = new Schema({
    user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
    },
    title: {
    type: String,
    required: true
    },
    description: {
    type: String
    },
    due_date: {
    type: Date
    },
    status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending'
    },
    category: {
    type: String,
    enum: ['professional', 'personal'],
    required: true
    },
    priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
    },
    recurring: {
    type: Boolean,
    default: false
    },
    recurring_pattern: {
    type: String
    }
});

const Task = mongoose.model('Task', TaskSchema);
export default Task;
