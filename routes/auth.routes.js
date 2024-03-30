const Router = require("express");
const User = require("../models/User");
const { check, validationResult } = require("express-validator");
const router = new Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const authMiddleware = require("../middleware/auth.middleware");

router.post(
  `/registration`,
  [
    check("email", "Incorrect email").isEmail(),
    check(
      "password",
      "Password must be longer then 3 and shorter than 12"
    ).isLength({ min: 3, max: 12 }),
    check("name", "Name must be longer then 3 and shorter than 10").isLength({
      min: 3,
      max: 10,
    }),
  ],
  async (req, res) => {
    try {
      console.log(req.body);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Incorrect request", errors });
      }
      const { name, email, password } = req.body;

      const possibleUserEmail = await User.findOne({ email });
      const possibleUserName = await User.findOne({ name });

      if (possibleUserEmail) {
        return res
          ./*set("Access-Control-Allow-Origin", 'https://deploy-my-front.vercel.app/')
                .*/ status(400)
          .json({ message: `User with email ${email} already exists` });
      }
      if (possibleUserName) {
        return res
          ./*set("Access-Control-Allow-Origin", 'https://deploy-my-front.vercel.app/')
                .*/ status(400)
          .json({ message: `User with name ${name} already exists` });
      }
      const hashPassword = await bcrypt.hash(password, 8);
      const user = new User({ name, email, password: hashPassword });
      await user.save();
      return res./*set("Access-Control-Allow-Origin",'https://myproject-front.vercel.app' )
            .*/ json({ message: "User was created", created: true });
    } catch (e) {
      res.send({ message: "Server error" });
    }
  }
);
router.post("/login", async (req, res) => {
  try {
    console.log('login')
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found", login: false });
    }
    const isPassValid = bcrypt.compareSync(password, user.password);
    if (!isPassValid) {
      return res
        .status(400)
        .json({ message: "Invalid password", password: false });
    }

    const token = jwt.sign(
      { id: user._id },
      /*config.get("SECRET_KEY")*/ process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );
    console.log("data was sent");
    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        isAuthenticated: true
      },
    });
  } catch (e) {
    res.send({ message: "Server error" });
  }
});

router.get("/auth", authMiddleware, async (req, res) => {
  console.log('auth')
  try {
    const user = await User.findOne({ _id: req.user.id });
    console.log(user._id);
    const token = jwt.sign(
      { id: user._id },
      /*config.get("SECRET_KEY")*/ process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );
    return res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        isAuthenticated:true
      },
    });
  } catch (e) {
    res.send({ message: "Server error" });
  }
});

module.exports = router;
