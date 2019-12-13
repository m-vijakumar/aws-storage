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

//HOME PAGE
router.get("/",(req,res)=> {
    //res.send("welcome");
    jsonwt.verify(req.cookies.auth_t, key, (err, user) => {
        if(err){
        return res.render("home");
        }
        else{
            res.redirect("/dashboard");
        }
      })
    
});

// @type    POST
//@route    /login
// @desc    starting router
// @access  PUBLIC
router.get("/login",(req,res)=>{

    res.render("login");
});


// @type    POST
//@route    /register
// @desc    starting router
// @access  PUBLIC
router.get("/register",(req,res)=>{

    res.render("register");
});

// @type    POST
//@route    /auth/register
// @desc    starting router
// @access  PUBLIC
router.post("/auth/register",(req,res)=>{
    if(req.body.username){
    }else{
        return res.render("register",{
            usermessage : "Enter UserName"
    });
    }
    if(req.body.email){
    }else{
        return res.render("register",{
            emailmessage : "Enter Email"
    });
    }
    if(req.body.password){
    }else{
        return res.render("register",{
            passmessage : "Enter Password"
    });
    }
    newusers.findOne({email:req.body.email})
        .then( newuser=>{
            if(newuser){
                return res.render("register",{
                    message:'User is Already Registered'});
            }else{
               
            const userdetails ={
                     username: req.body.username,
                    email:req.body.email,
                    password: req.body.password
            
                };
                jsonwt.sign(userdetails, ekey,
                    { expiresIn: 3000 },
                     (err, token) => {
                    res.cookie("email_t", token, { maxAge: 300000 });
                     res.redirect( "/emailverification");
                     
                      
                  });
                }
        })
     .catch(err =>{

        res.render("register",{
             message :'internal error .......'
         });
        });
       
});


// @type    POST
//@route    /emailverification
// @desc    starting router
// @access  PUBLIC

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



    jsonwt.verify(req.cookies.email_t, ekey, (err, user) => {
        if(err){
        return res.render("register",{
            message:"error"
        });
        }
        else{

            sgMail.setApiKey('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');
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
                return res.render("gmailauth",{
                                    email : user.email,
                                   
                                })

            })
            .catch(err =>{
                
                console.log(err);
                res.render("error");
            } )
        
            // var transporter = nodemailer.createTransport({
            //   service: 'gmail',
            //   auth: {
            //     user: '121710307020@gitam.in',
            //     pass: 'vijay123'
            //   }
            // });
            
            // var mailOptions = {
            //   from: 'vbankofindia@gmail.com',
            //   to: user.email,
            //   subject: 'vbankverification code',
            //   text: `Welcome to vbankofindia this mail is to comform your email addresss\n CODE  :${  code }\n please Enter this code to verify your email account \n\n Thankyou...`
            // };
            
            // transporter.sendMail(mailOptions, (error, info)=>{
            //   if (error) {
            //     console.log(error);
            //   } else {
            //     console.log('Email sent: ' + info.response);
            //     return res.render("gmailauth",{
            //         email : user.email,
                   
            //     })
            //   }
            // });
        }
});
});

// @type    POST
//@route    /auth/emailverification
// @desc    starting router
// @access  PUBLIC

router.post('/auth/emailverification',(req,res)=>{

    var reqcode=req.body.emailcode;
    jsonwt.verify(req.cookies.email_t, ekey, (err, user1) => {
        if(err){
            res.send("internal error");
           console.log(err)
        }else{

            if(code==reqcode){
                newusers.findOne({email:user1.email})
         .then(newuser =>{
         if(newuser){
             return res.render("register",{
                 message:'User is Already Registered'});
         }else{
             const Newuser =new newusers({
                 username: user1.username,
                 email:user1.email,
                password: user1.password,
                profile_link:`localhost:5000/profile/${user1.username}`

             });
             Newuser
             .save()
             .then(  res.clearCookie("email_t").redirect("/login") )
             .catch(err => console.log(err));
            
         }    
     })
     .catch(err =>{

        res.render("register",{
             message :'internal error .......'
         });
     });
     } else{

       return res.render("gmailauth",{
            email :user1.email,
            errormessage : "invalid code"
        });

        }
    }

    });

});


// @type    POST
//@route    /auth/login
// @desc    starting router
// @access  PUBLIC
router.post("/auth/login",(req,res)=>{

    const username = req.body.name;
    const password =req.body.password;
    if(username){
    }else{
        return res.render("login",{
            usermessage : "Enter UserName"
    });
    }
    if(password){
    }else{
        return res.render("login",{
            passmessage : "Enter Password"
    });
    }
    newusers.findOne({username})
    .then(user =>{

        if(!user){
            return res.render("login",{
                message : "Invalied UserName or Password"
            })
        }
        //compareing password
        const pass = user.password;
        if(password == pass){
            //creating a token
            const payload ={
                id:user.id,
                username :user.username,
                email:user.email
            };

             jsonwt.sign(payload, key,
                 { expiresIn: 9000000 },
                  (err, token) => {
                 res.cookie("auth_t", token, { maxAge: 90000000 });
                  res.redirect( "/dashboard");
               });

            
        }else{
            return res.render("login",{
                message : "Invalied UserName or Password"
            })
        }
    })
    .catch(err=>{ res.render("login",{
        message : `${err}`
        })
    
    })


});

router.get("/logout", (req, res) => {
    jsonwt.verify(req.cookies.auth_t, key, (err, user) => {
      if (user) {
        res.clearCookie("auth_t").redirect("/")
        
      } else {
        return res
        .status(404)
        .json({ done: 0 });
      }
    });
  });


module.exports =router;