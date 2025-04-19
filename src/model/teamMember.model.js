import mongoose from 'mongoose';
const { Schema } = mongoose;

// Team Member Schema
const TeamMemberSchema = new Schema({
  team_id: {
    type: Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  name: {
    type: String,
    required: true
  },
  qualification: {
    type: String
  },
  role: {
    type: String,
    required: true
  },
  joined_at: {
    type: Date,
    default: Date.now
  }
});

const TeamMember = mongoose.model('TeamMember', TeamMemberSchema);
export default TeamMember;
