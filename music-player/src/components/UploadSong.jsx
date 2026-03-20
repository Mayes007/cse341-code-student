import { useState } from "react";
import pb from "../lib/pocketbase";

export default function UploadSong() {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [file, setFile] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) return alert("Please select a file first!");

    const formData = new FormData();
    
    // FIX 1: Match the lowercase field names in your PocketBase dashboard
    formData.append("title", title); 
    formData.append("artist", artist);
    
    // FIX 2: Change "file" to "audio" to match your collection schema
    formData.append("audio", file); 

    try {
      await pb.collection("songs").create(formData);
      alert("Song uploaded successfully!");
      // Reset form
      setTitle("");
      setArtist("");
      setFile(null);
      e.target.reset();
    } catch (err) {
      console.error("Upload Error:", err);
      alert("Upload failed. Make sure the 'audio' field exists in PB.");
    }
  };

  return (
    <form onSubmit={handleUpload}>
      <input 
        placeholder="Title" 
        value={title}
        onChange={(e) => setTitle(e.target.value)} 
      />
      <input 
        placeholder="Artist" 
        value={artist}
        onChange={(e) => setArtist(e.target.value)} 
      />
      {/* setFile(e.target.files) is correct here for a single file upload */}
      <input 
        type="file" 
        accept="audio/*"
        onChange={(e) => setFile(e.target.files)} 
      />
      <button type="submit">Upload</button>
    </form>
  );
}