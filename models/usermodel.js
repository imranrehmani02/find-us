const db=require('./connection')

function userModel()
{
    this.fetchsubcat=(catnm)=>{
        return new Promise((resolve,reject)=>{
            db.collection("subcategory").find({'catnm':catnm}).toArray((err,data)=>{
                if(err)
                    reject(err)
                else
                    resolve(data)    
            })    
        })    
    }

    this.cpassuser=(email,cpassDetails)=>{
        return new Promise((resolve,reject)=>{
            db.collection("register").find({'email':email,'password':cpassDetails.oldpass}).toArray((err,data)=>{
                if(err)
                    reject(err)
                else
                {
                    if(data.length==0)
                        resolve({'msg':'Old password does not match'})
                    else
                    {
                        if(cpassDetails.newpass==cpassDetails.cnewpass)
                        {
                            resolve({'msg':'done'})    
                        }
                        else
                            resolve({'msg':'New & Confirm new password does not match'})
                    }        
                }    
            })    
        })
    }

    this.managelocations=()=>{
        return new Promise((resolve,reject)=>{
            db.collection("locations").find().toArray((err,data)=>{
                if(err)
                    reject(err)
                else
                    resolve(data)    
            })    
        })
    }

    this.fetchlocality=(c)=>{
        return new Promise((resolve,reject)=>{
            db.collection("locality").find({'cityname':c}).toArray((err,data)=>{
                if(err)
                    reject(err)
                else
                    resolve(data)    
            })    
        })    
    }

    this.addlocation=(locationDetails)=>{
        return new Promise((resolve,reject)=>{
            db.collection("locations").find().toArray((err,data)=>{
                if(err)
                    reject(err)
                else
                {
                    if(data.length==0)
                        locationDetails._id=1
                    else
                    {
                        max_id=data[0]._id
                        for(row of data)
                        {
                            if(max_id<row._id)
                                max_id=row._id
                        }
                        locationDetails._id=max_id+1 
                    }    
                    db.collection("locations").insert(locationDetails,(err)=>{
                        if(err)
                            reject(err)
                        else    
                            resolve(true)   
                    })
                }    
            })
            
        })
    }

    this.payment=(urlData)=>{
        return new Promise((resolve,reject)=>{
            db.collection("payment").find().toArray((err,data)=>{
                if(err)
                    reject(err)
                else
                {
                    if(data.length==0)
                        urlData._id=1
                    else
                    {
                        max_id=data[0]._id
                        for(row of data)
                        {
                            if(max_id<row._id)
                                max_id=row._id
                        }
                        urlData._id=max_id+1 
                        urlData.info=Date()
                    }    
                    db.collection("payment").insert(urlData,(err)=>{
                        if(err)
                            reject(err)
                        else
                        {
                            db.collection("locations").update({'_id':parseInt(urlData.locationid)},{$set:{'status':1}},(err)=>{
                                if(err)
                                    reject(err)
                                else
                                    resolve(true)    
                            })      
                        }
                    })
                }    
            })
            
        })
    }

}

module.exports=new userModel()