const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const Grid = require('gridfs-stream');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB URI (replace with your MongoDB URI)
const mongoURI = 'mongodb://localhost:27017/videoDB';

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Create a GridFS stream
let gfs;
const conn = mongoose.connection;
conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('videos');
});

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Video metadata schema
const VideoSchema = new mongoose.Schema({
  title: String,
  description: String,
  keywords: [String],
  fileId: mongoose.Schema.Types.ObjectId
});

const Video = mongoose.model('Video', VideoSchema);

// Upload video route
app.post('/upload', upload.single('videoFile'), (req, res) => {
  const { title, description, keywords } = req.body;
  const videoFile = req.file;

  // Store the video in GridFS
  const writeStream = gfs.createWriteStream({
    filename: videoFile.originalname,
    content_type: videoFile.mimetype
  });
  writeStream.write(videoFile.buffer);
  writeStream.end();

  // Save video metadata to MongoDB
  const newVideo = new Video({
    title,
    description,
    keywords: keywords.split(','),  // split keywords if passed as a comma-separated string
    fileId: writeStream.id
  });

  newVideo.save()
    .then(video => res.json({ success: true, video }))
    .catch(err => res.status(500).json({ success: false, error: err }));
});

// Search videos route
app.get('/search', (req, res) => {
  const { keyword } = req.query;
  
  // Search for videos with matching keywords
  Video.find({ keywords: { $in: [keyword] } })
    .then(videos => res.json(videos))
    .catch(err => res.status(500).json({ success: false, error: err }));
});

// Serve video content
app.get('/video/:id', (req, res) => {
  const videoId = req.params.id;
  gfs.files.findOne({ _id: mongoose.Types.ObjectId(videoId) }, (err, file) => {
    if (err || !file) {
      return res.status(404).json({ err: 'Video not found' });
    }
    const readStream = gfs.createReadStream(file.filename);
    readStream.pipe(res);
  });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
