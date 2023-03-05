const router = require('express').Router();
const mongoose = require('mongoose');
const uuid = require('uuid');
const User = mongoose.model('User');
const passport = require('passport');

/**
 * Signup for new account
 */
router.post('/auth/signup', passport.authenticate('signup', { session: false }),
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
// router.post('/auth/login', async (req, res, next) => {
//   if (!req.body.user.email) {
//     return res.status(422).json({ error: "email can't be empty" });
//   }

//   if (!req.body.user.password) {
//     return res.status(422).json({ error: "password can't be empty" });
//   }

//   passport.authenticate('local', { session: false }, (err, user, info) => {
//     if (err) { return next(err); }

//     if (user) {
//       user.token = user.generateJWT();
//       return res.json({ user: { token: user.token } });
//     } else {
//       return res.status(422).json(info);
//     }
//   })(req, res, next);
// });

router.post('/auth/login', async (req, res, next) => { 
  passport.authenticate('login', async (err, user, info) => {
    try {
      if (err || !user) {
        const error = new Error('An error occurred.');
        return next(error);
      }

      req.login(user, { session: false },
        async (error) => {
          if (error) return next(error);

          if (user) {
            user.token = user.generateJWT();
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