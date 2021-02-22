const { Router } = require('express');
const router = Router();
const {
  getHomePage,
  getRegisterPage,
  createUser,
  requestGoogleProfile,
  useGoogleAuth,
  getLoginPage,
  loginUser,
  getWriteSecretPage,
  addSecretField,
  logoutUser,
  getSecretsPage,
} = require('../controllers/userController');

router.route('/').get(getHomePage);

router
  .route('/register')
  .get(getRegisterPage)
  .post(createUser, (req, res) => res.redirect('/secrets'));

router.get('/auth/google', requestGoogleProfile);

router.get('/auth/google/secrets', useGoogleAuth);

router.route('/login').get(getLoginPage).post(loginUser);

router.get('/writeSecret', getWriteSecretPage);

router.post('/submitSecret', addSecretField);

router.get('/logout', logoutUser);

router.get('/secrets', getSecretsPage);

module.exports = router;
