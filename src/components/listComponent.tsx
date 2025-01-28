import { useListFiles } from "../hooks/useListFiles";
import refreshSVG from "../assets/refresh-svgrepo-com.svg";

interface singleFile {
  id: number;
  filename: string;
  filetype: string;
  transcription: string;
}

interface ListComponentProps {
  onFileSelect: (file: singleFile | null) => void;
}

const ListComponent = ({ onFileSelect }: ListComponentProps) => {
  const { files, loading, error, fetchFiles } = useListFiles();
  
  if (loading) {
    return <p>Carregando arquivos...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!files || !files.length) {
    return <p>Nenhum arquivo encontrado</p>;
  }

  return (
    <div className="list-section">
      <div className="list-section-header">
        <h2>Lista de Arquivos</h2>
        <button onClick={fetchFiles}>
          <img src={refreshSVG} alt="Atualizar"/>
        </button>
      </div>
      <ul>
        {files.map((file) => (
          <li key={file.id}>
            <button onClick={ () => onFileSelect(file)}>
              {file.filename} -- {file.filetype}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListComponent;
