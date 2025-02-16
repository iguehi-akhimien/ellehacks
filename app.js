const { MongoClient, ObjectId, GridFSBucket } = require('mongodb');
const fs = require('fs');
const express = require('express');
const app = express();
const port = 3001;  // Changed port to 3001
const cors = require('cors');

// Use CORS with better configuration
app.use(cors({
  origin: 'http://localhost:8080',  // Allow requests only from this domain (adjust as needed)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allow specific HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept'],  // Allow headers
  credentials: true  // Allow cookies and credentials (ensure both frontend and backend handle this)
}));


// MongoDB connection details
const url = 'mongodb://localhost:27017'; // Local MongoDB server URL
const dbName = 'test';  // Database name

// Create a new MongoClient
const client = new MongoClient(url);

// Express middleware to serve static files
app.use(express.static('public'));

// Connect to MongoDB
async function connectToMongoDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    // Get a reference to the database
    const db = client.db(dbName);

    // Start the server and connect to MongoDB
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });

    // Create text index on the filenames collection
    await createTextIndex(db);

    // Upload the videos (only once, or you can call this as needed)
    const videoPaths = [
      '/Users/hasitamandaleeka/Downloads/Elle_hacks/Joining a Zoom Meeting.mp4',
      '/Users/hasitamandaleeka/Downloads/Elle_hacks/My device sound does not work.mp4',
      '/Users/hasitamandaleeka/Downloads/Elle_hacks/Logging in to your Instagram Account.mp4',
      '/Users/hasitamandaleeka/Downloads/Elle_hacks/Creating and Setting Up Your Instagram Account.mp4', // Add more paths as needed
    ];

    for (const videoPath of videoPaths) {
      await storeVideo(db, videoPath); // Upload videos to MongoDB using GridFS
    }

  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
}

// Function to store an MP4 video in MongoDB using GridFSBucket
async function storeVideo(db, videoPath) {
  const bucket = new GridFSBucket(db, {
    bucketName: 'videos' // Specify the name of the GridFS bucket
  });

  const videoStream = fs.createReadStream(videoPath); // Create a read stream for the video file

  // Create a GridFS write stream to store the file
  const uploadStream = bucket.openUploadStream(videoPath.split('/').pop(), {
    contentType: 'video/mp4', // Content type for the video
  });

  // Pipe the video stream to the GridFS write stream
  videoStream.pipe(uploadStream);

  uploadStream.on('finish', () => {
    // Access the file ID from uploadStream.id (not from file._id)
    console.log(`Video stored in MongoDB with ID: ${uploadStream.id}`);
  });

  uploadStream.on('error', (err) => {
    console.error('Error uploading video to MongoDB:', err);
  });
}

// Function to create a text index on the 'filename' field in the files collection
async function createTextIndex(db) {
  const collection = db.collection('videos.files');  // GridFS collection for files
  await collection.createIndex({ filename: 'text' }); // Creates the text index on the filename field
  console.log("Text index created on 'filename'");
}

// Search for videos by query in MongoDB
app.get('/search', async (req, res) => {
  const query = req.query.query;  // Get the search query from the URL query string

  if (!query) {
    return res.status(400).json({ message: 'Query parameter is required' });
  }

  try {
    const db = client.db(dbName);
    const collection = db.collection('videos.files');  // GridFS collection for files

    // Perform text search on filenames
    const videos = await collection.find({ $text: { $search: query } }).toArray();

    // If no videos were found, return a message indicating this
    if (videos.length === 0) {
      return res.status(404).json({ message: 'No videos found' });
    }

    // Format the response to include paths or URLs to the video files
    const videoResults = videos.map(video => ({
      path: `http://localhost:${port}/video/${video._id}`, // Full path for frontend
      filename: video.filename // Optional: include the filename in the response
    }));

    res.json(videoResults);  // Send the results back as JSON
  } catch (err) {
    console.error('Error searching videos:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Serve video files based on video ID
app.get('/video/:id', async (req, res) => {
  const videoId = req.params.id;  // Get the video ID from the URL parameter

  try {
    const db = client.db(dbName);
    const bucket = new GridFSBucket(db, { bucketName: 'videos' });

    // Create a download stream using the ObjectId of the video
    const readStream = bucket.openDownloadStream(new ObjectId(videoId));
    
    // Pipe the stream to the response (this will send the video to the client)
    readStream.pipe(res);

    readStream.on('error', (err) => {
      console.error('Error downloading video:', err);
      res.status(500).json({ message: 'Error streaming video' });
    });
    
  } catch (err) {
    console.error('Error serving video:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Call the function to connect and upload videos to MongoDB
connectToMongoDB();
