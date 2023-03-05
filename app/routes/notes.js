const router = require('express').Router();
const { isLoggedIn } = require('../middleware/checkAuth');

router.get('/notes', function(req, res) {
  res.json({ message: 'Hello note!' });
});

module.exports = router;