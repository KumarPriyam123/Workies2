import mongoose from 'mongoose';
const { Schema } = mongoose;

// User behavior tracking for AI suggestions
const UserBehaviorSchema = new Schema({
    user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
    },
    common_tasks: [{
    title: String,
    category: String,
    frequency: Number,
    typical_duration: Number,
    typical_time_of_day: String
    }],
    productivity_patterns: {
    most_productive_hours: [String],
    least_productive_hours: [String]
    },
    preferences: {
    work_life_balance_ratio: Number,
    break_frequency: Number,
    preferred_task_grouping: String
    },
    last_updated: {
    type: Date,
    default: Date.now
    }
});

const UserBehavior = mongoose.model('UserBehavior', UserBehaviorSchema);
export default UserBehavior;
