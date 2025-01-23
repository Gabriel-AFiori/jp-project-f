import { useListFiles } from "../hooks/useListFiles";

const ListComponent = () => {
  const { files, loading, error } = useListFiles();

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
    <div>
      <h3>Lista de Arquivos</h3>
      <ul>
        {files.map((file) => (
          <li key={file.id}>
            <button>{file.filename} - {file.filetype}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListComponent;
