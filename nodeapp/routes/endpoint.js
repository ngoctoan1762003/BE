const { mailService } = require("../service/mail.service")
const express = require('express')
const router = express.Router()
router.use(express.json());
router.use(express.urlencoded({extended: true}));

router.post('/', async function (req, res) {
    try {
      const { emailFrom, emailTo, emailSubject, emailText } = req.body;
      console.log(emailFrom, emailTo, emailSubject, emailText);
        mailService.sendEmail({
        emailFrom: emailFrom,
        emailTo: emailTo,
        emailSubject: emailSubject,
        emailText: emailText,
      });
  
      return res.status(200).json({
        message: 'reset password email sent successfully',
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  });

module.exports = router