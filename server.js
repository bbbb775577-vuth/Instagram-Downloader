const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.downloadstagram('Instagram Downloader API is running successfully!');
});

app.post('/api/download', async (req, res) => {
    let userInstagramUrl = req.body.url;

    if (!userInstagramUrl) {
        return res.json({ success: false, message: "Please enter an Instagram Link!" });
    }

    // សម្អាត URL ឱ្យស្អាត (លុបទុករាល់ Query parameters ខាងក្រោយដូចជា ?hl=en&img_index=1 ជៀសវាង API Error)
    try {
        const cleanUrlObj = new URL(userInstagramUrl);
        userInstagramUrl = `${cleanUrlObj.origin}${cleanUrlObj.pathname}`;
    } catch (e) {
        // បើ URL ខុសទម្រង់ គឺទុកប្រើធម្មតា
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

    // ប្រើប្រាស់ RapidAPI Endpoint ថ្មីដែលមានស្ថេរភាព
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
        
        // ឆែកមើលទិន្នន័យដែលឆ្លើយតបមក
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
            message: "Error fetching data from Instagram."
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
