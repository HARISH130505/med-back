const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const mongoose = require('mongoose');
const cors = require('cors');

app.use(cors({
    origin: 'https://med-folio.vercel.app',
    credentials: true
}));

app.use(express.json());

mongoose.connect('mongodb+srv://harish130505:easypass@harish.tcjpp.mongodb.net/med-records');

const con = mongoose.connection

con.on('open',()=>{
   console.log("Connected with db...")
})

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, 'files');
        fs.mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

const records = require('./model/schema');

app.get('/', async (req, res) => {
    try {
        const record = await records.find();
        res.json(record);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.post('/uploads', upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        console.log('Uploaded File:', req.file);

        const record = new records({
            dn: req.body.dn,
            hn: req.body.hn,
            diag: req.body.diag,
            file: req.file.filename
        });

        const savedRecord = await record.save();

        res.status(200).json({
            message: 'File uploaded and record saved successfully',
            file: req.file,
            record: savedRecord
        });

    } catch (error) {
        console.error("Upload/Save error:", error);
        res.status(500).json({ message: 'File upload/save failed', error: error.message });
    }
});

app.use("/files", express.static("files"));

app.listen(5000, () => {
    console.log("Server is listening on port 5000"); 
});