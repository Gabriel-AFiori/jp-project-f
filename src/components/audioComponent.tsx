import { useSpeechToText } from '../hooks/useSpeechToText';
import { ErrorMessage, SuccessMessage } from './messageComponent';

const AudioComponent = () => {
  const {
    isRecording,
    audioUrl,
    uploadStatus,
    successMessage,
    error,
    startRecording,
    stopRecording,
  } = useSpeechToText();

  // talvez jogar as svgs para assets e importar
  return (
    <div className="upload-section">
      <h2>Speech to Text</h2>
      {error && <div className="message error"><ErrorMessage message={error} /></div>}
      {successMessage && <div className="message success"><SuccessMessage message={successMessage} /></div>}
      {uploadStatus && <p>{uploadStatus}</p>}

      <button onClick={startRecording} disabled={isRecording}>
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
          <path d="M480-400q-50 0-85-35t-35-85v-240q0-50 35-85t85-35q50 0 85 35t35 85v240q0 50-35 85t-85 35Zm0-240Zm-40 520v-123q-104-14-172-93t-68-184h80q0 83 58.5 141.5T480-320q83 0 141.5-58.5T680-520h80q0 105-68 184t-172 93v123h-80Zm40-360q17 0 28.5-11.5T520-520v-240q0-17-11.5-28.5T480-800q-17 0-28.5 11.5T440-760v240q0 17 11.5 28.5T480-480Z"/>
        </svg>
      </button>
      <button onClick={stopRecording} disabled={!isRecording}>
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
          <path d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z"/>
        </svg>
      </button>

      <h3>Teste de Audio:</h3>
      {audioUrl && (
        <div>
          <audio controls src={audioUrl}></audio>
        </div>
      )}
    </div>
  );
};

export default AudioComponent;
