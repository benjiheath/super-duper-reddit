const sendGridMail = require('@sendgrid/mail');
sendGridMail.setApiKey(process.env.SG_API_KEY);

export async function sendEmail(to: string, html: string): Promise<void> {
  try {
    await sendGridMail.send({
      to,
      from: 'super_reddit@outlook.com',
      subject: 'Password Reset',
      html,
    });
    console.log('Email sent successfuly');
  } catch (error) {
    console.error('Error sending recovery email');
    console.error(error);
    if (error.response) {
      console.error(error.response.body);
    }
  }
}
