import { useEffect, useState } from "react";
import pb from "../pocketbase";

export default function SongList() {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    const records = await pb.collection("songs").getFullList();
    setSongs(records);
  };

  return (
    <div>
      {songs.map(song => (
        <div key={song.id}>
          <h3>{song.title}</h3>
          <p>{song.artist}</p>
        </div>
      ))}
    </div>
  );
  <audio controls>
  <source
    src={`http://127.0.0.1:8090/api/files/songs/${song.id}/${song.file}`}
    type="audio/mp3"
  />
</audio>
}