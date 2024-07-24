"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const VerificationCodeTemplate = (code, sentBy) => {
    return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification Code</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              padding: 20px;
          }
          .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          .logo {
              text-align: center;
              margin-bottom: 20px;
          }
          .logo img {
              max-width: 150px;
              height: auto;
          }
          .verification-code {
              text-align: center;
              font-size: 24px;
              margin-bottom: 20px;
          }
          .note {
              text-align: center;
              margin-bottom: 20px;
          }
          .footer {
              text-align: center;
              margin-top: 20px;
              color: #888888;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="verification-code">
              Your Verification Code: <strong>${code}</strong>
          </div>
          <div class="note">
              Please use the above verification code to verify your email address.
          </div>
          <div class="footer">
              Sent by <strong>${sentBy !== null && sentBy !== void 0 ? sentBy : 'X-Company'}</strong>
          </div>
      </div>
  </body>
  </html>
  `;
};
exports.default = VerificationCodeTemplate;
