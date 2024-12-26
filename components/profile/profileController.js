
const error = require('../../middlewares/errorHandling/errorConstants');
const { Profile, Story, Media, Event, Group, Link } = require('../../models')

const multer = require('multer');
const AWS = require('aws-sdk');
const fs = require('fs');



//GENERAL TAB
//prvi put kad se pravi profil ovo se popunjava
//formData();
exports.editProfile = async (req, res) => {

  try {
    const { id } = req.params;
    const { profileName, dateOfBirth, dateOfDeath, religion, placeOfBirth, placeOfDeath, text } = req.body
    let today = new Date().toISOString().slice(0, 10)

    // const { file } = req.file

    if (dateOfBirth > today) {
      throw new Error(error.INVALID_DATE)
    }
    if (dateOfBirth > dateOfDeath) {
      throw new Error(error.INVALID_DATE)
    }

    const profile = await Profile.findOne({ where: { id: id } })

    if (!profile) {
      throw new Error(error.NOT_FOUND);
    }
    let photoUrl = profile.photo;

    console.log(req.file);
    if (req.file) {

      console.log(req.file)
      AWS.config.update({
        region: 'eu-north-1',
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      });

      const s3 = new AWS.S3();
      const now = new Date();

      // const upload = multer({ storage: multer.memoryStorage() });

      const fileName = `profile_${id}_${req.file.originalname}-${now}`;

      const params = {
        Bucket: 'qrplocice',
        Key: fileName,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      };
      const uploadResult = await s3.upload(params).promise();
      photoUrl = uploadResult.Location;

      console.log(photoUrl);
    }

    profile.profileName = profileName || profile.profileName
    profile.dateOfBirth = dateOfBirth || profile.dateOfBirth;
    profile.dateOfDeath = dateOfDeath || profile.dateOfDeath;
    profile.religion = religion || profile.religion;
    profile.placeOfBirth = placeOfBirth || profile.placeOfBirth;
    profile.placeOfDeath = placeOfDeath || profile.placeOfDeath;
    profile.text = text || profile.text;
    profile.photo = photoUrl



    await profile.save();
    console.log(profile);
    return res.json({ message: "Profile saved successfully", profile });
  } catch (error) {
    return res.json({
      error
    });
  }
}

//ovo ce biti glavna stranica nakon ucitavanja qr koda..
exports.getProfileData = async (req, res) => {
  try {
    const { qrCode } = req.params

    if (!qrCode) {
      throw new Error(error.MISSING_PARAMETERS);
    }
    const profile = await Profile.findOne({
      where: {
        qrCode: qrCode
      },
      include: [
        {
          model: Story,
          as: 'Stories'
        },
        {
          model: Media,
          as: "Media"
        },
        {
          model: Event,
          as: "Events"
        },
        {
          model: Group,
          as: "Groups",
          include: [
            {
              model: Link,
              as: "Links"
            }

          ]

        }
      ]
    });

    return res.json({
      profile: profile,
    });


  } catch (error) {
    console.error(error);
  }
}

exports.editProfilesBio = async (req, res) => {
  try {
    const { bio } = req.body;
    const { id } = req.params;


    console.log("Bio that ive got from clinet", bio);

    // const bioMaxLength = 500;

    const profile = await Profile.findOne({
      where: {
        id: id
      }
    })

    if (!profile) {
      throw new Error(error.NOT_FOUND);
    }

    // if (bio.length > bioMaxLength) {
    //   return res.status(400).json({ message: `Bio content should not exceed ${maxBioLength} characters.` });
    // }

    profile.bio = bio;

    await profile.save();
    console.log("Current bio", profile.bio)
    return res.status(201).json({ message: "Bio updated successfully" })

  } catch (error) {
    console.error('Error updating bio:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
exports.getProfile = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Profile id", id)
    const profile = await Profile.findOne({
      where: {
        id: id
      }
    })

    console.log(profile)
    if (!profile) {
      throw new Error(error.NOT_FOUND);
    }


    return res.json({
      message: `Profile with id ${id}`,
      profile: profile
    })

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error", error: error.message
    })
  }
}
//USER ID NE MOZE DA BUDE NULL ZBOG VEZE KOJU SAM NAPRAVIO TREBA TO PROMENITI
//PROMENITI MODEL TAKO DA PRIMA IME PROFILA POKOJNIKA

//treba da nadjem za taj qr kod koji je skreniran da li se poklapa sa qr kodom koji dobijam iz bodija, 
//takodje treba da poredim aktivacioni kod koji je korisnik uneo, i treba da upisem u tabelu ime pokojnika koji ce da bude kao alijas
//tek nakon kreiranja plocice treba ubaciti usera koji ga je kreirao ili uopste ne ubacivati id usera?????
//da li treba ostaviti idProfila nakon aktivacije plocice?
//nameOfProfile ne postiji u bazi to takodje promeniti
//kroz params dobiti usera?
//previse poziva ka bazi