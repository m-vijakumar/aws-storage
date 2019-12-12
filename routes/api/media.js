const express=require("express");
const mongooose =require("mongoose");
const bodyparser=require("body-parser");
const bcrypt=require("bcryptjs");
const jsonwt=require("jsonwebtoken")
const router =express.Router();
const key =require("../../setup/connect").sceret;
const cookieparser = require("cookie-parser");
var path = require('path');
var fs =require('fs')
const AWS =require('aws-sdk');
  
AWS.config.update({
  accessKeyId: 'AKIA4TLUMF54XQDBTRUR',
  secretAccessKey: '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',
  region: 'ap-south-1'
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
const s3 = new AWS.S3()
router.post("/upload/aws", async (req,res)=>{
       console.log("filee   "+ req.files.filename);
       var uploadParams = {Bucket: 'proxynotes', Key: '', Body: ''};
var file = req.body.mediafile;

       var fileStream = fs.createReadStream(file);
          fileStream.on('error', function(err) {
            console.log('File Error', err);
          });
        uploadParams.Body = fileStream;
        
        uploadParams.Key = path.basename(file);
        s3.upload (uploadParams, function (err, data) {
          if (err) {
            console.log("Error", err);
          } if (data) {
            console.log("Upload Success", data.Location);
          }
        });
try{

    
  const response = await s3.listObjectsV2({
    Bucket : "proxynotes"
  }).promise();

  console.log(response);

}catch(e){
      console.log("error   "+e)
}
       
    res.send(`<html><body>gvhgcfcgf<iframe src="${req.body.mediafile}"></iframe></body></html>`)

})
module.exports =router;