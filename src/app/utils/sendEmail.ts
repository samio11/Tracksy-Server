import nodemailer from "nodemailer";
import ejs from "ejs";
import config from "../config";
import path from "path";

const transporter = nodemailer.createTransport({
  host: config.SMTP_HOST,
  port: Number(config.SMTP_PORT),
  secure: true,
  auth: {
    user: config.SMTP_USER,
    pass: config.SMTP_PASS,
  },
});

type TSendEmail = {
  to: string;
  subject: string;
  tempFileName: string;
  tempFileData: Record<string, any>;
  attachments?: {
    fileName: string;
    Content: Buffer | string;
    ContentType: string;
  }[];
};

export const sendEmail = async ({
  to,
  subject,
  tempFileName,
  tempFileData,
  attachments,
}: TSendEmail) => {
  try {
    const tempPath = path.join(__dirname, `templates/${tempFileName}.ejs`);
    const html = await ejs.renderFile(tempPath, tempFileData);
    const info = await transporter.sendMail({
      from: config.SMTP_FROM,
      to: to,
      subject: subject,
      html: html,
      attachments: attachments?.map((x) => ({
        filename: x.fileName,
        content: x.Content,
        contentType: x.ContentType,
      })),
    });
    console.log(`Email Send Done:- ${info.messageId}♦`);
  } catch (err) {
    console.log(`Email send failed:- ${err}`);
  }
};
