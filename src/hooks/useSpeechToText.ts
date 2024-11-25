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
      setError("User not logged in");
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
      setError('Failed to record audio');
    }
  };

  const uploadAudio = async () => {
    if (!audioBlobRef.current) {
      setError("No audio to upload.");
      return;
    }
    
    if (!userId) {
      setError("You must be logged in to upload a file.");
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
      
      setUploadStatus('Upload successful!');
      
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
        setError("No audio to upload.");
      }
    }, 1000);
  };
  
  const transcribeAudio = async (fileId: number) => {
    try {
      const response = await axios.post('https://jp-project-back-production.up.railway.app/upload/transcribe', { fileId });
      setSuccessMessage(`Teste Transcription: ${response.data.transcription}`);
      setTimeout(() => {
        setSuccessMessage('');
      }, 10000)
    } catch (error) {
      console.error(error);
      setError('Failed to transcribe audio');
    }
  };
  
  return { isRecording, audioUrl, uploadStatus, successMessage, error, startRecording, stopRecording };
};
