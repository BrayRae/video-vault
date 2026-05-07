const express = require('express');
const Playlist = require('../models/Playlist');
const router = express.Router();

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  const jwt = require('jsonwebtoken');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Create playlist
router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, description, isPublic } = req.body;

    const newPlaylist = new Playlist({
      name,
      description,
      userId: req.userId,
      isPublic: isPublic || false
    });

    await newPlaylist.save();
    res.status(201).json({ message: 'Playlist created successfully', playlist: newPlaylist });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all playlists for a user
router.get('/', verifyToken, async (req, res) => {
  try {
    const playlists = await Playlist.find({ userId: req.userId }).populate('videos');
    res.json(playlists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add video to playlist
router.post('/:id/videos', verifyToken, async (req, res) => {
  try {
    const { videoId } = req.body;
    const playlist = await Playlist.findById(req.params.id);

    if (!playlist) return res.status(404).json({ error: 'Playlist not found' });
    if (playlist.userId.toString() !== req.userId) return res.status(403).json({ error: 'Unauthorized' });

    if (!playlist.videos.includes(videoId)) {
      playlist.videos.push(videoId);
      await playlist.save();
    }

    res.json({ message: 'Video added to playlist', playlist });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete playlist
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    if (!playlist) return res.status(404).json({ error: 'Playlist not found' });
    if (playlist.userId.toString() !== req.userId) return res.status(403).json({ error: 'Unauthorized' });

    await Playlist.findByIdAndDelete(req.params.id);
    res.json({ message: 'Playlist deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;