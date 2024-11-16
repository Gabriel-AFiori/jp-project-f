import { useFileUpload } from '../hooks/useFileUpload';
import { ErrorMessage, SuccessMessage } from './messageComponent'

const FileUpload = () => {
  const { error, successMessage, handleFileChange, handleUpload } = useFileUpload();

  return (
    <div>
      <h2>Upload File</h2>
      {error && <ErrorMessage message={error} />}
      {successMessage && <SuccessMessage message={successMessage} />}
      
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default FileUpload;
