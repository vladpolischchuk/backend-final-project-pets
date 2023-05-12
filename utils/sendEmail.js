const { date } = require("joi");
const nodemailer = require("nodemailer");
require("dotenv").config();

const { EMAIL_FROM, META_PASSWORD } = process.env;

const nodemailerConfig = {
      host: "smtp.meta.ua",
      port: 465,
      secure: true,
      auth: {
            user: EMAIL_FROM,
            pass: META_PASSWORD,
      },
};

const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async (date) => {
      const email = { ...date, from: EMAIL_FROM };
      await transport.sendMail(email);

      return true;
};

// const sgMail = require("@sendgrid/mail");
// require("dotenv").config();

// const { SENDGRID_API_KEY, EMAIL_FROM } = process.env;

// sgMail.setApiKey(SENDGRID_API_KEY);

// const sendEmail = async (data) => {
//       const email = { ...data, from: EMAIL_FROM };
//       await sgMail.send(email);
//       return true;
// }

module.exports = sendEmail;