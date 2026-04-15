// import Note from '../models/Note';
import Note from "../models/Note.js"

// @desc    Get logged in user's notes
// @route   GET /api/notes
export const getNotes = async (req, res) => {
  try {
    // req.user humare protect middleware se aayega
    const notes = await Note.find({ user: req.user }).sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a new note
// @route   POST /api/notes
export const createNote = async (req, res) => {
  const { title, body } = req.body;

  if (!title || !body) {
    return res.status(400).json({ message: 'Please add a title and body' });
  }

  try {
    const note = await Note.create({
      title,
      body,
      user: req.user, // Note ko currently logged-in user se link kar diya
    });

    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a note
// @route   PUT /api/notes/:id
export const updateNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Security Check: Make sure the logged in user matches the note user
    if (note.user.toString() !== req.user) {
      return res.status(401).json({ message: 'User not authorized to update this note' });
    }

    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Ye true karne se updated data return hota hai
    );

    res.status(200).json(updatedNote);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a note
// @route   DELETE /api/notes/:id
export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Security Check: Make sure the logged in user matches the note user
    if (note.user.toString() !== req.user) {
      return res.status(401).json({ message: 'User not authorized to delete this note' });
    }

    await note.deleteOne();

    res.status(200).json({ id: req.params.id, message: 'Note deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};