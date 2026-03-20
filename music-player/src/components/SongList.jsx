import { useEffect, useState } from "react";
import pb from "../lib/pocketbase";

export default function SongList() {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      // It's good practice to sort by newest first
      const records = await pb.collection("songs").getFullList({ sort: '-created' });
      setSongs(records);
    } catch (err) {
      console.error("Error fetching songs:", err);
    }
  };

  return (
    <div style={{ padding: '20px', color: 'white', backgroundColor: '#000' }}>
      <h2>My Tracks</h2>
      {songs.length === 0 && <p>No songs found. Upload some!</p>}
      
      {songs.map(song => (
        <div key={song.id} style={{ marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
          <h3 style={{ margin: '0' }}>{song.title || "Untitled"}</h3>
          <p style={{ color: '#aaa', margin: '5px 0' }}>{song.artist || "Unknown Artist"}</p>
          
          {/* Use the PocketBase helper for the URL */}
          {song.audio ? (
            <audio controls style={{ width: '100%', height: '35px' }}>
              <source
                src={pb.files.getUrl(song, song.audio)}
                type="audio/mpeg"
              />
              Your browser does not support the audio element.
            </audio>
          ) : (
            <p style={{ color: 'red', fontSize: '12px' }}>Audio file missing</p>
          )}
        </div>
      ))}
    </div>
  );
}