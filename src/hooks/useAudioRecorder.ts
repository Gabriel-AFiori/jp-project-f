import { useState, useRef } from 'react';
import { auth } from '../services/firebaseConfig';

type UseAudioRecorderReturn = {
  isRecording: boolean;
  audioUrl: string | null;
  fileName: string;
  loading: boolean;
  successMessage: string | null;
  startRecording: () => void;
  stopRecording: () => void;
  handleFileNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const useAudioRecorder = (): UseAudioRecorderReturn => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileName(e.target.value);
  };

  const startRecording = () => {
    if (!fileName.trim()) {
      alert('Por favor, insira um nome para o arquivo antes de começar a gravar.');
      return;
    }

    setIsRecording(true);
    audioChunks.current = []; // Reset audio chunks
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        mediaRecorderRef.current = new MediaRecorder(stream);
        if (mediaRecorderRef.current) {
          mediaRecorderRef.current.ondataavailable = (event) => {
            audioChunks.current.push(event.data);
          }
        }
        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunks.current.push(event.data);
        };
        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
          const audioFile = new File([audioBlob], `${fileName}.wav`, { type: 'audio/wav' });

          const audioUrl = URL.createObjectURL(audioBlob);
          setAudioUrl(audioUrl);
          // Enviar o áudio para o backend após a gravação
          uploadAudio(audioFile);
          console.log(audioFile);
          
        };
        mediaRecorderRef.current.start();
      })
      .catch((error) => {
        console.error('Error accessing microphone:', error);
      });
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  const uploadAudio = (audioFile: File) => {
    const user = auth.currentUser;
    if (!user) {
      console.error('User not logged in');
      return;
    }

    const formData = new FormData();
    formData.append('file', audioFile);
    formData.append('userId', user.uid);
    setLoading(true);

    fetch('https://jp-project-back-production.up.railway.app/upload/transcribe', { //Lembrar de voltar para o endereço do Railway
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Transcription:', data);
        setSuccessMessage("Arquivo de áudio enviado e transcrito com sucesso.");
        setFileName("");
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error uploading audio:', error);
      });
  };

  return {
    isRecording,
    audioUrl,
    fileName,
    loading,
    successMessage,
    startRecording,
    stopRecording,
    handleFileNameChange,
  };
};

export default useAudioRecorder;
