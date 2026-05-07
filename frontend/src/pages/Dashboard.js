import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Dashboard.css';

function Dashboard() {
  const [videos, setVideos] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const videosResponse = await axios.get('http://localhost:5000/api/videos', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const playlistsResponse = await axios.get('http://localhost:5000/api/playlists', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setVideos(videosResponse.data);
        setPlaylists(playlistsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchData();
  }, [token]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="dashboard">
      <h1>Welcome to Video Vault</h1>
      <div className="dashboard-content">
        <section className="videos-section">
          <h2>Your Videos ({videos.length})</h2>
          <ul>
            {videos.map((video) => (
              <li key={video._id}>
                <h3>{video.title}</h3>
                <p>{video.description}</p>
                {video.tags && <p>Tags: {video.tags.join(', ')}</p>}
              </li>
            ))}
          </ul>
        </section>
        <section className="playlists-section">
          <h2>Your Playlists ({playlists.length})</h2>
          <ul>
            {playlists.map((playlist) => (
              <li key={playlist._id}>
                <h3>{playlist.name}</h3>
                <p>{playlist.description}</p>
                <p>Videos: {playlist.videos.length}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <button onClick={() => window.location.href = '/'}>Logout</button>
    </div>
  );
}

export default Dashboard;