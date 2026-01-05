import React, { useState } from 'react';

const UploadForm: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    setFileName(file ? file.name : '');
  };

  const handleSubmit = () => {
    // Placeholder function for file submission
    if (selectedFile) {
      console.log('Uploading file:', selectedFile.name);
      // TODO: Implement actual file upload logic
    } else {
      console.log('No file selected');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Upload File</h2>

      <input
        type="file"
        accept=".pdf,.jpg,.png"
        onChange={handleFileChange}
        style={{
          display: 'block',
          marginBottom: '10px',
          padding: '8px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          width: '100%',
          boxSizing: 'border-box'
        }}
      />

      {fileName && (
        <p style={{ marginBottom: '20px', fontSize: '14px', color: '#555' }}>
          Selected file: {fileName}
        </p>
      )}

      <button
        onClick={handleSubmit}
        style={{
          display: 'block',
          width: '100%',
          padding: '10px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '16px'
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#007bff')}
      >
        Upload
      </button>
    </div>
  );
};

export default UploadForm;
