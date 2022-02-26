var express = require('express');
var router = express.Router();
var url = require('url')
var path = require('path')
const adminModel=require('../models/adminmodel')
const indexModel=require('../models/indexmodel')

/* Middleware to check user authentication */
router.use((req,res,next)=>{
  if(req.session.sunm==undefined || req.session.srole!="admin")
  {
   req.session.destroy();
   res.redirect("/logout")
  }
  next()  
})


/* Middleware function to fetch category list */
var clist
router.use('/managesubcategory',(req,res,next)=>{
  indexModel.fetchAll('category').then((result)=>{
    clist=result
    next()
  }).catch((err)=>{
    console.log(err)
  })
})



/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('adminhome',{'sunm':req.session.sunm});
});

router.get('/manageusers', function(req, res, next) {
  adminModel.fetchUsers().then((result)=>{
    res.render('manageusers',{'result':result,'sunm':req.session.sunm});
  }).catch((err)=>{
    console.log(err)
  })
});

router.get('/manageuserstatus', function(req, res, next) {
  var statusDetails=url.parse(req.url,true).query
  adminModel.manageuserstatus(statusDetails).then((result)=>{
    res.redirect('/admin/manageusers')
  }).catch((err)=>{
    console.log(err)
  })
});

router.get('/managecategory', function(req, res, next) {
  res.render('managecategory',{'msg':'','sunm':req.session.sunm});
});
router.post('/managecategory', function(req, res, next) {
  var catnm=req.body.catnm
  var caticon=req.files.caticon
  var caticonnm=Date.now()+'-'+caticon.name
  var caticonpath=path.join(__dirname,"../public/uploads/categoryicons",caticonnm)
  caticon.mv(caticonpath)
  adminModel.managecategory(catnm,caticonnm).then((result)=>{
    res.render('managecategory',{'msg':'category added','sunm':req.session.sunm});
  }).catch((err)=>{
    console.log(err)
  })
});




router.get('/managesubcategory', function(req, res, next) {
  res.render('managesubcategory',{'msg':'','clist':clist,'sunm':req.session.sunm});
});
router.post('/managesubcategory', function(req, res, next) {
  var catnm=req.body.catnm
  var subcatnm=req.body.subcatnm
  var subcaticon=req.files.subcaticon
  var subcaticonnm=Date.now()+'-'+subcaticon.name
  var subcaticonpath=path.join(__dirname,"../public/uploads/subcategoryicons",subcaticonnm)
  adminModel.managesubcategory(catnm,subcatnm,subcaticonnm).then((result)=>{
    if(result)
    {
      subcaticon.mv(subcaticonpath)
      res.render('managesubcategory',{'msg':'Sub Cateory added successfully','clist':clist,'sunm':req.session.sunm});
    }
    else
      res.render('managesubcategory',{'msg':'Sub Cateory already exists','clist':clist,'sunm':req.session.sunm});      
  }).catch((err)=>{
    console.log(err)
  })
});


module.exports = router;
