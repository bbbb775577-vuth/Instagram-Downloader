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

    // កំណត់តម្លៃតាម Code snippet ពិតប្រាកដរបស់ RapidAPI (GET Method + Params)
    const options = {
        method: 'GET',
        url: 'https://instagram-downloader-download-instagram-videos-stories1.p.rapidapi.com/fetch',
        params: {
            url: userInstagramUrl
        },
        headers: {
            'x-rapidapi-key': '54fb74925dmsh8e15526f336a480p1844d4jsn86f649cc2db6',
            'x-rapidapi-host': 'instagram-downloader-download-instagram-videos-stories1.p.rapidapi.com'
        }
    };

try {
        const response = await axios.request(options);
        
        if (!response.data) {
            return res.json({ success: false, message: "No data received from API." });
        }

        // ព្យាយាមទាញយក Caption ឬ Title ពី Response របស់ API
        let apiCaption = response.data.caption || response.data.title || response.data.description || "";

        // បើ API មិនមានផ្ញើ caption មកទេ យើងទើបប្រើ shortcode ជំនួស
        let finalCaption = apiCaption ? apiCaption : shortcode;

        res.json({
            success: true,
            caption: finalCaption,
            data: response.data
        });

    } catch (error) {
        console.error("API Error:", error.response?.data || error.message);
        res.json({
            success: false,
            message: "Error fetching data from Instagram or API quota exceeded."
        });
    }
    // ==========================================

});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
