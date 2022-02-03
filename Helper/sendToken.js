const nodeMailer = require('nodemailer');
const baseUrl = require('../Helper/baseUrl');

//-------------Creating a transporter for Sending the mail-----------------
function sendMail(email, token) {


    //creating a mailTransporter and usage the gmail service for sending mails
const mailTrasnporter = nodeMailer.createTransport({
    service: 'gmail',

    //for secure communication
    requireTLS: true,
    auth: {
        user: process.env.SenderMail,
        pass: process.env.Pass
    }
});

//---------------Creating the mailOptions---------------------
const mailOption = {
    form: process.env.SenderMail,
    to: email,
    subject: "Reset link",
    html: `<p>Reset Link:- </p>
            <a href="${baseUrl}/reset/${token}">${baseUrl}/reset/${token}</a>
            <p>Stay Safe</p>`
};

mailTrasnporter.sendMail(mailOption).then((info) => {
    console.log("mailsendSuccess", info.response);
});

}

module.exports = sendMail;
