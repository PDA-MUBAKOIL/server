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
    res.status(404).json({ result: false });
  }
});

/* POST : 로그인(login) */
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await Users.login(email, password);
    const tokenMaxAge = 60 * 60 * 24 * 3;
    const token = createToken(user, tokenMaxAge);

    // body로 token 보내기
    res.status(200).json({user, token});
  } catch (err) {
    console.error(err);
    res.status(404).json({ result: false, message: "로그인 오류" });
  }
});

/* POST : 로그아웃(logout) */
router.all("/logout", async (req, res, next) => {
  try {
    let headerToken =  req.headers.authorization;
    
    if (headerToken) {
      const token = headerToken.split(" ")[1];

      // 무효화된 토큰인지 확인
      if (invalidTokens.has(token)) {
        res.status(401).json({ result: false, message: "이미 로그아웃된 토큰입니다." });
      } else {
        // 토큰을 무효화 처리
        invalidTokens.add(token);
        res.status(200).json({ result: true });
      }
    } else {
      res.status(400).json({ result: false, message: "로그아웃 오류: 토큰이 없습니다." });
    }
  } catch (err) {
    res.status(500).json({ result: false, message: "로그아웃 오류" });
  }
});

/* PUT : 비밀번호 재설정 */
router.put("/setpassword", async (req, res, next) => {
  const { email, password } = req.body;

  try {
    let headerToken =  req.headers.authorization;
    
    if (headerToken) {
      const token = headerToken.split(" ")[1];

      // 무효화된 토큰인지 확인
      if (invalidTokens.has(token)) {
        res.status(401).json({ result: false, message: "이미 무효화된 토큰." });
      } else {
        invalidTokens.add(token); // token 무효화 처리하고
        await Users.setpw(email, password); // 비밀번호 재설정
        res.status(200).json({ result: true });
      }
    } else {
      res.status(400).json({ result: false, message: "토큰이 없습니다." });
    }
  } catch (err) {
    res.status(500).json({ result: false, message: "setpw 오류" });
  }
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
