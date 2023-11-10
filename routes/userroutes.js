const express = require("express");
const {
  login,
  createUser,
  updateUser,
  deleteUser,
  searchUsers,
  getUser,
} = require("../controller/UserController");
const router = express.Router();

router
  .route("/")
  .post(async (req, res) => {
    await createUser(req, res);
    return;
  })
  .get(async (req, res) => {
    await getUser(req, res);
    return;
  })
  .put(async (req, res) => {
    await updateUser(req, res);
    return;
  })
  .delete(async (req, res) => {
    await deleteUser(req, res);
    return;
  });

router.route("/login").post(async (req, res) => {
  await login(req, res);
  return;
});

router.route("/search-partner").post(async (req, res) => {
  await searchUsers(req, res);
  return;
});

module.exports = router;
