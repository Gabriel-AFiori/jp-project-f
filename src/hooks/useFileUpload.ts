import { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../services/firebaseConfig';
import { useNavigate } from 'react-router-dom';

export const useFileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [userId, setUserId] = useState<string>("");

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    setFile(selectedFile);
    setError("");
    setSuccessMessage("");
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    if (!userId) {
      setError("You must be logged in to upload a file.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);

    try {
      const response = await axios.post('http://localhost:3001/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccessMessage(response.data.message);

      const fileId = response.data.file.id;
      if (file.type.startsWith('audio/')) {
        await transcribeAudio(fileId);
      }
    } catch (error) {
      console.error(error);
      setError('Failed to upload file');
    }
  };

  const transcribeAudio = async (fileId: number) => {
    try {
      const response = await axios.post('http://localhost:3001/upload/transcribe', { fileId });
      setSuccessMessage(`Teste transcription: ${response.data.transcription}`);
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error(error);
      setError('Failed to transcribe audio');
    }
  };

  return { file, error, successMessage, handleFileChange, handleUpload };
};
