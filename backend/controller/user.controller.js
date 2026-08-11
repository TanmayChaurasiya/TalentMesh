const Profile = require("../models/profiles.model");
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const fs = require("fs");
const crypto = require("crypto");
const PDFDocument = require("pdfkit");
const ConnectionRequest = require("../models/connections.model");

const convertUserDataTOPDF = async (userData) => {
  const doc = new PDFDocument();
  const outputPath = crypto.randomBytes(32).toString("hex") + ".pdf";
  const stream = fs.createWriteStream("uploads/" + outputPath);

  doc.pipe(stream);

  doc.image(`uploads/${userData.userId.profilePicture}`, {
    align: "center",
    width: 100,
  });
  doc.fontSize(14).text(`Name:${userData.userId.name}`);
  doc.fontSize(14).text(`Username:${userData.userId.username}`);
  doc.fontSize(14).text(`Email:${userData.userId.email}`);
  doc.fontSize(14).text(`Bio:${userData.bio}`);
  doc.fontSize(14).text(`Current Position:${userData.currentPost}`);

  doc.fontSize(14).text("Past Work:- ");
  userData.pastWork.forEach((work, index) => {
    doc.fontSize(14).text(`Company Name: ${work.company}`);
    doc.fontSize(14).text(`Position: ${work.position}`);
    doc.fontSize(14).text(`Years: ${work.years}`);
  });

  doc.end();

  return outputPath;
};

const register = async (req, res) => {
  try {
    const { name, username, password, email } = req.body;

    if (!name || !password || !username || !email) {
      return res.status(400).json({ message: "All Fields are Required" });
    }

    const user = await User.findOne({
      email,
    });

    if (user) {
      return res.status(400).json({ message: "User already registerd" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      username,
      password: hashedPassword,
      email,
    });

    await newUser.save();

    const profile = new Profile({
      userId: newUser._id,
    });

    await profile.save();

    return res.json({ message: "User Created" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { password, email } = req.body;

    if (!password || !email) {
      return res.status(400).json({ message: "All Fields are Required" });
    }

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({ message: "User not registerd yet" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ message: "Invalid Credentials!" });
    }

    const token = crypto.randomBytes(32).toString("hex");

    await User.updateOne({ _id: user._id }, { token });

    return res.status(200).json({ message: "Successful Login!", token });
  } catch (err) {
    return res
      .status(500)
      .json({ message: `Error occur at login time : ${err.message} ` });
  }
};

const uploadProfilePicture = async (req, res) => {
  const { token } = req.body;
  console.log(req.file);
  try {
    const user = await User.findOne({ token: token });

    if (!user) {
      return res.status(404).json({ message: "User not Found" });
    }

    user.profilePicture = req.file.filename;

    await user.save();

    return res.json({ message: "Profile Picture Uploaded" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    console.log("req.body",req.body);
    const { token, ...newUserData } = req.body;

    const user = await User.findOne({ token });
    console.log("_id:",user);
    if (!user) {
      return res.status(404).json({ message: "User not Found" });
    }

    const exestingUser = await User.findOne({
  $or: [
    { username: newUserData.username },
    { email: newUserData.email },
  ],
});

if (
  exestingUser &&
  String(exestingUser._id) !== String(user._id)
) {
  return res.status(400).json({
    message: "User already exists",
  });
}
    //Object.assign use to assign the value of variable into another
    Object.assign(user, newUserData);

    await user.save();

    return res.json({ message: "User Updated" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getUserAndProfile = async (req, res) => {
  const { token } = req.query;

  try {
    const user = await User.findOne({ token: token });

    if (!user) {
      return res.status(404).json({ message: "User not Found" });
    }

    const userProfile = await Profile.findOne({ userId: user._id }).populate(
      "userId",
      "name email username profilePicture",
    );

    return res.json({ profile: userProfile });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateProfileData = async (req, res) => {
  const { token, ...newProfileDate } = req.body;

  try {
    const userProfile = await User.findOne({ token: token });

    if (!userProfile) {
      return res.status(404).json({ message: "User not Found" });
    }

    const profile_to_update = await Profile.findOne({
      userId: userProfile._id,
    });

    Object.assign(profile_to_update, newProfileDate);

    await profile_to_update.save();

    return res.json({ message: "Profile is Updated" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAllUserProfile = async (req, res) => {
  try {
    const profiles = await Profile.find().populate(
      "userId",
      "name username email profilePicture",
    );

    return res.json({ profiles });
  } catch (err) {
    return res.status(500).json({ message: error.message });
  }
};

const downloadProfile = async (req, res) => {
  try {
    console.log(req.query.id);
    const user_id = req.query.id;
    // console.log(user_id);
    const userProfile = await Profile.findOne({ userId: user_id }).populate(
      "userId",
      "name username email profilePicture",
    );
    // console.log(userProfile);
    let a = await convertUserDataTOPDF(userProfile);
    return res.json({ message: a });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const sendConnectionRequest = async (req, res) => {
  console.log(req.body);
  try {
    const { token, connectionId } = req.body;

    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const connectionUser = await User.findOne({ _id: connectionId });

    if (!connectionUser) {
      return res.status(404).json({ message: "Connection User not found" });
    }

    const existingRequest = await ConnectionRequest.findOne({
      userId: user._id,
      connectionId: connectionUser._id,
    });

    if (existingRequest) {
      return res.status(404).json({ message: "Request already sent" });
    }

    const request = new ConnectionRequest({
      userId: user._id,
      connectionId: connectionUser._id,
    });

    await request.save();

    return res.json({ message: "Request Sent" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getMyConnectionRequest = async (req, res) => {
  try {
    const { token } = req.query;
    console.log("getMyConnectionRequest",token);
  
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
   const connections = await ConnectionRequest.find({
     
         userId: user._id,
      
    })
      .populate("userId", "name username email profilePicture");

    return res.json({ connections });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const whatAreMyConnection = async (req, res) => {
  try {
    const { token } = req.query;

    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const connections = await ConnectionRequest.find({
      connectionId: user._id,
    }).populate('userId',"name username  email profilePicture").populate("connectionId", "name username email profilePicture");

    return res.json(connections);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const acceptConnectionRequest = async (req, res) => {
  try {
    const { token, requestId, action_type } = req.body;

    const user = await User.findOne({ token });
    console.log(requestId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const connection = await ConnectionRequest.findOne({ _id: requestId });
    if (!connection) {
      return res.status(404).json({ message: "Connection request not found" });
    }

    if (action_type === "accept") {
      connection.status_accepted = true;
    } else {
      connection.status_accepted = false;
    }

    await connection.save();

    return res.json({ message: "Request Updated" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getUserProfileAndUserBasedOnUsername = async (req, res) => {
  const { username } = req.query;
  console.log(username);
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const userProfile = await Profile.findOne({ userId: user._id }).populate(
      "userId",
      "name username email profilePicture",
    );
    return res.json({"profile":userProfile}); 
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  register,
  login,
  uploadProfilePicture,
  updateUserProfile,
  getUserAndProfile,
  sendConnectionRequest,
  updateProfileData,
  getAllUserProfile,
  downloadProfile,
  getMyConnectionRequest,
  acceptConnectionRequest,
  whatAreMyConnection,
  getUserProfileAndUserBasedOnUsername,
};
