import UploadSong from "./components/UploadSong";
import SongList from "./components/SongList";

function App() {
  return (
    <div className="app">
      <h1>Music Manager</h1>

      <div className="card">
        <h2>Add New Track</h2>
        <UploadSong />
      </div>

      <div className="playlist">
        <h2>Your Playlist</h2>
        <SongList />
      </div>
    </div>
  );
}

export default App;