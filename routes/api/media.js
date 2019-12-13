const express=require("express");
const bodyparser=require("body-parser");
const jsonwt=require("jsonwebtoken")
const router =express.Router();
const key =require("../../setup/connect").sceret;
const cookieparser = require("cookie-parser");
const AWS =require('aws-sdk');
const multer = require('multer') ;
var storage = multer.memoryStorage();
var upload = multer({storage : storage}).single("mediafile");


router.use(bodyparser.urlencoded({extended:false}));
router.use(bodyparser.json());
router.use(cookieparser());
const newusers= require("../../models/newuser");

var kkraj;

AWS.config.update({
  accessKeyId: 'AKIA4TLUMF543DHEL26U',
  secretAccessKey: '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',
  region: 'ap-south-1'
});

// @type    GET
//@route    /api/media/upload
// @desc    starting router
// @access  PUBLIC

router.get("/upload",(req,res)=>{

  jsonwt.verify(req.cookies.auth_t, key, (err, user) => {
    if(err){
    return res.redirect("/login");
    }
    else{
      res.render("upload");
    }
  })

})

// @type    POST
//@route    /api/media/upload/aws
// @desc    starting router
// @access  PUBLIC
const s3 = new AWS.S3()
router.post("/upload/aws", async (req,res)=>{
  // console.log(`myuploads/${req}`);
 await jsonwt.verify(req.cookies.auth_t, key, (err, user) => {
    if(err){
    return res.redirect("/login");
    }
    else{
       var uploadParams = {
         Bucket: 'proxynotes',
         Key: '',
         ContentType:"video/mp4",
         ACL: 'public-read',
         Body: ''};
          
           upload(req,res,(error)=>{
          if(error){
            res.render('error');
          }else{
            uploadParams.Key =`${user.username}_${req.file.originalname}`;
            uploadParams.Body = req.file.buffer;

            s3.upload (uploadParams, function (err, data) {
              if (err) {
                console.log("Error", err);
                res.render('error');
              } if (data) {
                kkraj =data.Location;
                console.log("Upload Success", data.Location);
                newusers.findOne({email:user.email})
                .then(r =>{
                  r.videos.push({
                    video_url: data.Location
                  })
                  r.save();
                  res.render("mediafile",{
                    message : "video uploaded",
                    src : data.Location
                  })
                }).catch(err =>{ console.log(err);
                  res.render("mediafile",{
                    message : "video uploaded"
                    })
                  })
                }
                });
            }
             
           });
    }
  })
  
    // res.send(`<html><body>gvhgcfcgf<iframe src="${kkraj}"></iframe></body></html>`)

})


router.get("/myvideos_list",(req,res)=>{
let allvideos= [] ;
  jsonwt.verify(req.cookies.auth_t, key, (err, user) => {
    if(err){
    return res.redirect("/login");
    }
    else{
        newusers.findOne({email:user.email}).then(result =>{
        
         result.videos.forEach(a => {
         
       allvideos.push(a.video_url)
      });
      console.log("list  : " +allvideos)
        return res.render("videoslist",{
           src:allvideos
       });
        }).catch(err =>{
          console.log(err);
          res.render("error")
        })
     
    }
  })
})
module.exports =router;