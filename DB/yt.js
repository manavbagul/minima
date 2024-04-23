const axios = require("axios");

require("dotenv").config();

async function fetchTrailer(Movie, cb) {
  try {
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          q: Movie,
          part: "snippet",
          maxResults: 1,
          type: "video",
          key: process.env.YTAPI,
        },
      }
    );

    const videoId = response.data.items[0].id.videoId;
    return videoId;
  } catch (error) {
    console.error("Error fetching trailer:", error.response.data.error.message);
    return null;
  }
}

exports.fetchTrailer = fetchTrailer;
