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
        // កូដសម្រាប់ហៅ RapidAPI (Instagram Downloader)
        const options = {
            method: 'GET',
            url: 'https://instagram-dl1.p.rapidapi.com/dl', // (ប្តូរតាម API ដែលអ្នកជ្រើសរើសនៅលើ RapidAPI)
            params: { url: instaUrl },
            headers: {
                'X-RapidAPI-Key': 'បញ្ចូល_API_KEY_របស់អ្នកនៅទីនេះ',
                'X-RapidAPI-Host': 'instagram-dl1.p.rapidapi.com' // (ប្តូរតាម API នោះដែរ)
            }
        };

        const response = await axios.request(options);
        
        // ស្រង់យក Link សម្រាប់ Download ចេញពីលទ្ធផល API នោះ
        // (ចំណាំ៖ ទម្រង់ data អាចខុសគ្នាបន្តិចបន្តួច អាស្រ័យលើ API នីមួយៗដែលអ្នកប្រើ)
        const downloadLink = response.data.url || response.data.download_url; 

        if (downloadLink) {
            res.json({
                success: true,
                downloadUrl: downloadLink
            });
        } else {
            res.json({
                success: false,
                message: "រកមិនឃើញតំណទាញយកសម្រាប់វីដេអូនេះទេ។"
            });
        }

    } catch (error) {
        console.error(error);
        res.json({
            success: false,
            message: "មានបញ្ហាក្នុងការទាញយក សូមពិនិត្យមើល Link Instagram ឡើងវិញ។"
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
