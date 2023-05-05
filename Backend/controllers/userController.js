const bcrypt = require("bcryptjs");
const userModel = require("../models/User");
const jwt = require("jsonwebtoken");

//FNX TO HANDLE CREATING USER
exports.register = async (req, res) => {
  const newUser = req.body;
  try {
    const userExist = await userModel.findOne({ email: newUser.email });
    //checks if user exist
    if (userExist) {
      return res.status(409).json({ success: false, message: "User already Exist" });
    } else {
      //if not, hash their password
      const hash = bcrypt.hashSync(newUser.password);
      newUser.password = hash;
      const user = await userModel.create(newUser);
      console.log("create user data", user);
      return res.status(201).json({ success: true, message: "User Created successfully" });
    } 
  } catch (error) {
    console.error(error.name);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}

//FNX THAT HANDLES THE LOGIN OF A USER
exports.logIn = async (req, res) => {
  const user = req.body;
try {
    //checks if the user log-in exist in the database
  const userExist = await userModel.findOne({ email: user.email });
  if (userExist) {
    //Compares the user's password
    //findOne returns an object not array
    const isPasswordMatch = bcrypt.compareSync(
      user.password,
      userExist.password
    );
    //if password match
    if (isPasswordMatch === true) {
      const tokenPayload = {
        id: userExist._id,
        email: userExist.email,
      };
      //Generate auth token
      const token = jwt.sign(tokenPayload, process.env.SECRET_KEY, {
        expiresIn: 86400, // 24 hours
      });
      return res.status(200).json({
        success: true,
        message: "user Logged in successfully",
        token,
        data: userExist,
      });
    }
    else {
      return res.status(400).json({ success: false, message: "Password is incorrect" });
    }
  }
   //Respond to the client
    else {
      return res.status(404).json({ success: false, message: "User not Found" });
    }

} catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
}
}

//FNX TO GET A SINGLE USER FROM OUR DATABASE
exports.getUserById = async (req, res) => {
  const id = req.params.id || res.locals.id;
  try {
    //finds the user
    const user = await userModel.findById(id);
    //if found
    if (user) {
      //responds to the client
      return res.status(200).json({
        success: true, message: "User retrieved successfully",
        data: user,
      })
    } else {
      return res.status(404).json({ success: false, message: "User not Found" });
    } 
  } catch (error) {
    console.log(error);
    return res.status(500).json({success: false, message: "internal server error"})
  }
}

//FNX TO UPDATE A USER
exports.updateAUser = async (req, res) => {
  if (req.body.password) {
    //if not hash their password
    const hash = bcrypt.hashSync(req.body.password);
    req.body.password = hash;
  }
  //gets the id from res.locals
  const userId = res.locals.id;
  //data from req body
  const dataToUpdate = req.body;

  try {
    //find and update the user's data
    const updateData = await userModel.findByIdAndUpdate(userId, dataToUpdate, {
      new: true,
    });
    //checks if data was updated
    if (updateData) {
      return res.status(201).json({ success: true, message: "Profile updated successfully", data: updateData,});
    } else {
      return res.status(404).json({ success: false, message: "Failed to update profile, please try again" });
    }
  }
  catch (error) {
    return res.status(500).json({ success: false, message: "internal server error"});

  }
}

//FNX TO DELETE A USER
exports.deleteUserById = async (req, res) => {
  const id = req.params.user_id;
  try {
    //find and delete the user
    const deleteUser = await userModel.findByIdAndDelete(id);
    //if deleted
    if (deleteUser) {
      //responds to the client
      return res.status(201).json({ success: true, message: "User deleted successfully", data: deleteUser, });
    } else {
      return res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: "internal server error"});
    
  }
} 