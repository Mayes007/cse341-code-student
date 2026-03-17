import { useState, useEffect } from 'react'
import { db } from './firebaseConfig' // Make sure this file exists in /src
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import './App.css'


function App() {
  const [songs, setSongs] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  // Fetch songs from Firestore on load
  useEffect(() => {
    const q = query(collection(db, "songs"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setSongs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const currentSong = songs[currentTrackIndex];

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % songs.length);
  };

return (
    <>
      <section id="center">
        <div className="hero">
          <h1>{currentSong ? currentSong.title : "No Song Selected"}</h1>
          <p>{currentSong ? currentSong.artist : "Upload music to start"}</p>
        </div>

        {/* The Audio Element */}
        <audio 
          src={currentSong?.audioUrl} 
          controls 
          autoPlay 
          onEnded={nextTrack} 
        />

        <div className="controls">
           <button onClick={nextTrack}>Next Track</button>
        </div>
      </section>

      <section id="next-steps">
        <h2>Your Playlist</h2>
        <ul>
          {songs.map((song, index) => (
            <li key={song.id} onClick={() => setCurrentTrackIndex(index)}>
              {song.title} - {song.artist}
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
    


