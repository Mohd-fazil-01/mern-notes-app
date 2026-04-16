import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  
  const { user, setUser } = useContext(AuthContext);
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState({ title: '', body: '' });
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {

      await api.post('/auth/logout');
      
      setUser(null);
      
      navigate('/login');
    } catch (error) {
      console.error("Logout failed:", error);

      setUser(null);
      navigate('/login');
    }
  };

  const fetchNotes = async () => {
    try {
      const res = await api.get('/notes');
      setNotes(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/notes/${editingId}`, formData);
        setEditingId(null);
      } else {
        await api.post('/notes', formData);
      }
      setFormData({ title: '', body: '' });
      fetchNotes();
    } catch (error) {
      alert('Error saving note');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/notes/${id}`);
      fetchNotes();
    } catch (error) {
      console.error('Delete error');
    }
  };

  const handleEdit = (note) => {
    setEditingId(note._id);
    setFormData({ title: note.title, body: note.body });
  };

  return (
    <div className="dashboard-container">
      <div className="header">
        <h1>Note Application</h1>
        <div>
          <span style={{ marginRight: '15px' }}>Hello, {user?.name}</span>
          
          <button onClick={handleLogout} className="btn btn-danger btn-small">Logout</button>
        </div>
      </div>

      <div className="note-form">
        <h2>{editingId ? 'Edit Note' : 'Add New Note'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input 
              type="text" 
              placeholder="Title" 
              value={formData.title} 
              onChange={(e) => setFormData({...formData, title: e.target.value})} 
              required 
            />
          </div>
          <div className="form-group">
            <textarea 
              placeholder="What did you code today?" 
              value={formData.body} 
              onChange={(e) => setFormData({...formData, body: e.target.value})} 
              required 
            />
          </div>
          <button type="submit" className="btn">{editingId ? 'Update' : 'Save'} Note</button>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setFormData({title: '', body: ''}) }} className="btn" style={{backgroundColor: '#6c757d', marginTop: '10px'}}>Cancel</button>
          )}
        </form>
      </div>

      <div className="notes-grid">
        {notes.map(note => (
          <div className="note-card" key={note._id}>
            <h3>{note.title}</h3>
            <p>{note.body}</p>
            <div className="note-actions">
              <button onClick={() => handleEdit(note)} className="btn btn-small">Edit</button>
              <button onClick={() => handleDelete(note._id)} className="btn btn-danger btn-small">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;