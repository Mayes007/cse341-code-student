import { useState } from "react";
import pb from "../lib/pocketbase";

export default function UploadSong() {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [file, setFile] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("Title", Title);
    formData.append("Artist", Artist);
    formData.append("file", file);

    await pb.collection("songs").create(formData);

    alert("Song uploaded!");
  };

  return (
    <form onSubmit={handleUpload}>
      <input placeholder="title" onChange={(e)=>setTitle(e.target.value)} />
      <input placeholder="artist" onChange={(e)=>setArtist(e.target.value)} />
      <input type="file" onChange={(e)=>setFile(e.target.files[0])} />
      <button type="submit">Upload</button>
    </form>
  );
}