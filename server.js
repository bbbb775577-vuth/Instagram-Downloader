const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Route សម្រាប់ពិនិត្យមើលស្ថានភាព Server
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
        
        // ព្យាយាមទាញយកចំណងជើងពីគ្រប់ Key ដែលអាចមាននៅក្នុង API Response របស់ RapidAPI
        let rawCaption = response.data.caption || 
                         response.data.title || 
                         response.data.description || 
                         response.data.text || 
                         response.data.message || 
                         "instagram_download";

        // ករណីដែលទិន្នន័យស្ថិតក្នុង Object ខាងក្នុង (nested data)
        if (rawCaption === "instagram_download" && response.data.data) {
            rawCaption = response.data.data.caption || 
                         response.data.data.title || 
                         response.data.data.description || 
                         "instagram_download";
        }

        // សម្អាតអក្សរពិសេសៗ និងសញ្ញាផ្កាយ/ហែសថេ็กចេញពីចំណងជើង ដើម្បីកុំឱ្យមានបញ្ហាពេលตั้งជាឈ្មោះ File
        let caption = rawCaption.replace(/[\/\\?%*:|"<>#@]/g, '').trim();
        
        // កាត់តម្រឹមឱ្យខ្លីល្មម (ប្រហែល 40 តួអក្សរ) មិនឱ្យវែងពេក
        if (caption.length > 40) {
            caption = caption.substring(0, 40).trim();
        }
        
        // ប្រសិនបើសម្អាតរួចហើយគ្មានអក្សរเหลือ គឺកំណត់ឈ្មោះទូទៅវិញ
        if (!caption || caption === "") {
            caption = "instagram_media";
        }

        res.json({
            success: true,
            caption: caption, // ផ្ញើចំណងជើងដែលចាប់បានទៅ Frontend
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
