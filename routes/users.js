const router = require('express').Router();
const { getUser, patchProfileInfo } = require('../controllers/users');
const { validatePatchingProfileUser } = require('../middlewares/validatePatchingProfileUser');

router.get('/me', getUser);
router.patch('/me', validatePatchingProfileUser, patchProfileInfo);

module.exports = router;
