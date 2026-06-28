const User = require("../model/user-model");

const home = async (req, res) => {
  res.status(200).send("Welcome to my website");
};


const register = async (req, res, next) => {
  try {

    const { username, email, phone, password } = req.body;

    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(400).json({ message: "email already exists" });
    }

    const userCreated = await User.create({
      username,
      email,
      phone,
      password,
    });

    res.status(201).json({
      msg: "registration successful",
      token: await userCreated.generateToken(),
      userId: userCreated._id.toString(),
    });

  } catch (error) {
    next(error);  
  }
};


const login = async (req, res, next) => {
  try {

    const { email, password } = req.body;

    const userExist = await User.findOne({ email });

    if (!userExist) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await userExist.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      msg: "Login Successful",
      token: await userExist.generateToken(),
      userId: userExist._id.toString(),
    });

  } catch (error) {
    next(error);  
  }
};


const user = async (req, res) => {
  try {
    return res.status(200).json({ userData: req.user });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { home, register, login, user };
