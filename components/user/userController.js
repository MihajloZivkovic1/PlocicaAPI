// controllers/userController.js
require('dotenv').config();
const { User } = require('../../models');
const { Product } = require('../../models')
const { Profile } = require('../../models')
const { sequelize } = require('../../models');
const CryptoJS = require("crypto-js");

const { sendVerificationEmail } = require('../../utils/mailer');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const error = require('../../middlewares/errorHandling/errorConstants');
const bcrypt = require('bcrypt');
const { where } = require('sequelize');

exports.activateIfUserAlreadyExists = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { userId } = req.params
    const { activationCode, profileName, email } = req.body
    console.log(activationCode, profileName, email, userId);


    console.log("user id i email", userId, email);


    const validProduct = await Product.findOne(
      {
        where: {
          activationCode: activationCode, status: "inactive"
        },
        transaction
      })

    const product = await Product.findOne({ where: { activationCode: activationCode } })
    const user = await User.findOne({
      where: {
        id: userId,
        email: email
      }
    })

    if (!user) {
      throw new Error(error.NOT_FOUND);
    }

    if (!product) {
      throw new Error(error.NOT_FOUND);
    }

    if (!validProduct) {
      throw new Error(error.ALREADY_ACTIVATED_PROFILE);
    }

    if (product === "active") {
      throw new Error(error.ALREADY_ACTIVATED_PROFILE);
    }

    if (!profileName) {
      throw new Error(error.MISSING_PARAMETERS)
    }

    const profile = await Profile.create({
      profileName: profileName,
      userId: userId,
      qrCode: validProduct.qrCode
    }, {
      transaction
    });

    product.status = "active";

    await product.save({ transaction });

    await profile.save({ transaction });

    await transaction.commit();


    return res.json({ message: 'Product activated succesfully', profile });

  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error('Error creating user:', error);
    return res.status(500).json({ message: 'Error creating profile, try again', error: error.message });
  }
}

exports.activate = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { qrCode } = req.params
    const { activationCode, profileName, email, password, firstName } = req.body
    console.log(activationCode, profileName, email, qrCode);


    const validProduct = await Product.findOne(
      {
        where: {
          qrCode: qrCode, activationCode: activationCode, status: "inactive"
        },
        transaction
      })
    const product = await Product.findOne({ where: { activationCode: activationCode } })

    if (!product) {
      throw new Error(error.NOT_FOUND);
    }

    if (!validProduct) {
      throw new Error(error.ALREADY_ACTIVATED_PROFILE);
    }

    if (product === "active") {
      throw new Error(error.ALREADY_ACTIVATED_PROFILE);
    }

    if (!email || !password) {
      throw new Error(error.MISSING_PARAMETERS)
    }

    const doesUserOrEmailExists = await User.findOne(
      {
        where: {
          email: email
        },
        transaction
      })

    if (doesUserOrEmailExists) {
      throw new Error(error.USER_WITH_EMAIL_ALREADY_EXISTS)
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');


    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);


    const user = await User.create({
      firstName,
      email,
      password: hashedPassword,
      isActive: false,
      verificationToken
    },
      { transaction }
    );

    await user.save();

    const profile = await Profile.create({
      profileName: profileName,
      userId: user.id,
      qrCode: qrCode
    }, {
      transaction
    });

    console.log('Product before save:', product);
    product.status = "active";
    await product.save({ transaction });
    console.log('Product after save:', product);

    await profile.save({ transaction });


    await transaction.commit();

    // await sendVerificationEmail(email, verificationToken);

    return res.json({ message: 'Product and user activated succesfully', profile });

  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error('Error creating user:', error);
    return res.status(500).json({ message: 'Error creating user, try again', error: error.message });
  }
};

exports.verifyUser = async (req, res) => {
  try {
    const { token } = req.query;

    const user = await User.findOne({ where: { verificationToken: token } })
    if (!user) {
      throw new Error(error.INVALID_VERIFICATION_TOKEN);
    }
    user.isActive = true;
    user.verificationToken = null;

    await user.save();

    return res.json({ message: 'Email verified successfully. You can now log in.' });

  } catch (error) {

    return res.status(500).json({ message: 'Error verifying email.', error: error.message || error });

  }
}
exports.loginUser = async (req, res) => {


  const encryptedPayload = req.body.data;
  console.log("payload", encryptedPayload);

  const decryptedBytes = CryptoJS.AES.decrypt(encryptedPayload, process.env.SECRET_KEY);
  const decryptedData = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));

  console.log("DecryptedData", decryptedData);


  const { email, password } = decryptedData;


  console.log("email and password", email, password);
  if (!email || !password) {
    throw new Error(error.MISSING_PARAMETERS)
  }

  try {
    const user = await User.findOne({
      where:
      {
        email: email,
      }
    })


    if (!user) {
      throw new Error(error.NOT_FOUND)
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error(error.CREDENTIALS_ERROR);
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '30days' });

    // const refreshToken = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_REFRESH_SECRET, { expiresIn: '1m' });

    return res.status(200).json({ message: 'Login successful', token, user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new Error(error.MISSING_PARAMETERS);
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)

    const newAccessToken = jwt.sign({ userId: decoded.userId, email: decoded.email }, process.env.JWT_SECRET, { expiresIn: '30days' });

    return res.status(200).json({ accessToken: newAccessToken });

  } catch (error) {
    console.error(error);
    return res.status(403).json({ message: "Invalid refresh token", error: error.message });

  }
}
exports.addNewProfile = async (req, res) => {
  //da li je user ulogovan
  //provera kao kod registracije za unos podataka vezane za plocicu

  try {
    const { token, qrCode, activationCode, profileName, userId } = req.body

    const user = await User.findOne({ where: { id: userId } })

    if (!user) {
      throw new Error(error.NOT_FOUND);
    }

    if (!token) {
      throw new Error(error.UNAUTHORIZED_ERROR);
    }

    const validProduct = await Product.findOne({ where: { qrCode: qrCode, activationCode: activationCode, status: 'inactive' } })

    if (!validProduct) {
      throw new Error(error.ALREADY_ACTIVATED_PROFILE);
    }

    if (validProduct.status === "active") {
      throw new Error(error.ALREADY_ACTIVATED_PROFILE)
    }

    validProduct.status = "active"

    const profile = await Profile.create({
      profileName: profileName,
      userId: userId,
      qrCode: qrCode
    });

    await profile.save();
    await validProduct.save();

    return res.json({ message: 'Product activated successfully', profile });
  } catch (error) {
    console.error(error)
  }
}
exports.getUsersProfiles = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ where: { id: id } });

    if (!user) {
      throw new Error(error.NOT_FOUND);
    }

    const usersProfiles = await Profile.findAll({
      where: {
        userId: id
      }
    })

    if (usersProfiles.length === 0) {
      return res.json({ message: "No profiles found for this user" });
    }

    return res.status(200).json(usersProfiles)

  } catch (error) {
    console.error(error)
  }
}

exports.getAllUsers = async (req, res) => {
  const users = await User.findAll();
  return res.json(users);
}


//isThisMyPokojnik middleware