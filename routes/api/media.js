const express=require("express");
const mongooose =require("mongoose");
const bodyparser=require("body-parser");
const bcrypt=require("bcryptjs");
const jsonwt=require("jsonwebtoken")
const router =express.Router();
const key =require("../../setup/connect").sceret;
const cookieparser = require("cookie-parser");

Access key ID
Secret access key
vijay
AKIA4TLUMF54YFVEJRNY
2WCmJw8qcXtGIw4mPmD67PoDp7f6XsIKwR0cS3H/

AWS.config.update({
    secretAccessKey: 'AKIA4TLUMF54YFVEJRNY',
    accessKeyId: '2WCmJw8qcXtGIw4mPmD67PoDp7f6XsIKwR0cS3H',
    region: process.env.AWS_REGION
  });


router.use(bodyparser.urlencoded({extended:false}));
router.use(bodyparser.json());
router.use(cookieparser());
const newusers= require("../../models/newuser");

// @type    GET
//@route    /auth/emailverification
// @desc    starting router
// @access  PUBLIC

router.get("/upload",(req,res)=>{

    res.render("upload");

})

// @type    POST
//@route    /auth/emailverification
// @desc    starting router
// @access  PUBLIC

router.post("/upload/aws",(req,res)=>{
       console.log( req.body.mediafile);
    res.send(`<html><body>gvhgcfcgf<iframe src="${req.body.mediafile}"></iframe></body></html>`)

})
module.exports =router;