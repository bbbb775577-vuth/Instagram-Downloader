const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/api/download', async (req, res) => {
    const instaUrl = req.body.url;

    try {
        // វិធីទី១៖ អ្នកអាចប្រើប្រាស់ Third-party API ដែលមានស្រាប់សម្រាប់ Instagram Scraping (ឧទាហរណ៍ RapidAPI ណាមួយ)
        // វិធីទី២៖ សរសេរកូដកាយរើសយក Direct Link (ចំណាំ៖ Instagram ມັກប្តូរโครงสร้าง HTML ធ្វើឱ្យកូដងាយខូច ទាមទារការអាប់ដេតញឹកញាប់)

        // ឧទាហរណ៍នៃការប្រើប្រាស់ RapidAPI (Instagram Downloader API)
        /*
        const options = {
            method: 'GET',
            url: 'https://instagram-downloader-download-instagram-videos-stories1.p.rapidapi.com/get-info',
            params: { url: instaUrl },
            headers: {
                'X-RapidAPI-Key': 'API_KEY_របស់_คุณ',
                'X-RapidAPI-Host': '...'
            }
        };
        const apiResponse = await axios.request(options);
        */

        // តេស្តបង្ហាញលទ្ធផលត្រឡប់ទៅ Front-end វិញ
        res.json({
            success: true,
            downloadUrl: " LINK_សម្រាប់_DOWNLOAD_ដែលទាញបាន "
        });

    } catch (error) {
        res.json({
            success: false,
            message: "មិនអាចទាញយកវីដេអូនេះបានទេ សូមពិនិត្យ Link ឡើងវិញ។"
        });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});