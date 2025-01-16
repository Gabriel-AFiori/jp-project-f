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
      setError("Usuário não logado");
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
      setError("Por favor, selecione um arquivo para fazer upload.");
      return;
    }

    if (!userId) {
      setError("Você precisa estar logado para fazer upload de arquivos.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);

    try {
      const endpoint = file.type.startsWith('audio') || file.type.startsWith('video')
        ? 'https://jp-project-back-production.up.railway.app/upload/transcribe'
        : 'https://jp-project-back-production.up.railway.app/upload';

      const response = await axios.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (file.type.startsWith('audio') || file.type.startsWith('video')) {
        console.log('Transcription:', response.data);
        setSuccessMessage("Arquivo de áudio/vídeo enviado e transcrição realizada com sucesso.");
      } else {
        setSuccessMessage(response.data.message);
      }
    } catch (error) {
      console.error(error);
      setError('Falha ao fazer upload do arquivo');
    }
  };

  return { file, error, successMessage, handleFileChange, handleUpload };
};
