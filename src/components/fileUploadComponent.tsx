import { useFileUpload } from '../hooks/useFileUpload';
import { Message } from './messageComponent'

const FileUpload = () => {
  const { error, successMessage, handleFileChange, handleUpload } = useFileUpload();

  return (
    <div className="upload-section">
      <h2>Upload File</h2>
      { error && <Message message={error} type='error' /> }
      { successMessage && <Message message={successMessage} type='success' /> }
      
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default FileUpload;
