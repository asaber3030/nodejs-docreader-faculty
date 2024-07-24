import nodemailer from 'nodemailer';

const mail = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 587,
  secure: false,
  auth: {
    user: 'e0a08ee4c206dc',
    pass: '47209292824906',
  }
});

export default mail
