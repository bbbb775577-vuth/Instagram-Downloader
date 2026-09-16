const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// បន្ថែម Route នេះ ដើម្បីកុំឱ្យវាចេញ Cannot GET / ពេលបើក Link Server
app.get('/', (req, res) => {
    res.send('Instagram Downloader API is running successfully!');
});

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
        
        const mediaList = response.data.media || response.data.url || response.data;
        let directDownloadUrl = "";

        if (Array.isArray(mediaList) && mediaList.length > 0) {
            directDownloadUrl = mediaList; // ส่ง array ទាំងមូលទៅ Frontend ដើម្បីឱ្យវា loop យកគ្រប់រូបភាព
        } else {
            directDownloadUrl = response.data.media || [response.data];
        }

        res.json({
            success: true,
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
