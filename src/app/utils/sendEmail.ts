import nodemailer from 'nodemailer';
import config from '../config';

export const sendEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: config.node_env === 'production',
    auth: {
      user: 'rhrakib044@gmail.com',
      pass: 'exyz iwph wdba xbtr',
    },
  });

  await transporter.sendMail({
    from: 'rhrakib044@gmail.com', // sender address
    to, // list of receivers
    subject: 'Reset your password within 10 min', // Subject line
    text: '', // plain text body
    html, // html body
  });
};
