
const error = require('../../middlewares/errorHandling/errorConstants');
const { Profile, Media } = require('../../models')

const multer = require('multer');
const AWS = require('aws-sdk');
const fs = require('fs');


exports.uploadMedia = async (req, res) => {

  const { profileId } = req.body;
  const file = req.file
  console.log("uploaded file", file);

  const profile = await Profile.findOne({
    where: {
      id: profileId
    }
  })

  if (!profile) {
    throw new Error(error.NOT_FOUND);
  }

  const mediaType = file.mimetype.startsWith('image/') ? 'photo' : 'video';
  let medialUrl = null;
  let fileNameInS3 = null;
  let fileName = req.file.originalname;
  console.log("fileName", fileName);
  if (req.file) {
    AWS.config.update({
      region: 'eu-north-1',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    });

    const s3 = new AWS.S3();
    const now = new Date()
    fileNameInS3 = `profile_${profileId}_${req.file.originalname}-${now}`;

    const params = {
      Bucket: 'qrplocice',
      Key: fileNameInS3,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };
    const uploadResult = await s3.upload(params).promise();

    medialUrl = uploadResult.Location;
  }

  const media = await Media.create({
    profileId: profileId,
    mediaType: mediaType,
    url: medialUrl,
    fileName: fileNameInS3,
    size: file.size,
    mimeType: file.mimetype
  });

  await media.save();


  return res.status(201).json({
    message: 'Media uploaded successfully.',
    media
  });


}

exports.getMedia = async (req, res) => {
  try {
    const { profileId } = req.params;

    console.log(profileId);

    const profile = await Profile.findOne({
      where: {
        id: profileId
      }
    })

    if (!profile) {
      throw new Error(error.NOT_FOUND);
    }

    const media = await Media.findAll({
      where: {
        profileId: profileId,
      }
    })

    console.log(media);
    if (!media) {
      throw new Error(error.NOT_FOUND);
    }

    return res.status(200).json({
      message: "Media returned successfully",
      media
    })
  } catch (error) {
    console.error(error)
  }

}
exports.deleteMedia = async (req, res) => {
  try {
    const { mediaId } = req.body;

    console.log(mediaId);

    const media = await Media.findOne({
      where: {
        id: mediaId

      }
    })

    if (!media) {
      throw new Error(error.NOT_FOUND);
    }


    await Media.destroy({
      where: {
        id: mediaId
      }
    })

    return res.status(200).send({
      message: "Media deleted successfully"
    })
  } catch (error) {
    console.error(error);
  }
}