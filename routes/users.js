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
    res.status(404).json({ result: false ,message: "회원가입 오류" });
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
    // body로 token 보내기
    res.status(200).json({user});
  } catch (err) {
    console.error(err);
    res.status(404).json({ result: false, message: "로그인 오류" });
  }
});

// authenticate 미들웨어 생성
async function authenticate(req, res, next) {
  // 토큰을 request에서 꺼내서 유저 정보 확인
  try {
    let headerToken = req.headers['x-access-token'] || req.headers['authorization'];
    // Remove Bearer from string
    token = headerToken.replace(/^Bearer\s+/, "");

    const user = verifyToken(token);
    req.user = user;
    // 유저 정보 없으면 error 발생
    if (!user) {
        res.status(401).json({ result: false, message: "no match user" });  
    }
    next(); //req.user가 넘겨짐
  } catch (error) {
      // 예외가 발생한 경우 처리할 내용
      res.json({ result: false, message:"Authorization Failed"});
  }
}

/* POST : 로그아웃(logout) 
 * 프론트에서 토큰 삭제해야함
*/
router.all("/logout",authenticate, async (req, res, next) => {
  res.status(200).json({ message: "로그인 완료" });
});

/* PUT : 비밀번호 재설정 */
router.put("/setpassword", async (req, res, next) => {
  const { email, password } = req.body;
    await Users.setpw(email, password).then(()=>{
      res.status(200).json({ result: true, message: "비밀번호 변경 완료"});
    }).catch(()=>{
      res.status(400).json({ result: false, message: "비밀번호 변경 오류" });
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
      res.json({ result: false, message:"계정 없음" }); //계정 없음
    }
  }); 
});

module.exports = router;
