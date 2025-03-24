import React from 'react';


const LanguageFilter = ({ allLanguages, selectedLanguage, setSelectedLanguage }) => {
  const handleChange = (e) => {
    setSelectedLanguage(e.target.value);
  };

  if (!allLanguages || allLanguages.length === 0) {
    return null;
  }

  return (
    <div className="language-filter">
      <label htmlFor="language-select">Language:</label>
      <select 
        id="language-select" 
        value={selectedLanguage} 
        onChange={handleChange}
      >
        <option value="">All Languages</option>
        {allLanguages.map(language => (
          <option key={language} value={language}>
            {language}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageFilter;