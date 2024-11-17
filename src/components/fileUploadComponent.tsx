import { useFileUpload } from '../hooks/useFileUpload';
import { ErrorMessage, SuccessMessage } from './messageComponent'

const FileUpload = () => {
  const { error, successMessage, handleFileChange, handleUpload } = useFileUpload();

  return (
    <div className="upload-section">
      <h2>Upload File</h2>
      {error && <div className="message error"><ErrorMessage message={error} /></div>}
      {successMessage && <div className="message success"><SuccessMessage message={successMessage} /></div>}
      
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default FileUpload;
