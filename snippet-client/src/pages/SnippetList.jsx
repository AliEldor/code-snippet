import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../config/config';
import SnippetCard from '../components/SnippetCard';
import AddSnippetModal from '../components/AddSnippetModal';
import TagFilter from '../components/TagFilter';
import '../styles/SnippetList.css';

const SnippetList = () => {
  const navigate = useNavigate();
  const [snippets, setSnippets] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    
    fetchSnippets();
  }, [navigate]);

  const fetchSnippets = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/v0.1/user/snippets`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setSnippets(response.data.snippets);
        
        // get all unique tags from snippets
        const tagSet = new Set();
        response.data.snippets.forEach(snippet => {
          if (snippet.tags && snippet.tags.length > 0) {
            snippet.tags.forEach(tag => tagSet.add(tag.name));
          }
        });
        setAllTags(Array.from(tagSet));
      }
    } catch (err) {
      console.error('Failed to fetch snippets:', err);
      setError('Failed to load snippets. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleLanguageFilter = (e) => {
    setSelectedLanguage(e.target.value);
  };

  const handleAddSnippet = () => {
    fetchSnippets(); //refresh
  };

  const handleDeleteSnippet = async (id) => {
    if (window.confirm('Are you sure you want to delete this snippet?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`${BASE_URL}/v0.1/user/snippets/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data.success) {

          // Update thelist after deleting
          setSnippets(snippets.filter(snippet => snippet.id !== id));
        }
      } catch (err) {
        console.error('Failed to delete snippet:', err);
        setError('Failed to delete snippet. Please try again.');
      }
    }
  };

  const handleToggleFavorite = async (id, isFavorite) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${BASE_URL}/v0.1/user/snippets/${id}/favorite`,
        { is_favorite: isFavorite },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      
      setSnippets(snippets.map(snippet =>
        snippet.id === id ? { ...snippet, is_favorite: isFavorite } : snippet
      ));
    } catch (err) {
      console.error('Failed to update favorite status:', err);
      setError('Failed to update favorite status. Please try again.');
    }
  };

  
  const filteredSnippets = snippets.filter(snippet => {
    // check for matching search

    const matchesSearch = snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    snippet.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    // for lang
    const matchesLanguage = selectedLanguage === '' || 
    snippet.language.toLowerCase() === selectedLanguage.toLowerCase();
    
    // for tags
    const matchesTags = selectedTags.length === 0 || 
    (snippet.tags && selectedTags.every(tag => 
    snippet.tags.some(snippetTag => snippetTag.name === tag)
    ));
    
    return matchesSearch && matchesLanguage && matchesTags;
  });

  
  const languages = [...new Set(snippets.map(snippet => snippet.language))];

  return (
    <div className="snippet-container">
      <div className="snippet-header">
        <h1>Code Snippet Manager</h1>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="search-filter-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search snippets..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>

        <div className="language-filter">
          <select
            value={selectedLanguage}
            onChange={handleLanguageFilter}
            className="language-select"
          >
            <option value="">All Languages</option>
            {languages.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>

        <button
          className="add-snippet-btn"
          onClick={() => setIsAddModalOpen(true)}
        >
          Add New Snippet
        </button>
      </div>
      
      
      <TagFilter 
        allTags={allTags}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
      />

      {loading ? (
        <div className="loading-container">
          <p>Loading snippets...</p>
        </div>
      ) : (
        <div className="snippet-grid">
          {filteredSnippets.length > 0 ? (
            filteredSnippets.map(snippet => (
              <SnippetCard
                key={snippet.id}
                snippet={snippet}
                onDelete={handleDeleteSnippet}
                onToggleFavorite={handleToggleFavorite}
                onRefresh={fetchSnippets}
              />
            ))
          ) : (
            <div className="no-snippets">
              <p>No snippets found. Add your first snippet!</p>
            </div>
          )}
        </div>
      )}

      {isAddModalOpen && (
        <AddSnippetModal
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddSnippet}
        />
      )}
    </div>
  );
};

export default SnippetList;