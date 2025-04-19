import mongoose from 'mongoose';
const { Schema } = mongoose;

// Assignment Schema
const AssignmentSchema = new Schema({
  task_id: {
    type: Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  member_id: {
    type: Schema.Types.ObjectId,
    ref: 'TeamMember',
    required: true
  },
  assigned_date: {
    type: Date,
    default: Date.now
  },
  assigned_by: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed'],
    default: 'pending'
  }
});

const Assignment = mongoose.model('Assignment', AssignmentSchema);
export default Assignment;
