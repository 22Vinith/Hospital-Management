import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.PASSWORD,
  },
});

const sendEmail = async (receiveremail: string, token: string) => {
  const mailOptions = {
    from: {
      name: 'Hospital',
      address: process.env.EMAIL_USER,
    },
    to: receiveremail,
    subject: 'Password Reset Token',
    html: `<p>Your password reset token will expire in 60 minutes:</p><p><strong>${token}</strong></p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error('Email sending failed');
  }
};

export { sendEmail };