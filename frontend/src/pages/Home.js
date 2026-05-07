import React from 'react';
import '../styles/Home.css';

function Home() {
  return (
    <div className="home-container">
      <h1>Welcome to Video Vault Playlist</h1>
      <p>Manage your videos and playlists in one place</p>
      <div className="features">
        <div className="feature">
          <h3>Upload Videos</h3>
          <p>Upload and manage your video collection</p>
        </div>
        <div className="feature">
          <h3>Create Playlists</h3>
          <p>Organize videos into custom playlists</p>
        </div>
        <div className="feature">
          <h3>Share & Collaborate</h3>
          <p>Share playlists with friends and colleagues</p>
        </div>
      </div>
      <div className="auth-links">
        <a href="/login" className="btn btn-login">Login</a>
        <a href="/signup" className="btn btn-signup">Sign Up</a>
      </div>
    </div>
  );
}

export default Home;