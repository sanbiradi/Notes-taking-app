const express = require("express");
const router = express.Router();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async function (accessToken, refreshToken, profile, done) {
      // console.log(profile);
      const newUser = {
        googleId: profile.id,
        displayName: profile.displayName,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        profileImage: profile.photos[0].value,
      };

      try {
        let user = await User.findOne(
          { googleId: profile.id }
        );
        if (user) {
          done(null, user);
        } else {
          user = await User.create(newUser);
          done(null, user);
        }
      } catch (err) {
        console.log(err);
      }
    }
  )
);

// google login route
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);

// retrieve user data
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login-failure",
    successRedirect: "/dashboard",
  })
);

//logout
router.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.log(error);
      res.send("error loggin out");
    } else {
      res.redirect("/");
    }
  });
});

router.get("/login-failure", (req, res) => {
  res.send("something went wrong!");
});

// persist user data after sucessful authentication
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// //Retrieve user data from session
passport.deserializeUser(function (id, done) {
  User.findById(id)
    .then(function (user) {
      done(null, user);
    })
    .catch(function (err) {
      done(err);
    });
});

module.exports = router;
