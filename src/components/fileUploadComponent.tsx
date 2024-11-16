import { useFileUpload } from '../hooks/useFileUpload';

const FileUpload = () => {
  const { error, successMessage, handleFileChange, handleUpload } = useFileUpload();

  return (
    <div>
      <h2>Upload File</h2>
      {error && <p>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default FileUpload;
