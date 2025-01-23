import UploadFile from "../../components/fileUploadComponent";
import AudioComponent from "../../components/audioComponent";
import ListComponent from "../../components/listComponent";
import "./Home.css";

function Home () {
  return (
    <div>
      <div className="home-container">
        <UploadFile />
        <AudioComponent />
      </div>
      <ListComponent />
    </div>
  );
}

export default Home;