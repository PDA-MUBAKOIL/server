//Express
const express = require("express");
const router = express.Router();
//Module
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
require('dotenv').config();

// nodemailer 설정
const smtpTransport = nodemailer.createTransport({
  service: "gmail",
  host: 'smtp.gmail.com',
  port: 465,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PW,
  },
});

// 이메일 전송
router.post("/send", async (req, res, next) => {
  const readMail = req.body.mail;

  let authNum = Math.random().toString().substr(2, 6);
  const hashAuth = await bcrypt.hash(authNum, 12);
  res.cookie("hashAuth", hashAuth, { maxAge: 300000 }); //유지시간 5분

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: readMail,
    subject: "무박오일 인증번호 관련 메일 입니다.",
    text: "인증번호는 " + authNum + " 입니다.",
    html:
      "<div style='font-family: 'Apple SD Gothic Neo', 'sans-serif' !important; width: 540px; height: 600px; border-top: 4px solid #348fe2; margin: 100px auto; padding: 30px 0; box-sizing: border-box;'>" +
      "<h1 style='margin: 0; padding: 0 5px; font-size: 28px; font-weight: 400;'>" +
      "<span style='font-size: 15px; margin: 0 0 10px 3px;'>MBOIL</span><br />" +
      "<span style='color: #348fe2;'>인증번호</span> 안내입니다." +
      "</h1>" +
      "<p style='font-size: 16px; line-height: 26px; margin-top: 50px; padding: 0 5px;'>" +
      "안녕하세요.<br />" +
      "요청하신 인증번호가 생성되었습니다.<br />" +
      "감사합니다." +
      "</p>" +
      "<p style='font-size: 16px; margin: 40px 5px 20px; line-height: 28px;'>" +
      "인증번호: <br />" +
      "<span style='font-size: 24px;'>" +
      authNum +
      "</span>" +
      "</p>" +
      "<div style='border-top: 1px solid #DDD; padding: 5px;'>" +
      "</div>" +
      "</div>",
    };

    smtpTransport.sendMail(mailOptions, (err) => {
      if (err) {
        console.log(err);
        res.json({ result: false});
      } else {
        res.json({ result: true});
      };
      smtpTransport.close();
    });
});

// 이메일 인증
router.post("/cert", async (req, res, next) => {
  const CEA = req.body.authcode.toString();
  const hashAuth = req.cookies.hashAuth;
  
  if(hashAuth){
    try {
        if (bcrypt.compareSync(CEA, hashAuth)) {
          res.json({ result: true });
        } else {
            res.json({ result: false, message: "인증번호 오류" });
        }
    } catch (err) {
        res.json({ result: false, message: "요청 오류"});
    }
  }
  else{
    res.json({ result: false, message: "hashAuth 없음" });
  }
});

module.exports = router;
