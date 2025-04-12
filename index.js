const express = require("express")
const cors = require("cors")
const nodemailer = require("nodemailer")
const mongoose = require("mongoose")
const PORT = process.env.PORT || 5000 
const app = express()
app.use(express.json())
app.use(cors({ origin: "https://bulkmail-frontend-chi.vercel.app" }));

mongoose.connect("mongodb+srv://thenvanathi2003:1234@bulkmail.nr7vppb.mongodb.net/paaskey?retryWrites=true&w=majority&appName=BulkMail").then(function(){
    console.log("Connected To Database")
}).catch(function(err){
    console.error("Database Connection Failed:", err.message)
})


const credential = mongoose.model("credential", {}, "bulkmail")

app.post("/sendemail",function(req,res){
    var msg = req.body.msg
    var emailList = req.body.emailList

    credential.find().then(function(data){
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: data[0].toJSON().user,
              pass: data[0].toJSON().pass,
            },
          })
    
          new Promise(async function(resolve,reject){ 
            try{
                for(var i=0;i<emailList.length;i++){
                   await transporter.sendMail(
                        {
                            from: "thenvanathi2003@gmail.com",
                            to: emailList[i],
                            subject: "Sending Message From Bulkmail App",
                            text:msg,
                        },
                    
                       
                    )
                    console.log("Email Sent to :" + emailList[i])  
                }
                resolve("Success")
            }
            catch(error){
                reject("Failed")
            }
        }).then(function(){
            res.send(true)
        }).catch(function(){
            res.send(false)
        })
           
    }).catch(function(error){   
        console.log(error)
    })
    
        
})


app.listen(PORT, function(){
    console.log("Server Started.....................")
})