const express = require("express")
const bodyparser =require("body-parser")
const mongoose =require("mongoose");
const ejs =require("ejs");
const app = express(); 
const key = require("./setup/connect").sceret;
const sgMail = require('@sendgrid/mail');
const cookieparser = require("cookie-parser");


const port = process.env.PORT ||5000;

  
app.use("/",require("./routes/api/auth"));
app.use("/profile",require("./routes/api/profile"));
app.use("/dashboard",require("./routes/api/dashboard"));
app.use("/resetpassword",require("./routes/api/resetpassword"));
app.use("/api/media",require("./routes/api/media"));
app.use(bodyparser.urlencoded({extended : false}))
app.use(bodyparser.json());
app.use(express.static("public"));
app.set("view engine","ejs");


//mongodb connection 
const db =require("./setup/connect").mongodbURL;
mongoose
.connect(db,{ useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true, useUnifiedTopology: true })
.then(()=>console.log("mongodb connceted"))
.catch(err =>console.log(err))
 
// @type    GET
//@route    /
// @desc    starting router
// @access  PUBLIC
app.use(cookieparser());

app.get("/",(req,res)=>{
//res.send("welcome");

// var helper = require('sendgrid').mail;
// var sg = require('sendgrid')('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');
// var fromEmail = new helper.Email('munikotivijaykumar@gmail.com');
// var   toEmail = new helper.Email('munikotivijaykumar@gmail.com');
// var subject = 'Sending with SendGrid is Fun';
// var content = new helper.Content('text/plain', 'and easy to do anywhere, even with Node.js');
// var mail = new helper.Mail(fromEmail, subject, toEmail, content);


// var request = sg.emptyRequest({
// method: 'post',
// path: '/v3/mail/send',
// body: mail.toJSON()
// });

// sg.API(request, function (error, response) {
// if (error) {
//     console.log('Error response received');
// }
// console.log(response.statusCode);
// console.log(response.body);
// console.log(response.headers);
// res.render("home");
// });
sgMail.setApiKey('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');


    sgMail.send({
        to: 'vijaykumar416p@gmail.com',
        from: 'vijaykumar416p@gmail.com',
        subject: 'vijaykumar',
        text: `sample proxy notes 1235679`,
        html: '<strong>and easy to do anywhere, even with Node.js</strong>'
    })
    .then(send =>{
    
        console.log(send)
    })
    .catch(err =>{
        console.log(err);
        res.render("error");
    } )
    

res.render("home");
});

app.listen(port,console.log("server is running.........."));

module.exports=app;

