import UploadFile from "../../components/fileUploadComponent";
import AudioComponent from "../../components/audioComponent";
import "./Home.css";

function Home () {
  return (
    <div className="home-container">
      <h1>Upload de Arquivos e Áudio</h1>
      <p>Faça upload de arquivos ou grave um áudio para transcrição.</p>

      <UploadFile />
      <AudioComponent />
    </div>
  );
}

export default Home;