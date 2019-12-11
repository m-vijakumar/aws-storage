const express=require("express")
const bodyparser=require("body-parser");
const jsonwt= require("jsonwebtoken")
const router =express.Router();

router.use(bodyparser.urlencoded({extended:false}));
router.use(bodyparser.json());

const newusers=require("../../models/newuser");

router.get("/:username",(req,res)=>{
    console.log(req.params.username)
    newusers.findOne({username:req.params.username})
    .then(profile =>{
        console.log(profile.email)
        res.render("profiles",
        {   name:profile.username,
            mail:profile.email,
            link:profile.profile_link
        })
    })
    .catch(err => {res.render("error",{status:404} )
        
    })
})

module.exports =router;