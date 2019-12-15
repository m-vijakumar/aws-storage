const express=require("express");
const router =express.Router();
const bodyparser=require("body-parser");
const bcrypt=require("bcryptjs");
const jsonwt =require("jsonwebtoken");
const cookie =require("cookie-parser");
const key =require("../../setup/connect").sceret;
const ekey ="emailkey";
const rn=require("random-number");
const sgMail = require('@sendgrid/mail');
var code="";
router.use(bodyparser.urlencoded({extended:false}));
router.use(bodyparser.json());
router.use(cookie());
const newusers= require("../../models/newuser");

// @type    get
//@route    /restpassword
// @desc    starting router
// @access  PUBLIC
router.get("/",(req,res)=>{

    res.render("resetpassword");
});

// @type    POST
//@route    /resetpassword/auth
// @desc    starting router
// @access  PUBLIC
router.post("/auth",(req,res)=>{

    if(req.body.email){
        newusers.findOne({email:req.body.email})
        .then( newuser=>{
            if(newuser){
                const userdetails ={       
                   email:req.body.email,
               };
               jsonwt.sign(userdetails, ekey,
                { expiresIn: 3000 },
                 (err, token) => {
                res.cookie("reset_t", token, { maxAge: 300000 });
                 res.redirect( "/resetpassword/emailverification");                    
                  
                 });
                
            }else{

                return res.render("resetpassword",{
                    message:'No User With This EmailId'});
        }

         })
        .catch(err =>{

            res.render("resetpassword",{
                 message :'internal error .......'
             });
            });
            
    }else{

        return res.render("resetpassword",{
            message : "Enter Email id"
    })

    }
 

});


router.get("/emailverification",(req,res)=>{

    

    const newcode = function(){
 var charaters=[1,2,3,4,5,6,7,8,9,0,'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']

var ecode="";

var options = {
    
    min: 0,
   max: 35
   ,
  integer: true
  }
  for(let i=1;i<=8;i++){
    let num= rn(options);
    //console.log("num  :"+num) 
    ecode =ecode+charaters[num];
  }

   return ecode.toString();
    }

  // code = new nowcode();
  code = newcode();
    console.log("ssssss :  "+code);



    jsonwt.verify(req.cookies.reset_t, ekey, (err, user) => {
        if(err){
        return res.render("resetpassword",{
            message:"error"
        });
        }
        else{

            sgMail.setApiKey('__YOUR_API_KEY__');
            const msg = {
            to: user.email,
            from: 'vijaykumar416p@gmail.com',
            subject: 'proxynotes',
            text: `sample proxy notes ${  code }`,
            html: '<strong>and easy to do anywhere, even with Node.js</strong>',
            };
            sgMail.send(msg)
            .then(send =>{

                console.log(send)
                return res.render("resetauth",{
                                    email : user.email,
                                    from : 'reset'
                                   
                                })

            })
            .catch(err =>{
                
                console.log(err);
                res.render("error");
            } )
        }
        })

    });

    router.post('/auth/emailverification',(req,res)=>{

        var reqcode=req.body.emailcode;
        jsonwt.verify(req.cookies.reset_t, ekey, (err, user1) => {
            if(err){
                res.send("internal error");
               console.log(err)
            }else{
    
                if(code==reqcode){
                    newusers.findOne({email:user1.email})
             .then(newuser =>{
             if(!newuser){
                 return res.render("register",{
                     message:'User Not Exists'});
             }else{
                 res.render("setpassword")
                
             }    
         })
         .catch(err =>{
    
            res.render("resetpassword",{
                 message :'internal error .......'
             });
         });
         } else{
    
           return res.render("resetauth",{
                email :user1.email,
                errormessage : "invalid code"
            });
    
            }
        }
    
        });
    
    });
// @type    POST
//@route    /restpassword/setpassword
// @desc    starting router
// @access  PRIVATE

router.post("/setpassword",(req,res)=>{

    if(req.body.password){

    }else{

       return res.render("setpassword",{
            message :"enter password"
        })
    }

    jsonwt.verify(req.cookies.reset_t, ekey, (err, user1) => {
        if(err){
            res.send("internal error");
           console.log(err)
        }else{
        newusers.findOne({email:user1.email})
         .then(newuser =>{
         if(!newuser){
             return res.render("resetpassword",{
                 message:'User Not Exists'});
             }else{
             newusers.updateOne({email:user1.email},
                {
                    $set:{
                        password:req.body.password
                    }
                })
             
             .then(  res.clearCookie("reset_t").redirect("/login") )
             .catch(err => console.log(err));
            
         }    
     })
     .catch(err =>{

        res.render("resetpassword",{
             message :'internal error .......'
         });
     });

        }
    })
})



    
module.exports = router;
