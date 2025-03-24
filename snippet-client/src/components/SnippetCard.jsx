import React, { useState } from 'react';
import EditSnippetModal from './EditSnippetModal';
import '../styles/SnippetCard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const SnippetCard = ({ snippet, onDelete, onToggleFavorite, onRefresh }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(snippet.code)
      .then(() => {
        alert('Code copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy code:', err);
      });
  };
  
  return (
    <>
      <div className="snippet-card">
        <div className="snippet-card-header">
          <h3 className="snippet-title">{snippet.title}</h3>
          <div className="language-badge">{snippet.language}</div>
          <button 
            className={`favorite-btn ${snippet.is_favorite ? 'favorited' : ''}`} 
            onClick={() => onToggleFavorite(snippet.id, !snippet.is_favorite)}
          >
           <FontAwesomeIcon icon={snippet.is_favorite ? solidStar : regularStar} />
          </button>
        </div>
        
        <div className="snippet-code-container">
          <SyntaxHighlighter 
            language={snippet.language.toLowerCase()} 
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              maxHeight: '200px',
              overflow: 'auto'
            }}
          >
            {snippet.code}
          </SyntaxHighlighter>
        </div>
        
        <div className="snippet-tags">
          {snippet.tags && snippet.tags.map(tag => (
            <span key={tag.id} className="tag">{tag.name}</span>
          ))}
        </div>
        
        <div className="snippet-actions">
          <button className="action-btn copy-btn" onClick={copyToClipboard}>
            Copy
          </button>
          <button className="action-btn edit-btn" onClick={() => setIsEditModalOpen(true)}>
            Edit
          </button>
          <button className="action-btn delete-btn" onClick={() => onDelete(snippet.id)}>
            Delete
          </button>
        </div>
      </div>
      
      {isEditModalOpen && (
        <EditSnippetModal 
          snippet={snippet} 
          onClose={() => setIsEditModalOpen(false)} 
          onUpdate={onRefresh}
        />
      )}
    </>
  );
};

export default SnippetCard;