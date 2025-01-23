import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/firebaseConfig";
import axios from "axios";

interface File {
  id: number;
  filename: string;
  filetype: string;
}

export const useListFiles = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setError("Usuário não logado");
          navigate("/");
          return;
        }

        const response = await axios.get("http://localhost:3000/upload/files", { //Lembrar de voltar para o endereço do Railway
          headers: {
            Authorization: `Bearer ${await user.getIdToken()}`,
          },
        });

        setFiles(response.data);
      } catch (err) {
        setError("Erro ao buscar arquivos");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [navigate]);

  return { files, error, loading };
};