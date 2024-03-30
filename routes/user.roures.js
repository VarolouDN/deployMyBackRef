const Router=require("express")
const User=require("../models/User")
const mongoose = require("mongoose");
const Article = require("../models/Article");
const router=new Router()

router.get("/users",
    async(req,res)=>{
        try{
            const users=await User.find()

            return res.set("Access-Control-Allow-Origin",'https://myproject-front.vercel.app' ).
            json(users)
        }catch(e){
            res.send({message:"Server error"})
        }
    })
router.get("/users/:id",
    async(req,res)=>{
        try {

            const userId = req.params.id
            console.log( req.params.id)
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return   res.status(400).json({
                    message: 'given object id is not valid'
                })
            } else {


                const user = await User.findById(userId)
                if(!user){
                    return   res.status(404).json({message:"User with this id doesn't exist"})
                }

                return res.set("Access-Control-Allow-Origin", 'https://myproject-front.vercel.app').send(user)
            }
        }catch(e){
            res.send({message:"Server error"})
        }
    })

module.exports=router