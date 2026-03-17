import React from "react";

function Player({ song }) {

  if (!song) return <p>Select a song to play</p>;

  return (
    <div>
      <h2>Now Playing</h2>

      <audio controls src={song}>
        Your browser does not support audio.
      </audio>
    </div>
  );
}

export default Player;