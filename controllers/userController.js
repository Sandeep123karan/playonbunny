


const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// ================= REGISTER USER =================
exports.registerUser = async (req, res) => {
  try {
    const { fullName, email, password, phone, dob } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: "Full name, email and password required"
      });
    }

    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json({
        message: "Email already registered"
      });
    }

    const user = await User.create({
      fullName,
      email,
      password,
      phone,
      dob,
      role: "user"
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email
      }
    });

  } catch (error) {
    res.status(500).json({
      message: "Register error",
      error: error.message
    });
  }
};



// ================= LOGIN USER =================
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required"
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        dob: user.dob
      }
    });

  } catch (error) {
    res.status(500).json({
      message: "Login error",
      error: error.message
    });
  }
};



// ================= GET PROFILE =================
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Profile fetched",
      user
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ================= UPDATE PROFILE =================
exports.updateProfile = async (req, res) => {
  try {
    const { fullName, phone, dob } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (fullName) user.fullName = fullName;
    if (phone) user.phone = phone;
    if (dob) user.dob = dob;

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ================= GET ALL USERS =================
exports.getAllUsers = async (req, res) => {
  try {

    const users = await User.find().select("-password");

    res.json({
      message: "All users fetched successfully",
      count: users.length,
      users
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");
// const User = require("../models/User");

// /* ================= REGISTER ================= */
// // exports.registerUser = async (req, res) => {
// //   try {
// //     const user = await User.create(req.body);

// //     res.status(201).json({
// //       success: true,
// //       message: "User registered successfully",
// //       data: user,
// //     });
// //   } catch (error) {
// //     res.status(400).json({
// //       success: false,
// //       message: error.message,
// //     });
// //   }
// // };

// /* ================= REGISTER ================= */
// exports.registerUser = async (req, res) => {
//   try {
//     const { fullName, email, password } = req.body;

//     // check existing user
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({
//         success: false,
//         message: "Email already registered",
//       });
//     }

//     const user = await User.create(req.body);

//     // create token
//     const token = jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: process.env.JWT_EXPIRE }
//     );

//     res.status(201).json({
//       success: true,
//       message: "User registered successfully",
//       token,
//       user,
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
// /* ================= LOGIN ================= */
// // exports.loginUser = async (req, res) => {
// //   try {
// //     const { email } = req.body;

// //     const user = await User.findOne({ email });

// //     if (!user) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "User not found",
// //       });
// //     }

// //     res.status(200).json({
// //       success: true,
// //       message: "Login successful",
// //       data: user,
// //     });

// //   } catch (error) {
// //     res.status(500).json({
// //       success: false,
// //       message: error.message,
// //     });
// //   }
// // };

// /* ================= LOGIN ================= */
// exports.loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // check user
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid credentials",
//       });
//     }

//     // compare password
//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid credentials",
//       });
//     }

//     // create token
//     const token = jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: process.env.JWT_EXPIRE }
//     );

//     res.status(200).json({
//       success: true,
//       message: "Login successful",
//       token,
//       user,
//     });

//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
// /* ================= GET PROFILE ================= */
// exports.getProfile = async (req, res) => {
//   res.status(200).json({
//     success: true,
//     data: req.user,
//   });
// };

// /* ================= UPDATE PROFILE ================= */
// exports.updateProfile = async (req, res) => {
//   try {
//     const updatedUser = await User.findByIdAndUpdate(
//       req.user._id,
//       req.body,
//       { new: true }
//     );

//     res.status(200).json({
//       success: true,
//       message: "Profile updated successfully",
//       data: updatedUser,
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// /* ================= GET ALL USERS ================= */
// exports.getAllUsers = async (req, res) => {
//   try {
//     const users = await User.find();

//     res.status(200).json({
//       success: true,
//       count: users.length,
//       data: users,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// /* ================= GET SINGLE USER ================= */
// exports.getSingleUser = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: user,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// /* ================= UPDATE USER BY ID ================= */
// exports.updateUserById = async (req, res) => {
//   try {
//     const user = await User.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "User updated successfully",
//       data: user,
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// /* ================= DELETE USER ================= */
// exports.deleteUser = async (req, res) => {
//   try {
//     const user = await User.findByIdAndDelete(req.params.id);

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: "User deleted successfully",
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };