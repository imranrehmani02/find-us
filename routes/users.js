var express = require('express');
var indexModel=require('../models/indexmodel')
var userModel=require('../models/usermodel')
var url=require('url')
var path=require('path')
var state_city_list=require('./state-city-list')
var router = express.Router();

/* Middleware to check user authentication */
router.use((req,res,next)=>{
  if(req.session.sunm==undefined || req.session.srole!="user")
  {
    req.session.destroy();
    res.redirect("/logout")
  }
  next()  
})

/* Middleware to fetch category list */
var clist
router.use("/addlocation",(req,res,next)=>{
indexModel.fetchAll('category').then((result)=>{
  clist=result
  next()
}).catch((err)=>{
  console.log(err)
})
})


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('userhome',{'sunm':req.session.sunm});
});

router.get('/addlocation', function(req, res, next) {
  var state_list=state_city_list.fetchStateList()
  res.render('addlocation',{'sunm':req.session.sunm,'clist':clist,'state_list':state_list,'msg':''});
});
router.post('/addlocation', function(req, res, next) {
  var state_list=state_city_list.fetchStateList()
  locationDetails=req.body
 
  var file1=req.files.file1
  var file1nm=Date.now()+'-'+file1.name
  var file1path=path.join(__dirname,"../public/uploads/locationimages",file1nm)
  file1.mv(file1path)

  var file2=req.files.file2
  if(file2!=undefined)
  {
    var file2nm=Date.now()+'-'+file2.name
    var file2path=path.join(__dirname,"../public/uploads/locationimages",file2nm)
    file2.mv(file2path)
  }
  else
    var file2nm="mylogo.jpg"
  
  var file3=req.files.file3
  if(file3!=undefined)
  {
    var file3nm=Date.now()+'-'+file3.name
    var file3path=path.join(__dirname,"../public/uploads/locationimages",file3nm)
    file3.mv(file3path)
  }
  else
    var file3nm="mylogo.jpg"
  
  var file4=req.files.file4  
    if(file4!=undefined)
    {
      var file4nm=Date.now()+'-'+file4.name
      var file4path=path.join(__dirname,"../public/uploads/locationimages",file4nm)
      file4.mv(file4path)
    }
    else
      var file4nm="mylogo.jpg"  

    locationDetails.file1=file1nm
    locationDetails.file2=file2nm
    locationDetails.file3=file3nm
    locationDetails.file4=file4nm
  
    locationDetails.status=0
    locationDetails.info=Date()
    userModel.addlocation(locationDetails).then((result)=>{
      res.render('addlocation',{'sunm':req.session.sunm,'clist':clist,'state_list':state_list,'msg':'Location added successfully....'});
    }).catch((err)=>{
       console.log(err) 
    })
});

router.get('/fetchsubcat', function(req, res, next) {
  var catnm=url.parse(req.url,true).query.catnm  
  userModel.fetchsubcat(catnm).then((result)=>{
    res.send(result)
  }).catch((err)=>{
    console.log(err)
  })
});

router.get('/fetchcity', function(req, res, next) {
  var s=url.parse(req.url,true).query.s  
  var city_list=state_city_list.fetchCityList(s)
  res.send(city_list)
});

router.get('/fetchlocality', function(req, res, next) {
  var c=url.parse(req.url,true).query.c  
  userModel.fetchlocality(c).then((result)=>{
    res.send(result)
  }).catch((err)=>{
    console.log(err)
  })
});

router.get('/managelocations', function(req, res, next) {
  userModel.managelocations().then((result)=>{
    PAYPAL_URL="https://www.sandbox.paypal.com/cgi-bin/webscr"
  	PAYPAL_ID="sb-6w4b472741371@business.example.com"
      res.render('managelocations',{'PAYPAL_URL':PAYPAL_URL,'PAYPAL_ID':PAYPAL_ID,'sunm':req.session.sunm,'locationDetails':result});
    }).catch((err)=>{
      console.log(err)
    })
});

router.get('/payment', function(req, res, next) {
  urlData=url.parse(req.url,true).query  
  userModel.payment(urlData).then((result)=>{
    res.redirect('/user/managelocations')
  }).catch((err)=>{
    console.log(err)
  })
});


router.get('/cancel', function(req, res, next) {
  res.render('cancel',{'sunm':req.session.sunm});
});

router.get('/cpass', function(req, res, next) {
  res.render('cpassuser',{'sunm':req.session.sunm,'msg':''});
});
router.post('/cpass', function(req, res, next) {
  userModel.cpassuser(req.session.sunm,req.body).then((result)=>{
    res.render('cpassuser',{'sunm':req.session.sunm,'msg':result.msg});
  }).catch((err)=>{
    console.log(err)
  })
});

module.exports = router;
