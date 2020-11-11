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
    to: 'sumbulovich+web@gmail.com', // Cambia esta parte por el destinatario
    subject: 'subject',
    html: 'html'
  };
  return transporter.sendMail( mailOptions );
}