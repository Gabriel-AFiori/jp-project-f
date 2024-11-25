import axios from 'axios';
import { useState, useRef, useEffect } from 'react';
import { auth } from '../services/firebaseConfig';
import { useNavigate } from 'react-router-dom';

export const useSpeechToText = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [userId, setUserId] = useState<string>("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioBlobRef = useRef<Blob | null>(null);

  const navigate = useNavigate();

  // Talvez componentizar os estadis globais em um useContext
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserId(user.uid);
    } else {
      setError("Usuário não logado");
      navigate('/');
    }
  }, [navigate]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
  
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
  
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);

        audioBlobRef.current = blob;
      };
  
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error recording audio:', error);
      setError('Falha ao gravar áudio');
    }
  };

  const uploadAudio = async () => {
    if (!audioBlobRef.current) {
      setError("Nenhum áudio para fazer upload");
      return;
    }
    
    if (!userId) {
      setError("Você precisa estar logado para fazer upload de arquivos");
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append('file', audioBlobRef.current, `audio-${userId}.wav`);
      formData.append('userId', userId);
      
      setUploadStatus('Uploading...');
      
      const response = await axios.post('https://jp-project-back-production.up.railway.app/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setUploadStatus('Upload successful');
      
      const fileId = response.data.file.id;
      
      await transcribeAudio(fileId);
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus('Upload failed.');
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);

    setTimeout(() => {
      if (audioBlobRef.current) {
        uploadAudio();
      } else {
        setError("Nenhum áudio para fazer upload");
      }
    }, 1000);
  };
  
  const transcribeAudio = async (fileId: number) => {
    try {
      setSuccessMessage('Transcrevendo áudio...');
      const response = await axios.post('https://jp-project-back-production.up.railway.app/upload/transcribe', { fileId });

      setSuccessMessage(`Transcrição: ${response.data.transcription}`);
      setTimeout(() => {
        setSuccessMessage('');
      }, 10000)
    } catch (error) {
      console.error(error);
      setError('Falha para transcrever áudio');
    }
  };
  
  return { isRecording, audioUrl, uploadStatus, successMessage, error, startRecording, stopRecording };
};
