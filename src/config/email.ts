import nodemailer from "nodemailer";
import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

const OAuth2 = google.auth.OAuth2;
const OAuth2_client = new OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET
);
OAuth2_client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
const accessToken = OAuth2_client.getAccessToken();
const transporter = nodemailer.createTransport({
  service: String("gmail"),
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
    accessToken: String(accessToken),
  },
});

export function sendMail(mailOptions: any) {
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("NODEMAILER ERROR from 1:");

      console.log(error);
    }
  });
}
