import React, { useState } from "react";
import { storage, db } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";

function UploadSong() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");

  const uploadSong = async () => {
    if (!file) return;

    const fileRef = ref(storage, `songs/${file.name}`);

    await uploadBytes(fileRef, file);

    const url = await getDownloadURL(fileRef);

    await addDoc(collection(db, "songs"), {
      title: title,
      url: url
    });

    alert("Song Uploaded!");
  };

  return (
    <div>
      <h2>Upload Song</h2>

      <input
        type="text"
        placeholder="Song Title"
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        type="file"
        accept="audio/*"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button onClick={uploadSong}>Upload</button>
    </div>
  );
}

export default UploadSong;