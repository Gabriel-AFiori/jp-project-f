import { useState, useEffect } from 'react';
import { auth } from '../services/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const useFileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

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
    if (selectedFile) {
      setFileName(selectedFile.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileName(e.target.value);
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
    formData.append('fileName', fileName);
    setLoading(true);

    try {
      const endpoint = file.type.startsWith('audio') || file.type.startsWith('video')
        ? 'https://jp-project-back-production.up.railway.app/upload/transcribe' //Lembrar de voltar para o endereço do Railway
        : 'https://jp-project-back-production.up.railway.app/upload'; //Lembrar de voltar para o endereço do Railway

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

      setFile(null);
    } catch (error) {
      console.error(error);
      setError('Falha ao fazer upload do arquivo');
    } finally {
      setLoading(false);
    }
  };

  return { file, fileName, error, successMessage, loading, handleFileChange, handleFileNameChange, handleUpload };
};
