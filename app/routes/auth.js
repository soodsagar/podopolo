const router = require('express').Router();
const passport = require('passport');
const passportOpts = { session: false };

/**
 * Signup for new account
 */
router.post('/auth/signup', passport.authenticate('signup', passportOpts),
  async (req, res, next) => {
    try {
      res.status(201).end();
    } catch (error) {
      console.log(error);
    }
  }
);

/**
 * Login with email and password
 */
router.post('/auth/login', async (req, res, next) => { 
  passport.authenticate('login', async (err, user, info) => {
    try {
      if (err || !user) {
        return res.status(403).json(info);
      }

      req.login(user, passportOpts, async (error) => {
          if (error) return next(error);

          if (user) {
            user.token = user.createJWT();
            return res.json({ user: { token: user.token } });
          } else {
            return res.status(422).json(info);
          }
        }
      );
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});


module.exports = router;