import Note from "../Models/Note.js"

// 1. Get Notes
export const getNotes = async (req, res) => {
  try {
    // Ye aapne sahi kar liya tha (req.user.id)
    const notes = await Note.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// 2. Create Note
export const createNote = async (req, res) => {
  const { title, body } = req.body;
  if (!title || !body) {
    return res.status(400).json({ message: 'Please add a title and body' });
  }

  try {
    const note = await Note.create({
      title,
      body,
      user: req.user.id, // <-- CHANGE: req.user se req.user.id kar diya
    });
    res.status(201).json(note);
  } catch (error) {
    console.log(error); // Terminal me error dekhne ke liye
    res.status(500).json({ message: 'Server Error' });
  }
};

// 3. Update Note
export const updateNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });

    // <-- CHANGE: note.user.toString() ko req.user.id se compare karo
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedNote);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// 4. Delete Note
export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });

    // <-- CHANGE: Yahan bhi req.user.id aayega
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'User not authorized' });
    }

    await note.deleteOne();
    res.status(200).json({ id: req.params.id, message: 'Note deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};