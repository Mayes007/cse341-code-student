import React, { useState, useEffect } from 'react';
import pb from './pocketbase'; // Use your pocketbase.js export

const MusicManager = () => {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [titleInput, setTitleInput] = useState("");
  const [artistInput, setArtistInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const records = await pb.collection('songs').getFullList({ sort: '-created' });
        setSongs(records);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchSongs();

    pb.collection('songs').subscribe('*', ({ action, record }) => {
      if (action === 'create') setSongs((prev) => [record, ...prev]);
      if (action === 'delete') setSongs((prev) => prev.filter((s) => s.id !== record.id));
    });

    return () => pb.collection('songs').unsubscribe('*');
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return alert("Please select a file!");

    setUploading(true);
    const formData = new FormData();

    // MATCHING YOUR DASHBOARD: title, artist, audio
    formData.append('audio', selectedFile); 
    formData.append('title', titleInput || selectedFile.name); 
    formData.append('artist', artistInput || "Unknown"); 

    try {
      await pb.collection('songs').create(formData);
      setTitleInput("");
      setArtistInput("");
      setSelectedFile(null);
      document.getElementById('file-input').value = "";
      alert("Upload successful!");
    } catch (err) {
      console.error("Error:", err.response);
      alert("Upload failed. Check the console!");
    } finally {
      setUploading(false);
    }
  };

  const filteredSongs = songs.filter(s => 
    s.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.artist?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="app-container" style={styles.container}>
      <h1 style={styles.mainTitle}>Music Manager</h1>

      <div style={styles.uploadCard}>
        <h2 style={{ marginTop: 0 }}>Add New Track</h2>
        <form onSubmit={handleUpload}>
          <input 
            type="text" 
            placeholder="Song Title" 
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            style={styles.input}
          />
          <input 
            type="text" 
            placeholder="Artist Name" 
            value={artistInput}
            onChange={(e) => setArtistInput(e.target.value)}
            style={styles.input}
          />
          <input 
            id="file-input"
            type="file" 
            accept="audio/*" 
            onChange={(e) => setSelectedFile(e.target.files)} // FIXED: added
            style={{ marginBottom: '20px', color: 'white' }}
          />
          <button type="submit" style={styles.uploadBtn} disabled={uploading}>
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '100px' }}>
        <h2>Your Playlist</h2>
        <input 
          type="text" 
          placeholder="Search library..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.searchBar}
        />
        {filteredSongs.map(song => (
          <div key={song.id} style={styles.songRow} onClick={() => setCurrentSong({ ...song, url: pb.files.getURL(song, song.audio) })}>
            <div>
              <div style={{ fontWeight: 'bold' }}>{song.title}</div>
              <div style={{ color: '#aaa', fontSize: '0.9rem' }}>{song.artist}</div>
            </div>
            <button onClick={(e) => { e.stopPropagation(); pb.collection('songs').delete(song.id); }} style={styles.delBtn}>Delete</button>
          </div>
        ))}
      </div>

      {currentSong && (
        <div style={styles.player}>
          <p style={{margin: '0 0 10px 0'}}>Playing: {currentSong.title} - {currentSong.artist}</p>
          <audio controls autoPlay src={currentSong.url} style={{ width: '100%' }} />
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { backgroundColor: '#000', color: '#fff', minHeight: '100vh', padding: '20px', fontFamily: 'Arial, sans-serif' },
  mainTitle: { textAlign: 'center', fontSize: '3rem', marginBottom: '40px' },
  uploadCard: { backgroundColor: '#111', padding: '25px', borderRadius: '12px', maxWidth: '450px', margin: '0 auto 40px auto', border: '1px solid #333' },
  input: { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '6px', border: 'none', backgroundColor: '#222', color: '#fff', boxSizing: 'border-box' },
  uploadBtn: { width: '100%', padding: '12px', backgroundColor: '#1DB954', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' },
  searchBar: { width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '6px', border: '1px solid #333', backgroundColor: '#111', color: '#fff' },
  songRow: { display: 'flex', justifyContent: 'space-between', padding: '15px', borderBottom: '1px solid #222', cursor: 'pointer' },
  delBtn: { background: 'none', border: '1px solid #ff4444', color: '#ff4444', borderRadius: '4px', cursor: 'pointer', padding: '5px 10px' },
  player: { position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#111', padding: '20px', borderTop: '2px solid #1DB954', textAlign: 'center', zIndex: 100 }
};

export default MusicManager;