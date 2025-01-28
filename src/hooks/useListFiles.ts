import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/firebaseConfig";
import axios from "axios";

interface File {
  id: number;
  filename: string;
  filetype: string;
  transcription: string;
}

export const useListFiles = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchFiles = useCallback(async () => {
    try {
      setLoading(true);

      const user = auth.currentUser;
      if (!user) {
        setError("Usuário não logado");
        navigate("/");
        return;
      }

      const response = await axios.get("https://jp-project-back-production.up.railway.app/upload/files", {
        headers: {
          Authorization: `Bearer ${await user.getIdToken()}`,
        },
      });

      setFiles(response.data);
    } catch (error) {
      setError("Erro ao carregar arquivos");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // const newFile = (newFile: File) => {
  //   setFiles((prevFiles) => [...prevFiles, newFile]);
  // };

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  return { files, error, loading, fetchFiles };
};