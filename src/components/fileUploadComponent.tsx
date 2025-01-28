import { useFileUpload } from '../hooks/useFileUpload';
import { Message } from './messageComponent'

const FileUpload = () => {
  const {
    error,
    successMessage,
    fileName,
    file,
    loading,
    handleFileChange,
    handleFileNameChange,
    handleUpload
  } = useFileUpload();

  return (
    <div className="upload-section">
      <h2>Upload File</h2>
      { error && <Message message={error} type='error' /> }
      { successMessage && <Message message={successMessage} type='success' /> }
      
      <input type="file" onChange={handleFileChange} />

      {loading && <p>Carregando...</p>}

      {file && (
        <div>
          <label htmlFor="file-name">Nomde do Arquivo:</label>
          <input 
            type="text"
            id="file-name"
            value={fileName}
            onChange={handleFileNameChange}
          />
        </div>
      )}

      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default FileUpload;
