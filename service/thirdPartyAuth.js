const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy

const User = require('../models/UsersModel')
const Profile = require('../models/ProfileModel')
const LikesPost = require('../models/LikesPostModel')
const Follow = require('../models/FollowModel')
const { generateJWT } = require('../service/auth')

passport.serializeUser((user, done) => done(null, user._id))
passport.deserializeUser((id, done) => {
  User.findById(id)
    .then((user) => {
      console.log('deserializeUser', user)
      done(null, user)
    })
    .catch((err) => done(err, null))
})

module.exports = (app, options) => {
  // if success and failure redirects aren't specified,
  // set some reasonable defaults
  if (!options.successRedirect) options.successRedirect = 'http://localhost:5000/metaShare/thirdPartyAuthSuccess'
  if (!options.failureRedirect) options.failureRedirect = 'http://localhost:5000/metaShare/login?error=thirdPartyAuthFailed'

  return {
    init: function () {
      // configure Facebook strategy
      passport.use(
        new FacebookStrategy(
          {
            clientID: options.facebookAppId,
            clientSecret: options.facebookAppSecret,
            callbackURL: (options.baseUrl || '') + '/auth/facebook/callback',
            profileFields: ['displayName', 'photos', 'email'],
          },
          async (accessToken, refreshToken, profile, done) => {
            try {
              console.log(profile)
              const email = 'facebook:' + profile._json.email

              const user = await User.findOne({ email })
              if (user) return done(null, user)

              const newUser = await User.create({
                name: profile.displayName,
                email,
                password: 'facebook',
                avator: profile._json.picture.data.url,
              })
              const userId = newUser._id
              await Profile.create({ user: userId })
              await LikesPost.create({ userId: userId })
              await Follow.create({ userId: userId })

              done(null, user)
            } catch (err) {
              console.log('whoops, there was an error: ', err.message)
              if (err) return done(err, null)
            }
          }
        )
      )

      app.use(passport.initialize())
      app.use(passport.session())
    },
    registerRoutes: () => {
      // register Facebook routes
      app.get('/api/auth/facebook', (req, res, next) => {
        if (req.query.redirect) req.session.authRedirect = req.query.redirect
        passport.authenticate('facebook', { scope: ['email'] })(req, res, next)
      })
      app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: options.failureRedirect }), (req, res) => {
        console.log('successful /auth/facebook/callback')
        // we only get here on successful authentication
        const redirect = req.session.authRedirect
        if (redirect) delete req.session.authRedirect
        const token = generateJWT({ _id: req.session.passport.user }, false)

        console.log(`redirecting to ${redirect || options.successRedirect}${redirect ? '' : ' (fallback)'}`)
        res.redirect(303, (redirect || options.successRedirect) + '?token=' + token)
      })
    },
  }
}
