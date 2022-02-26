var nodemailer = require('nodemailer');

function sendMail(emailid,password)
{
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'meanstack89@gmail.com',
    pass: 'meanstack2020'
  }
});

var mailOptions = {
  from: 'meanstack89@gmail.com',
  to: emailid,
  subject: 'Verification mail from FindUs',
  html: "<h1>Welcome to FindUs</h1><p>You have successfully registered , your login credentials are attached below & please click on link below to verify your account</p><h3>Username : "+emailid+"</h3><h3>Password : "+password+"</h3><br>http://localhost:3000/verifyuser?emailid="+emailid
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
}

module.exports=sendMail