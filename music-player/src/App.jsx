import React, { useState, useEffect, useRef } from 'react';
import { pb } from './lib/pocketbase';
import './App.css';

function App() {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const audioRef = useRef(new Audio());

  // Fetch songs on mount
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const records = await pb.collection('songs').getFullList({
          sort: '-created',
        });
        setSongs(records);
      } catch (err) {
        console.error("Error loading songs:", err);
      }
    };
    fetchSongs();
  }, []);

  // Update progress bar as song plays
  useEffect(() => {
    const audio = audioRef.current;
    const updateProgress = () => {
      const value = (audio.currentTime / audio.duration) * 100;
      setProgress(value || 0);
    };

    audio.addEventListener('timeupdate', updateProgress);
    return () => audio.removeEventListener('timeupdate', updateProgress);
  }, []);

  const handlePlayPause = (song) => {
    const audio = audioRef.current;
    
    // If clicking the SAME song
    if (currentSong?.id === song.id) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    } 
    // If clicking a NEW song
    else {
      const fileUrl = pb.files.getUrl(song, song.audio_file);
      audio.src = fileUrl;
      audio.play();
      setCurrentSong(song);
      setIsPlaying(true);
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>Music Manager</h1>
        <p className="subtitle">React + PocketBase</p>
      </header>

      <main className="song-list">
        {songs.map((song) => (
          <div 
            key={song.id} 
            className={`song-card ${currentSong?.id === song.id ? 'active' : ''}`}
          >
            <div className="song-info">
              <h3>{song.title}</h3>
              <p>{song.artist}</p>
            </div>
            <button 
              className="play-btn" 
              onClick={() => handlePlayPause(song)}
            >
              {currentSong?.id === song.id && isPlaying ? '⏸ Pause' : '▶ Play'}
            </button>
          </div>
        ))}
      </main>

      {currentSong && (
        <footer className="player-bar">
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="now-playing">
            <span>Now Playing: <strong>{currentSong.title}</strong> - {currentSong.artist}</span>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;