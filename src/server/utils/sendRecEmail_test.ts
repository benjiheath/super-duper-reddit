import { config } from './../main';
import nodemailer from 'nodemailer';

export const generateReoveryEmailLink = (token: string) =>
  `<a href='${config.urls.client}/reset-password/${token}' target="_blank">Reset password</a>`;

// async..await is not allowed in global scope, must use a wrapper
export async function sendRecEmail_test(to: string, html: string) {
  let testAccount = await nodemailer.createTestAccount();
  console.log('testacc:', testAccount);

  let transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'wjyit6hd6lds5nez@ethereal.email', // generated ethereal user
      pass: 'S1Z4JkG3mGmZxT5224', // generated ethereal password
    },
  });

  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: to,
    subject: 'Reset password',
    html,
  });

  console.log('Message sent: %s', info.messageId);

  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
}
