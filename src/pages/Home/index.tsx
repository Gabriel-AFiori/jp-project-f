import { useState } from "react";
import UploadFile from "../../components/fileUploadComponent";
import AudioComponent from "../../components/audioComponent";
import ListComponent from "../../components/listComponent";
import FileTranscription from "../../components/fileTranscriptionComponent";
import "./Home.css";

interface FileType {
  id: number;
  filename: string;
  filetype: string;
  transcription: string;
}

function Home () {
  const [selectedFile, setSelectedFile] = useState<FileType | null>(null);

  return (
    <div className="home-container">
      <div>
        <UploadFile />
        <AudioComponent />
      </div>
      
      <div className="list-container">
        <ListComponent onFileSelect={setSelectedFile} />
      </div>
      
      <div className="transcription-container">
        <FileTranscription file={selectedFile} />
      </div>
    </div>
  );
}

export default Home;