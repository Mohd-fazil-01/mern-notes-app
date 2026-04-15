import express from 'express';
import { getNotes, createNote, updateNote, deleteNote } from '../controllers/noteController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// 1. Get all notes (Sirf login user ke)
router.get('/', protect, getNotes);

// 2. Create a new note
router.post('/', protect, createNote);

// 3. Update a note by ID
router.put('/:id', protect, updateNote);

// 4. Delete a note by ID
router.delete('/:id', protect, deleteNote);

export default router;