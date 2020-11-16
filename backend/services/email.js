const nodemailer = require( 'nodemailer' );

module.exports = ( emailData ) => {
  const transporter = nodemailer.createTransport( {
    service: process.env.NODEMAILER_SERVICE,
    auth: {
      user: process.env.NODEMAILER_AUTH_USER,
      pass: process.env.NODEMAILER_AUTH_PSW
    }
  });
  const mailOptions = {
    from: `"Sumbul Web 👻" <${process.env.NODEMAILER_AUTH_USER}>`,
    to: emailData.to,
    subject: emailData.subject,
    html: emailData.html
  };
  return transporter.sendMail( mailOptions );
}