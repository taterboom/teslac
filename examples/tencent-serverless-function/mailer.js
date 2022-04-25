const nodemailer = require("nodemailer")

async function mailer(text) {
  const transporter = nodemailer.createTransport({
    service: "163",
    auth: {
      user: process.env.SENDER,
      pass: process.env.SENDER_PASS,
    },
  })

  const info = await transporter.sendMail({
    from: `"Teslac" <${process.env.SENDER}>`, // sender address
    to: process.env.RECEIVER, // list of receivers
    subject: "Tesla Model3 Battery Reminder", // Subject line
    text: `${text}
    ---
    based on tencent serverless function and teslac npm package`, // plain text body
  })

  console.log(info)
}

module.exports = mailer
