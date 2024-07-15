require("dotenv").config();
const express = require("express");
const router = express.Router();
const { OAuth2Client } = require("google-auth-library");

// google token
router.post("/", async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Referrer-Policy", "no-referrer-when-downgrade");

  const redirectURI = `/auth`;

  const oAuth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    redirectURI
  );

  const authorizeUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: "https://www.googleapis.com/auth/userinfo.profile openid email",
    prompt: "consent",
  });

  res.json({ url: authorizeUrl });
});

module.exports = router;
