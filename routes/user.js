const router = require('express').Router();

const {
  getUserInfo,
  updateProfile,
} = require('../controllers/user');

const { validationUpdateProfile } = require('../middlewares/validations');

router.get('/me', getUserInfo);

router.patch('/me', validationUpdateProfile, updateProfile);

module.exports = router;
