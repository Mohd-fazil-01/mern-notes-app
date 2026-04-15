import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Ye reference database ko batata hai ki ye note kis user ka hai
    },
    title: {
      type: String,
      required: [true, 'Please add a title'],
    },
    body: {
      type: String,
      required: [true, 'Please add note content'],
    },
  },
  {
    timestamps: true,
  }
);

const Note = mongoose.model('Note', noteSchema);
export default Note;