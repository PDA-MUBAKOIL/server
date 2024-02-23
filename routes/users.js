var express = require("express");
var router = express.Router();
const Users = require("../model/Users");
const { createToken, verifyToken } = require("../utils/auth");


/* POST : 회원가입(signup) */
router.post("/signup", async (req, res, next) => {

  try {
    const { email, password, name } = req.body;
  
    const newUser = await Users.signUp(name, email, password);
    res.json(newUser);
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: 'signup error' });
    next(err);
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
    res.json(user);
  } catch (err) {
    res.status(404).json({ error: 'login error' });
    next(err);
  }
});

/* all : 로그아웃(logout) */
router.all("/logout", async (req, res, next) => {
  try {
    // 쿠키 삭제
    res.cookie("authToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
    res.json({ message: "로그아웃 완료" });
  } catch (err) {
    res.status(404).json({ error: 'login error' });
    next(err);
  }
});

/* PUT : 비밀번호 재설정 */
// router.put("/setpassword", async (req, res, next) => {
  
// });


/* POST : 이메일 인증 */
// router. post('/auth',authenticate, async(req,res,next)=>{

  
// });

module.exports = router;
