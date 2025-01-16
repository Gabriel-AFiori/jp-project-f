import { useState, useRef } from 'react';
import { auth } from '../services/firebaseConfig';

type UseAudioRecorderReturn = {
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  audioUrl: string | null;
};

const useAudioRecorder = (): UseAudioRecorderReturn => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const startRecording = () => {
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
          const audioUrl = URL.createObjectURL(audioBlob);
          setAudioUrl(audioUrl);
          // Enviar o áudio para o backend após a gravação
          uploadAudio(audioBlob);
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

  const uploadAudio = (audioBlob: Blob) => {
    const user = auth.currentUser;
    if (!user) {
      console.error('User not logged in');
      return;
    }

    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.wav');
    formData.append('userId', user.uid);
    fetch('https://jp-project-back-production.up.railway.app/upload/transcribe', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Transcription:', data);
      })
      .catch((error) => {
        console.error('Error uploading audio:', error);
      });
  };

  return {
    isRecording,
    startRecording,
    stopRecording,
    audioUrl,
  };
};

export default useAudioRecorder;
