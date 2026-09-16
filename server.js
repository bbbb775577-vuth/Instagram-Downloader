const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/api/download', async (req, res) => {
    const userInstagramUrl = req.body.url;

    if (!userInstagramUrl) {
        return res.json({ success: false, message: "សូមបញ្ចូល Link Instagram!" });
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
        
        // ទាញយក URL វីដេអូ/រូបភាពពី Response structure របស់ API នេះ
        // (អាស្រ័យលើ API វាអាចស្ថិតក្នុង response.data.media[0].t ឬ response.data.url)
        const mediaList = response.data.media || response.data.url || response.data;
        let directDownloadUrl = "";

        if (Array.isArray(mediaList) && mediaList.length > 0) {
            directDownloadUrl = mediaList[0].t || mediaList[0].url;
        } else if (typeof response.data === 'string') {
            directDownloadUrl = response.data;
        } else {
            directDownloadUrl = response.data.url || response.data.download_url;
        }

        if (directDownloadUrl) {
            res.json({
                success: true,
                downloadUrl: directDownloadUrl // ផ្ញើឈ្មោះ downloadUrl ឱ្យត្រូវនឹង Frontend
            });
        } else {
            res.json({
                success: false,
                message: "រកមិនឃើញតំណទាញយកសម្រាប់ Link นี้ទេ។"
            });
        }

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
