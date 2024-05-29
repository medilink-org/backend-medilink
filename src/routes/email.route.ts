import sgMail from '@sendgrid/mail';
import { Router } from 'express';

const router = Router();

router.post('/send-email', (req, res) => {
  const { patientEmail, emailContent } = req.body;
  console.log('Sending email to: ', patientEmail);
  console.log('Email content: ', emailContent);

  const msg = {
    to: patientEmail,
    from: 'aimen.25@dartmouth.edu',
    subject: 'Visit Summary',
    text: emailContent
  };

  sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

  sgMail
    .send(msg)
    .then(() => {
      res.status(200).json({ message: 'Email sent successfully' });
    })
    .catch((error) => {
      console.error('Error sending email:', error);
      res
        .status(500)
        .json({ message: 'Error sending email', error: error.message });
    });
});

export default router;
