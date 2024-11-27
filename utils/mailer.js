const nodemailer = require('nodemailer')


const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  secure: true,
  auth: {
    user: "mihajlozivkovic0104@gmail.com",
    pass: "gilz ovfl qage gfpt"
  }
})

const sendVerificationEmail = async (email, verificationToken) => {
  const verificationUrl = `http://localhost:3000/users/verify?token=${verificationToken}`

  const mailOptions = {
    from: 'mihajlozivkovic0104@gmail.com',
    to: email,
    subject: "Verify Your email",
    text: `Verify your email addres by following this link: ${verificationUrl}`
  }
  console.log(mailOptions);
  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification mail sent successfully.")
  } catch (error) {
    console.error("error sending email: ", error);
  }
}

module.exports = { sendVerificationEmail }