import React from 'react';
import '../styles/TagFilter.css';

const TagFilter = ({ allTags, selectedTags, setSelectedTags }) => {
  
  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      // if tag exist remove it
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      // If not selected, add it
      setSelectedTags([...selectedTags, tag]);
    }
  };

  
  if (!allTags || allTags.length === 0) {
    return null;
  }

  return (
    <div className="tag-filter-container">
      <div className="tag-filter-title">Filter by Tags:</div>
      <div className="tag-filter-list">
        {allTags.map(tag => (
          <span
            key={tag}
            className={`tag-filter-item ${selectedTags.includes(tag) ? 'selected' : ''}`}
            onClick={() => toggleTag(tag)}
          >
            {tag}
          </span>
        ))}
      </div>
      {selectedTags.length > 0 && (
        <button 
          className="clear-tags-btn"
          onClick={() => setSelectedTags([])}
        >
          Clear Tags
        </button>
      )}
    </div>
  );
};

export default TagFilter;