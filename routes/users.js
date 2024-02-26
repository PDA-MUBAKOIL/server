var express = require("express");
var router = express.Router();
const Users = require("../model/Users");
const { createToken, verifyToken } = require("../utils/auth");

/* POST : 회원가입(signup) */
router.post("/signup", async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    const newUser = await Users.signUp(name, email, password);
    res.status(200).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: "signup error" });
  }
});

/* POST : 로그인(login) */
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await Users.login(email, password);
    const tokenMaxAge = 60 * 60 * 24 * 3;
    const token = createToken(user, tokenMaxAge);

    user.token = token;

    // 쿠키에 token 저장
    res.cookie("authToken", token, {
      httpOnly: true,
      maxAge: tokenMaxAge * 1000,
    });
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ result: false });
  }
});

/* POST : 로그아웃(logout) */
router.all("/logout", async (req, res, next) => {
  try {
    if (req.cookies.authToken) {
      // 쿠키 삭제
      res.cookie("authToken", "", {
        httpOnly: true,
        expires: new Date(Date.now()),
      });
      res.status(200).json({ result: true });
    }
    else{
      res.status(404).json({ result: false });
    }
  } catch (err) {
    res.status(404).json({ result: false });
  }
});

/* PUT : 비밀번호 재설정 */
router.put("/setpassword", async (req, res, next) => {
  const { email, password } = req.body;

  Users.updateOne({
    email: email,
  }, {password}).then((data)=>{
    res.status(200).json(data);
  }).catch((err)=>{
    res.status(404).json({ result: false });
  })
});

/* GET : 계정 유무 확인 */
router.get("/:email", async (req, res, next) => {
  
  const email = req.params.email;

  Users.findOne({email}).then((data)=>{
    if(data){
      res.json({result: true, email:data.email});  //계정 있음
    } 
    else{
      res.json({ result: false }); //계정 없음
    }
  }); 
});

module.exports = router;
