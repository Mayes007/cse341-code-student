function Song({ title, artist }) {
  return (
    <div className="song-card">
      <h3>{title}</h3>
      <p>{artist}</p>
    </div>
  );
}
export default Song;