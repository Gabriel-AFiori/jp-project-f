import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../services/firebaseConfig';

function UploadFile() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserId(user.uid);
    } else {
      setError("User not logged in");
    }
  }, []);

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

    // Userid dando problema, possivel local de erro
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
        await trascribeAudio(fileId);
      }
    } catch (error) {
      console.error(error);
      setError('Failed to upload file');
    }
  };

  const trascribeAudio = async (fileId: number) => {
    try {
      const response = await axios.post('http://localhost:3001/upload/transcribe', { fileId });
      setSuccessMessage(`File uploaded successfully! Transcription: ${response.data.transcription}`);
    } catch (error) {
      console.error(error);
      setError('Failed to transcribe audio');
    }
  }

  return (
    <div>
      <h2>Upload File</h2>
      {error && <p>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default UploadFile;