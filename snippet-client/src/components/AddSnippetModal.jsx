import React, { useState } from 'react';
import axios from 'axios';
import BASE_URL from '../config/config';
import '../styles/SnippetModal.css';

const AddSnippetModal = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    title: '',
    code: '',
    language: 'javascript',
    tags: '',
    is_favorite: false
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  
  const languages = [
    'JavaScript', 'HTML', 'CSS', 'Python', 'PHP', 
    'Java', 'C#', 'C++', 'Swift', 'TypeScript', 
    'SQL',
  ];
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    
    if (!formData.code.trim()) {
      setError('Code snippet is required');
      return;
    }
    
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.post(`${BASE_URL}/v0.1/user/snippets/add`, 
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.success) {
        onAdd();
        onClose();
      } else {
        setError(response.data.message || 'Failed to add snippet');
      }
    } catch (err) {
      console.error('Failed to add snippet:', err);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Snippet</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        {error && <div className="modal-error">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter a descriptive title"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="language">Language</label>
            <select
              id="language"
              name="language"
              value={formData.language}
              onChange={handleChange}
              required
            >
              {languages.map(lang => (
                <option key={lang} value={lang.toLowerCase()}>{lang}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="code">Code</label>
            <textarea
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="Paste your code here"
              rows="10"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="tags">Tags (comma separated)</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g. function, react, animation"
            />
          </div>
          
          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                name="is_favorite"
                checked={formData.is_favorite}
                onChange={handleChange}
              />
              Add to favorites
            </label>
          </div>
          
          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Adding...' : 'Add Snippet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSnippetModal;