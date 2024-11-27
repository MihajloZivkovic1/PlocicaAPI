const AWS = require('aws-sdk');
const fs = require('fs');
require('dotenv').config();

if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
  console.error("AWS credentials are missing in environment variables.");
  process.exit(1);
}

AWS.config.update({
  region: 'eu-north-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const s3 = new AWS.S3();


const filePath = 'photos/slika.jpg';
if (!fs.existsSync(filePath)) {
  console.error(`File "${filePath}" not found.`);
  process.exit(1);
}

const params = {
  Bucket: 'qrplocice',
  Key: 'slika.jpg',
  Body: fs.createReadStream(filePath),
  ContentType: 'image/jpeg',
  ContentDisposition: 'inline'

};


s3.upload(params, (err, data) => {
  if (err) {
    console.log('Error uploading file:', err);
  } else {
    console.log('File uploaded successfully. File location:', data.Location);
  }
});