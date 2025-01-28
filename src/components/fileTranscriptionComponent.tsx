import { useState, useEffect } from "react";
import axios from "axios";

interface FileTranscriptionProps {
  file: {
    id: number;
    filetype: string;
    filename: string;
    transcription: string;
  } | null;
}

const FileTranscription = ({ file }: FileTranscriptionProps) => {
  const [apiResponse, setApiResponse] = useState<string | null>(null);

  useEffect(() => {
    setApiResponse(null); // Limpa a resposta quando `file` muda
  }, [file]);

  if (!file) {
    return <p>Selecione um arquivo para ver a transcrição</p>;
  }

  const handleSendPrompt = async (transcription: string) => {
    try {
      const response = await axios.post("https://jp-project-back-production.up.railway.app/ia/gemini", {
        prompt: transcription,
      })

      setApiResponse(response.data.response);
    } catch (error) {
      console.error(error);
      setApiResponse("Erro ao enviar transcrição para a OpenAI");
    }
  };

  return (
    <div>
      {file.filetype.startsWith("audio") || file.filetype.startsWith("video") ? (
        <>
          <h3>Transcrição do arquivo {file.filename}:</h3>
          <p>{file.transcription}</p>
        </>
      ) : (
        <p>Este arquivo não possui transcrição. Apenas arquivos de áudio possuem transcrição.</p>
      )}

      <button
        onClick={() => handleSendPrompt(file.transcription)}
      >
        Enviar para IA
      </button>

      {apiResponse && (
        <>
          {apiResponse === "Erro ao enviar transcrição para a OpenAI" ? (
            <p>{apiResponse}</p>
          ) : (
            <div>
              <h3>Resposta da OpenAI</h3>
              <p>{apiResponse}</p>
            </div>
          )}
        </>
      )}

    </div>
  );
};

export default FileTranscription;