import useAudioRecorder from '../hooks/useAudioRecorder';
import { Message } from './messageComponent'

const AudioComponent = () => {
  const { 
    isRecording,
    audioUrl,
    fileName,
    loading,
    successMessage,
    startRecording,
    stopRecording,
    handleFileNameChange
  } = useAudioRecorder();

  return (
    <div className="upload-section">
      <h2>Speech to Text</h2>
      
      {loading && <p>Carregando...</p>}
      { successMessage && <Message message={successMessage} type='success' /> }

      <input 
        type="text"
        placeholder='Digite o nome do arquivo de áudio'
        onChange={handleFileNameChange}
        disabled={isRecording}
        value={fileName}
      />
      <button 
        onClick={isRecording ? stopRecording : startRecording}
        className={isRecording ? 'recording' : ''}
      >
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
          <path d="M480-400q-50 0-85-35t-35-85v-240q0-50 35-85t85-35q50 0 85 35t35 85v240q0 50-35 85t-85 35Zm0-240Zm-40 520v-123q-104-14-172-93t-68-184h80q0 83 58.5 141.5T480-320q83 0 141.5-58.5T680-520h80q0 105-68 184t-172 93v123h-80Zm40-360q17 0 28.5-11.5T520-520v-240q0-17-11.5-28.5T480-800q-17 0-28.5 11.5T440-760v240q0 17 11.5 28.5T480-480Z"/>
        </svg>
      </button>
      {audioUrl && <audio src={audioUrl} controls />}
    </div>
  );
};

export default AudioComponent;
