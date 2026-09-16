const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios'); // ត្រូវធានាថាបាន cài axios (npm install axios)

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/api/download', async (req, res) => {
    const userInstagramUrl = req.body.url; // Link ដែល User វាយបញ្ចូលក្នុង Frontend

    if (!userInstagramUrl) {
        return res.json({ success: false, message: "សូមបញ្ចូល Link Instagram!" });
    }

    const options = {
        method: 'GET',
        url: 'https://instagram-downloader-download-instagram-stories-videos4.p.rapidapi.com/convert',
        params: {
            url: userInstagramUrl // យក Link ដែល User ផ្ញើមកដាក់បញ្ចូលទីនេះស្វ័យប្រវត្តិ
        },
        headers: {
            'x-rapidapi-key': '54fb74925dmsh8e15526f336a480p1844d4jsn86f649cc2db6',
            'x-rapidapi-host': 'instagram-downloader-download-instagram-stories-videos4.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        
        // ផ្អែកលើ Response structure របស់ API នេះ វាអាចស្ថិតក្នុង response.data 
        // យើងនឹងສົ່ງទិន្នន័យនេះត្រឡប់ទៅឱ្យ Frontend វិញ
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
