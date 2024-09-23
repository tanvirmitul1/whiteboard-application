const express = require("express");

const {
  createUser,
  loginUser,
  changePassword,
  getAllUsers,
  deleteUser,
} = require("../controllers/userController");
const {
  validateCreateUser,
  validateLogin,
} = require("../middlewares/userValidation");
const router = express.Router();

const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === "Admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied" });
  }
};

router.post("/create", validateCreateUser, createUser);
router.post("/login", validateLogin, loginUser);
router.post("/update-password", changePassword);
router.get("/get-all-users", getAllUsers);
router.delete("/delete/:id", deleteUser);

module.exports = router;
