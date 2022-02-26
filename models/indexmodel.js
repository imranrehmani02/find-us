const db=require('./connection')
const { collection } = require('./connection')

function indexModel()
{
     this.register=(userDetails)=>{
        return new Promise((resolve,reject)=>{
            db.collection("register").find().toArray((err,data)=>{
                if(err)
                    reject(err)
                else
                {
                    if(data.length==0)
                        userDetails._id=1
                    else
                    {
                        max_id=data[0]._id
                        for(row of data)
                        {
                            if(max_id<row._id)
                                max_id=row._id
                        }
                        userDetails._id=max_id+1 
                    }    
                    userDetails.status=0
                    userDetails.role="user"
                    userDetails.info=Date()
                    var userstatus=0
                    if(data.length!=0)
                    {
                       for(row of data)
                       {
                           if(row.email==userDetails.email)
                           {
                                  resolve({'msg':'Registration failed user already exists'})            
                                  userstatus=1
                           }
                       }        
                    }
                    
                    if(userstatus==0)
                    {
                    db.collection("register").insert(userDetails,(err)=>{
                        if(err)
                            reject(err)
                        else    
                            resolve({'msg':'Record inserted successfully'})   
                    })
                    }    

                }    
            })
            
        }) 
    }

    this.verifyuser=(emailid)=>{
        return new Promise((resolve,reject)=>{
            db.collection("register").update({'email':emailid},{$set:{'status':1}},(err)=>{
                if(err)
                    reject(err)
                else
                    resolve(true)    
            })
        })
    }

    this.login=(userDetails)=>{
        return new Promise((resolve,reject)=>{
            db.collection("register").find({'email':userDetails.email,'password':userDetails.password,'status':1}).toArray((err,data)=>{
                if(err)
                    reject(err)
                else
                    resolve(data)    
            })    
        })    
    }

    this.fetchAll=(collection_name)=>{
        return new Promise((resolve,reject)=>{
            db.collection(collection_name).find().toArray((err,data)=>{
                if(err)
                    reject(err)
                else
                    resolve(data)    
            })    
        })    
    }

    
    this.fetchSubCategory=(catnm)=>{
        return new Promise((resolve,reject)=>{
            db.collection("subcategory").find({'catnm':catnm}).toArray((err,data)=>{
                if(err)
                    reject(err)
                else
                    resolve(data)    
            })    
        })    
    }


}

module.exports=new indexModel()