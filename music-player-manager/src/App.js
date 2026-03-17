import React, { useState } from "react";
import UploadSong from "./components/UploadSong";
import SongList from "./components/SongList";
import Player from "./components/Player";

function App() {

  const [currentSong, setCurrentSong] = useState(null);

  return (
    <div style={{ textAlign: "center" }}>

      <h1>🎵 Music Player Manager</h1>

      <UploadSong />

      <SongList setCurrentSong={setCurrentSong} />

      <Player song={currentSong} />

    </div>
  );
}

export default App;