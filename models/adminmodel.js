const db=require('./connection')

function adminModel()
{
    this.fetchUsers=()=>{
        return new Promise((resolve,reject)=>{
            db.collection("register").find({'role':'user'}).toArray((err,data)=>{
                if(err)
                    reject(err)
                else
                    resolve(data)    
            })    
        })    
    }

    this.manageuserstatus=(statusDetails)=>{
        return new Promise((resolve,reject)=>{
            if(statusDetails.s=="block")
            {
                db.collection("register").update({'_id':parseInt(statusDetails.regid)},{$set:{'status':0}},(err)=>{
                    if(err)
                        reject(err)
                    else
                        resolve({'s':1})    
                })
                
            }   
            else if(statusDetails.s=="unblock")
            {
                db.collection("register").update({'_id':parseInt(statusDetails.regid)},{$set:{'status':1}},(err)=>{
                    if(err)
                        reject(err)
                    else
                        resolve({'s':1})    
                })
            } 
            else
            {
                db.collection("register").remove({'_id':parseInt(statusDetails.regid)},(err)=>{
                    if(err)
                        reject(err)
                    else
                        resolve({'s':1})    
                })
            }
        })
    }

    this.managecategory=(catnm,caticonnm)=>{
        return new Promise((resolve,reject)=>{
            db.collection("category").find().toArray((err,data)=>{
                if(err)
                    reject(err)
                else
                {
                    var cDetails={}
                    if(data.length==0)
                        cDetails._id=1
                    else
                    {
                        max_id=data[0]._id
                        for(row of data)
                        {
                            if(max_id<row._id)
                                max_id=row._id
                        }
                        cDetails._id=max_id+1 
                    }    
                    var cstatus=0
                    if(data.length!=0)
                    {
                       for(row of data)
                       {
                           if(row.catnm==catnm)
                           {
                                  resolve({'msg':'Category already exists please select new...'})            
                                  cstatus=1
                           }
                       }        
                    }
                    
                    if(cstatus==0)
                    {
                    cDetails.catnm=catnm
                    cDetails.caticonnm=caticonnm    
                    db.collection("category").insert(cDetails,(err)=>{
                        if(err)
                            reject(err)
                        else    
                            resolve({'msg':'Cateory added successfully'})   
                    })
                    }    

                }    
            })
            
        }) 
    }



    this.managesubcategory=(catnm,subcatnm,subcaticonnm)=>{
        return new Promise((resolve,reject)=>{
            db.collection("subcategory").find().toArray((err,data)=>{
                if(err)
                    reject(err)
                else
                {
                    var scDetails={}
                    if(data.length==0)
                        scDetails._id=1
                    else
                    {
                        max_id=data[0]._id
                        for(row of data)
                        {
                            if(max_id<row._id)
                                max_id=row._id
                        }
                        scDetails._id=max_id+1 
                    }    
                    var cstatus=0
                    if(data.length!=0)
                    {
                       for(row of data)
                       {
                           if(row.subcatnm==subcatnm)
                           {
                                  resolve(false)            
                                  cstatus=1
                           }
                       }        
                    }
                    
                    if(cstatus==0)
                    {
                    scDetails.catnm=catnm
                    scDetails.subcatnm=subcatnm
                    scDetails.subcaticonnm=subcaticonnm    
                    db.collection("subcategory").insert(scDetails,(err)=>{
                        if(err)
                            reject(err)
                        else    
                            resolve(true)   
                    })
                    }    

                }    
            })
            
        }) 
    }



}

module.exports=new adminModel()