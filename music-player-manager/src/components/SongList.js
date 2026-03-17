import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

function SongList({ setCurrentSong }) {

  const [songs, setSongs] = useState([]);

  useEffect(() => {
    const getSongs = async () => {
      const querySnapshot = await getDocs(collection(db, "songs"));

      const songData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setSongs(songData);
    };

    getSongs();
  }, []);

  return (
    <div>
      <h2>Playlist</h2>

      {songs.map(song => (
        <div key={song.id}>
          <button onClick={() => setCurrentSong(song.url)}>
            ▶ {song.title}
          </button>
        </div>
      ))}
    </div>
  );
}

export default SongList;