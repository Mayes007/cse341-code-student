import React, { useState, useEffect } from 'react';
import pb from './lib/pocketbase';

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

  // UPDATED handleUpload function
  const handleUpload = async (e) => {
    e.preventDefault();
    // Check for the file and ensure the first element exists
    if (!selectedFile || selectedFile.length === 0) return alert("Select a file!");
    
    setUploading(true);
    const formData = new FormData();
    
    // FIX: Access the file at index 0 from the FileList
    const fileToUpload = selectedFile; 
    
    // formData.append matches the 'audio' field in your dashboard
    formData.append('audio', fileToUpload); 
    formData.append('title', titleInput || fileToUpload.name);
    formData.append('artist', artistInput || "Unknown");

    try {
      await pb.collection('songs').create(formData);
      setTitleInput(""); 
      setArtistInput(""); 
      setSelectedFile(null);
      // Manually reset the file input field if you find it stays "stuck"
      e.target.reset(); 
      alert("Upload successful!");
    } catch (err) { 
        console.error("Upload Error:", err);
        // This triggers if the file structure, field names, or size limits are an issue
        alert("Upload failed! Check that 'Max file size' in PB is set to 2GB."); 
    } finally { 
        setUploading(false); 
    }
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
          <button onClick={() => setIsSignUp(!isSignUp)} style={{background: 'none', color: '#1DB954', border: 'none', marginTop: '10px', cursor: 'pointer'}}>
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
          <button style={styles.btn} type="submit" disabled={uploading}>{uploading ? "Uploading..." : "Upload"}</button>
        </form>
      </div>
      <div style={{maxWidth: '800px', margin: '20px auto'}}>
        <input style={styles.search} placeholder="Search tracks..." onChange={e => setSearchQuery(e.target.value)} />
        {filteredSongs.map(song => (
          <div key={song.id} style={styles.row}>
            <div style={{flex: 1}}>
              <div style={{fontWeight: 'bold'}}>{song.title}</div>
              <div style={{color: '#aaa'}}>{song.artist}</div>
            </div>
            {/* Using song.audio to match the dashboard */}
            <audio 
              controls 
              preload="metadata"
              src={pb.files.getUrl(song, song.audio)} 
              style={{height: '35px', marginRight: '10px'}}
            />
            <button onClick={() => pb.collection('songs').delete(song.id)} style={styles.delBtn}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: { backgroundColor: '#000', color: '#fff', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' },
  card: { background: '#111', padding: '20px', borderRadius: '10px', maxWidth: '400px', margin: '0 auto' },
  input: { width: '100%', padding: '10px', marginBottom: '10px', background: '#222', color: '#fff', border: 'none', boxSizing: 'border-box' },
  btn: { width: '100%', padding: '10px', background: '#1DB954', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer' },
  search: { width: '100%', padding: '10px', marginBottom: '20px', background: '#111', color: '#fff', border: '1px solid #333', boxSizing: 'border-box' },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #222' },
  delBtn: { color: '#ff4444', background: 'none', border: '1px solid #ff4444', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '800px', margin: '0 auto' },
  logoutBtn: { background: '#333', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }
};

export default MusicManager;