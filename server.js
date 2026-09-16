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
    const userInstagramUrl = req.body.url;

    if (!userInstagramUrl) {
        return res.json({ success: false, message: "សូមបញ្ចូល Link Instagram!" });
    }

    // ស្រង់យក Shortcode (ID របស់ Post) ពី Link Instagram មកធ្វើជាឈ្មោះ File តែម្តង
    let shortcode = "instagram_media";
    try {
        const urlObj = new URL(userInstagramUrl);
        const pathSegments = urlObj.pathname.split('/').filter(Boolean);
        // Path របស់ Instagram  সাধারণতមានลักษณะ /p/SHORTCODE/ ឬ /reel/SHORTCODE/
        const index = pathSegments.findIndex(seg => seg === 'p' || seg === 'reel' || seg === 'tv');
        if (index !== -1 && pathSegments[index + 1]) {
            shortcode = pathSegments[index + 1];
        }
    } catch (e) {
        // ករណី Link មិនប្រក្រតី គឺប្រើឈ្មោះទូទៅ
    }

    const options = {
        method: 'GET',
        url: 'https://instagram-downloader-download-instagram-stories-videos4.p.rapidapi.com/convert',
        params: { url: userInstagramUrl },
        headers: {
            'x-rapidapi-key': '54fb74925dmsh8e15526f336a480p1844d4jsn86f649cc2db6',
            'x-rapidapi-host': 'instagram-downloader-download-instagram-stories-videos4.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);

        res.json({
            success: true,
            caption: shortcode, // យក Shortcode មកធ្វើជាឈ្មោះ
            data: response.data
        });

    } catch (error) {
        console.error(error);
        res.json({
            success: false,
            message: "មានបញ្ហាក្នុងការទាញយកទិន្នន័យពី Instagram។"
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
