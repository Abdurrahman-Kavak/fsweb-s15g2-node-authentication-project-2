const router = require("express").Router();
const { usernameVarmi, rolAdiGecerlimi } = require("./auth-middleware");
const { JWT_SECRET, BCRYPT_ROUNDS } = require("../secrets"); // bu secret'ı kullanın!
const Users = require("../users/users-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/register", rolAdiGecerlimi, (req, res, next) => {
  /**
    [POST] /api/auth/register { "username": "anna", "password": "1234", "role_name": "angel" }

    response:
    status: 201
    {
      "user"_id: 3,
      "username": "anna",
      "role_name": "angel"
    }
   */
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, Number(BCRYPT_ROUNDS));
  user.password = hash;
  user.role_name = req.role_name;

  Users.ekle(user)
    .then((user) => {
      res.status(201).json(user);
    })
    .catch(next);
});

router.post("/login", usernameVarmi, (req, res, next) => {
  /**
    [POST] /api/auth/login { "username": "sue", "password": "1234" }

    response:
    status: 200
    {
      "message": "sue geri geldi!",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ETC.ETC"
    }

    Token 1 gün sonra timeout olmalıdır ve aşağıdaki bilgiyi payloadında içermelidir:

    {
      "subject"  : 1       // giriş yapan kullanıcının user_id'si
      "username" : "bob"   // giriş yapan kullanıcının username'i
      "role_name": "admin" // giriş yapan kulanıcının role adı
    }
   */
  let { username, password } = req.body;

  if (bcrypt.compareSync(password, req.user.password)) {
    const token = generatedToken(req.user);
    res.status(200).json({
      message: `${req.user.username} geri geldi!`,
      token,
    });
  } else {
    next({ status: 401, message: "Geçersiz kriter" });
  }
});
function generatedToken(user) {
  const payload = {
    subject: user.user_id,
    username: user.username,
    role_name: user.role_name,
  };
  const options = {
    expiresIn: "1 day",
  };
  return jwt.sign(payload, JWT_SECRET, options);
}
module.exports = router;
