const nodemailer = require('nodemailer');

const sendTicketEmail = async (toEmail, eventTitle, qrPath, ticketId) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: `"EventChain" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `Bilet pentru evenimentul „${eventTitle}”`,
    html: `
      <h2>Biletul tău pentru <em>${eventTitle}</em></h2>
      <p>Scanează codul QR de mai jos la intrare:</p>
      <img src="cid:qrcode" style="width:180px;height:180px" />
      <p><strong>ID bilet:</strong> ${ticketId}</p>
      <p>Mulțumim că folosești EventChain!</p>
    `,
    attachments: [
      {
        filename: 'bilet.png',
        path: qrPath,
        cid: 'qrcode' 
      }
    ]
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendTicketEmail;
