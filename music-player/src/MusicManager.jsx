import React, { useState, useEffect } from 'react';
import pb from './pocketbase';

const MusicManager = () => {
  const [songs, setSongs] = useState([]);
  const [user, setUser] = useState(pb.authStore.model);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploading, setUploading] = useState(false);
  const [titleInput, setTitleInput] = useState("");
  const [artistInput, setArtistInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (user) {
      fetchSongs();
      pb.collection('songs').subscribe('*', ({ action, record }) => {
        if (action === 'create') setSongs((prev) => [record, ...prev]);
        if (action === 'delete') setSongs((prev) => prev.filter((s) => s.id !== record.id));
      });
    }
    return () => pb.collection('songs').unsubscribe('*');
  }, [user]);

  const fetchSongs = async () => {
    try {
      const records = await pb.collection('songs').getFullList({ sort: '-created' });
      setSongs(records);
    } catch (err) { console.error(err); }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        await pb.collection('users').create({ email, password, passwordConfirm: password });
      }
      await pb.collection('users').authWithPassword(email, password);
      setUser(pb.authStore.model);
    } catch (err) { alert("Auth failed! Check rules or password length."); }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return alert("Select a file!");
    setUploading(true);
    const formData = new FormData();
    formData.append('audio', selectedFile);
    formData.append('title', titleInput || selectedFile.name);
    formData.append('artist', artistInput || "Unknown");

    try {
      await pb.collection('songs').create(formData);
      setTitleInput(""); setArtistInput(""); setSelectedFile(null);
    } catch (err) { alert("Upload failed! Check API Rules/File Size in PocketBase Dashboard."); }
    finally { setUploading(false); }
  };

  const filteredSongs = songs.filter(s => 
    s.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.artist?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!user) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2>{isSignUp ? "Sign Up" : "Login"}</h2>
          <form onSubmit={handleAuth}>
            <input style={styles.input} type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} required />
            <input style={styles.input} type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required />
            <button style={styles.btn} type="submit">{isSignUp ? "Register" : "Login"}</button>
          </form>
          <button onClick={() => setIsSignUp(!isSignUp)} style={{background: 'none', color: '#1DB954', border: 'none', marginTop: '10px'}}>
            {isSignUp ? "Already have an account? Login" : "Need an account? Sign Up"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Music Manager</h1>
        <button onClick={() => {pb.authStore.clear(); setUser(null);}} style={styles.logoutBtn}>Logout</button>
      </div>
      <div style={styles.card}>
        <h3>Add New Track</h3>
        <form onSubmit={handleUpload}>
          <input style={styles.input} placeholder="Title" value={titleInput} onChange={e => setTitleInput(e.target.value)} />
          <input style={styles.input} placeholder="Artist" value={artistInput} onChange={e => setArtistInput(e.target.value)} />
          <input type="file" accept="audio/*" onChange={e => setSelectedFile(e.target.files)} style={{color: 'white', marginBottom: '10px'}} />
          <button style={styles.btn} disabled={uploading}>{uploading ? "Uploading..." : "Upload"}</button>
        </form>
      </div>
      <div style={{maxWidth: '800px', margin: '20px auto'}}>
        <input style={styles.search} placeholder="Search tracks..." onChange={e => setSearchQuery(e.target.value)} />
        {filteredSongs.map(song => (
          <div key={song.id} style={styles.row}>
            <div>
              <div style={{fontWeight: 'bold'}}>{song.title}</div>
              <div style={{color: '#aaa'}}>{song.artist}</div>
            </div>
            <audio controls src={pb.files.getURL(song, song.audio)} />
            <button onClick={() => pb.collection('songs').delete(song.id)} style={styles.delBtn}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: { backgroundColor: '#000', color: '#fff', minHeight: '100vh', padding: '20px' },
  card: { background: '#111', padding: '20px', borderRadius: '10px', maxWidth: '400px', margin: '0 auto' },
  input: { width: '100%', padding: '10px', marginBottom: '10px', background: '#222', color: '#fff', border: 'none' },
  btn: { width: '100%', padding: '10px', background: '#1DB954', color: 'white', border: 'none', fontWeight: 'bold' },
  search: { width: '100%', padding: '10px', marginBottom: '20px', background: '#111', color: '#fff', border: '1px solid #333' },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderBottom: '1px solid #222' },
  delBtn: { color: '#ff4444', background: 'none', border: '1px solid #ff4444', padding: '5px' },
  header: { display: 'flex', justifyContent: 'space-between', maxWidth: '800px', margin: '0 auto' },
  logoutBtn: { background: '#333', color: 'white', border: 'none', padding: '5px 10px' }
};

export default MusicManager;