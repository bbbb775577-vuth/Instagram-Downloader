const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Instagram Downloader API is running successfully!');
});

app.post('/api/download', async (req, res) => {
    let userInstagramUrl = req.body.url;

    if (!userInstagramUrl) {
        return res.json({ success: false, message: "Please enter an Instagram Link!" });
    }

    // ស្រង់យក Shortcode ទុកធ្វើជាឈ្មោះ File สำรอง
    let shortcode = "instagram_media";
    try {
        const urlObj = new URL(userInstagramUrl);
        const pathSegments = urlObj.pathname.split('/').filter(Boolean);
        const index = pathSegments.findIndex(seg => seg === 'p' || seg === 'reel' || seg === 'tv');
        if (index !== -1 && pathSegments[index + 1]) {
            shortcode = pathSegments[index + 1];
        }
    } catch (e) {}

    // កំណត់តម្លៃតាមទម្រង់របស់ «Download All in One!» (POST Request)
    const options = {
        method: 'POST',
        url: 'https://instagram-downloader-download-instagram-videos-stories1.p.rapidapi.com/download', // ជំនួស Endpoint ឱ្យត្រូវនឹង Instagram
        headers: {
            'content-type': 'application/json',
            'x-rapidapi-key': '54fb74925dmsh8e15526f336a480p1844d4jsn86f649cc2db6',
            'x-rapidapi-host': 'instagram-downloader-download-instagram-videos-stories1.p.rapidapi.com'
        },
        data: {
            url: userInstagramUrl
        }
    };

    try {
        const response = await axios.request(options);
        
        if (!response.data) {
            return res.json({ success: false, message: "No data received from API." });
        }

        res.json({
            success: true,
            caption: shortcode,
            data: response.data
        });

    } catch (error) {
        console.error("API Error:", error.response?.data || error.message);
        res.json({
            success: false,
            message: "Error fetching data from Instagram or API quota exceeded."
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
