

const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  getAllUsers
} = require("../controllers/userController");

const { protectUser } = require("../middleware/auth");

router.post("/register", registerUser);
router.post("/login", loginUser);

// 🔐 profile routes
router.get("/profile", protectUser, getProfile);
router.put("/profile", protectUser, updateProfile);
router.get("/", protectUser, getAllUsers);
module.exports = router;





// const express = require("express");
// const router = express.Router();

// const {
//   registerUser,
//   loginUser,
//   getProfile,
//   updateProfile,
//   getAllUsers,
//   getSingleUser,
//   updateUserById,
//   deleteUser
// } = require("../controllers/userController");

// const { protectUser } = require("../middleware/auth");

// /* ================= AUTH ================= */
// router.post("/register", registerUser);   // CREATE
// router.post("/login", loginUser);

// /* ================= PROFILE ================= */
// router.get("/profile", protectUser, getProfile);
// router.put("/profile", protectUser, updateProfile);

// /* ================= ADMIN CRUD ================= */
// router.get("/", protectUser, getAllUsers);           // READ ALL
// router.get("/:id", protectUser, getSingleUser);     // READ ONE
// router.put("/:id", protectUser, updateUserById);    // UPDATE
// router.delete("/:id", protectUser, deleteUser);     // DELETE

// module.exports = router;