import mongoose from 'mongoose';
const { Schema } = mongoose;

// Team Schema
const TeamSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'TeamMember'
  }],
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'archived'],
    default: 'active'
  }
});

const Team = mongoose.model('Team', TeamSchema);
export default Team;
