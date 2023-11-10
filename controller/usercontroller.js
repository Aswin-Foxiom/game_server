const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { InvalidUserMsg, BadRequestMsg } = require("../utils/constants");
const { default: mongoose } = require("mongoose");

module.exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(401).send({
        message: InvalidUserMsg,
      }); // 200 OK by default
    }
    if (password) {
      const validPWD = await bcrypt.compare(password, user.password);
      if (validPWD) {
        const token = jwt.sign(
          { id: user._id, user: user.username },
          process.env.SECRET_KEY,
          { expiresIn: "24h" }
        );
        return res.status(200).send({
          message: "Succesfully Logged in",
          token: token,
        }); // 200 OK by default
      }
    }
    return res.status(401).send({
      message: InvalidUserMsg,
    }); // 200 OK by default
  } catch (error) {
    return res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

module.exports.getUser = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).send({
        message: BadRequestMsg,
      });
    }
    var data = await User.findById(new mongoose.Types.ObjectId(id));
    return res.status(200).send({
      message: "User Data",
      data: data,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

module.exports.createUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    var datas = await User.findOne({ username: username });
    if (datas) {
      return res.status(409).send({
        message: "Username Already Exist",
      });
    }
    if (username && password) {
      const genSalt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, genSalt);
      req.body.password = hashedPassword;
      await User(req.body).save();
      return res.status(200).send({
        message: "User Created Succesfully",
      });
    }
    return res.status(400).send({
      message: BadRequestMsg,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    const { id, password } = req.body;
    if (!id) {
      return res.status(400).send({
        message: BadRequestMsg,
      });
    }

    if (password) {
      const genSalt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, genSalt);
      req.body.password = hashedPassword;
    }

    console.log(req.body);

    req.body.location = {
      type: "Point",
      coordinates: [
        parseFloat(req.body.longitude),
        parseFloat(req.body.latitude),
      ],
    };

    await User.findByIdAndUpdate(new mongoose.Types.ObjectId(id), req.body);
    return res.status(200).send({
      message: "User Updated Succesfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

module.exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).send({
        message: BadRequestMsg,
      });
    }
    await User.findByIdAndDelete(new mongoose.Types.ObjectId(id));
    return res.status(200).send({
      message: "User Deleted Succesfully",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

module.exports.searchUsers = async (req, res) => {
  try {
    const { longitude, latitude } = req.body;
    const results = await User.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          key: "location",
          distanceField: "distance",
          spherical: true,
          distanceMultiplier: 0.001, // convert meters to kilometers
        },
      },
    ]);

    return res.status(200).send({ data: results, message: "Users" });
  } catch (error) {
    return res.status(500).send({ message: "Internal Server Error" });
  }
};
