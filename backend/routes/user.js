const Router= require("express")
const bcrypt= require("bcryptjs")
const {createToken}= require("../utils/constant")
const { PrismaClient } =require('@prisma/client')
const authenticate= require("../middelwares/auth")

const prisma=new PrismaClient()

const router=Router();

router.post('/login',async (req,res)=>{
    try {
        const {email, password}=req.body
        if(!(email?.trim()) || !(password?.trim())){
            return res.status(400).json({message:"Invalid data sent.",success:false})
        }
        const user= await prisma.user.findUnique({
            where:{
                email:email.trim()
            }
        })
        if(!user){
            return res.status(401).json({message:"User doesn't exists.",success:false})
        }
        const CorrectPassword=await bcrypt.compare(password.trim(),user.password)
        if(!CorrectPassword ){
            return res.status(400).json({message:"Incorrect passowrd.",success:false})
        }
        const token=createToken({id:user.id,username:user.name})
        res.cookie('token',token)
        res.status(200).json({message:"Logged in.",success:true})
    } catch (error) {
        console.log("Error ",error.message)
        return res.status(500).json({message:"Internal error occured.",success:false})
    }
})

router.post('/signup',async(req,res)=>{
    try {
        const {name, email,password}=req.body
        if(!(email?.trim()) || !(password?.trim()) || !(name?.trim())){
            return res.status(400).json({message:"Invalid data sent.",success:false})
        }
    
        const user= await prisma.user.findUnique({
            where:{
                email: email.trim()
            }
        })
        if(user){
            return res.status(400).json({message:"User already exits.",success:false})
        }
        const newuser= await prisma.user.create({
            data:{
                email: email.trim(),
                password: await bcrypt.hash(password.trim(),10),
                name: name.trim()
            }
        })
        const token=createToken({id:newuser.id,username:user.name})
        res.cookie('token',token)
        res.status(200).json({message:"User created.",success:true})
    } catch (error) {
        console.log("Error ",error.message)
        return res.status(500).json({message:"Internal error occured.",success:false})
    }
})

router.get("/logout",(req,res)=>{
    res.clearCookie("token")
    console.log("cleared cookies")
    res.status(200).json({message:"Logged out.",success:true})
})

router.use(authenticate)

router.get('/find/:id',async(req,res)=>{
    try {
        const {id}= req.params.id
        const user= await prisma.user.findUnique({
            where:{
                id
            },
            select:{
                name:true,
                id:true,
                joined:true
            }
        })
        console.log(user)
        if(!user){
            return res.json({message:"Invalid userid",success:true})
        }
        return res.json({message:"User fetched.",success:true,user})
    } catch (error) {
        console.log("Internal Error. ",error.message)
        return res.status(500).json({message:"Internal error occured.",success:false})
    }
})



module.exports= router