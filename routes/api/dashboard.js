const express=require("express");
const mongooose =require("mongoose");
const bodyparser=require("body-parser");
const bcrypt=require("bcryptjs");
const jsonwt=require("jsonwebtoken")
const router =express.Router();
const key =require("../../setup/connect").sceret;
const cookieparser = require("cookie-parser");


router.use(bodyparser.urlencoded({extended:false}));
router.use(bodyparser.json());
router.use(cookieparser());
const newusers= require("../../models/newuser");

//newusers.findOne()
var obj;
router.get("/",(req,res)=> {
   var details;
   //console.log(req.cookie.auth_t);
   jsonwt.verify(req.cookies.auth_t, key, (err, user) => {
       if(err){
       return res.redirect("/login");
       }
       else{
           user
       }
    //console.log(req.cookies.auth_t +user); 
    obj ={vijay :user.username,
        id:user.id,
        email:user.email,
        
    }
    });
    console.log(obj.vijay);
    res
    .status(400)
    .render("Dashboard",{
        name: obj.vijay,
        id :obj.id,
        email:obj.email
    })
});

module.exports = router;