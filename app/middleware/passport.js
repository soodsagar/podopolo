const passport = require('passport');
const uuid = require('uuid');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('User');
const { secret } = require('../config')
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
// const { JWTstrategy, ExtractJWT } = require('passport-jwt');

passport.use('signup', new LocalStrategy({usernameField: 'user[email]', passwordField: 'user[password]'}, 
    async (email, password, done) => {
        try {
            let newUser = new User();
            // TODO - check if values exist
            newUser.id = uuid.v4();
            newUser.email = email;
            newUser.setPassword(password);

            return done(null, await newUser.save())

            // const user = await User.create({ email, password });
            // return done(null, user);
        } catch (error) {
            done(error);
        }
    })
);

passport.use('login', new LocalStrategy({ usernameField: 'user[email]', passwordField: 'user[password]'}, 
    async (email, password, done) => {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return done(null, false, { message: 'User not found' });
            }
            const validate = await user.validPassword(password);
            if (!validate) {
                return done(null, false, { message: 'Incorrect password' });
            }
            return done(null, user, { message: 'Logged in successfully' });

        } catch (error) {
            return done(error)
        }
    })
);

passport.use('jwt', new JWTstrategy({ secretOrKey: secret, jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()},
    async (token, done) => {
        try {
            const user = await User.findOne({ 'id': token.id });
            return done(null, user);
        } catch (error) {
            done(error);
        }
    })
);
