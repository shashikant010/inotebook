const express=require('express');
const router=express.Router();
const User = require('../models/User');
const {body,validationResult}=require('express-validator');
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
JWT_SECRET="SKYISAGOOD$BOY"

router.post('/createuser',[
body('name','Enter a valid name').isLength({min:3}),
body('email','Enter a valid email').isEmail(),
body('password','Enter a valid password').isLength({min:5})
] ,async(req, res) => {
const errors=validationResult(req);
if(!errors.isEmpty()){
  return res.status(400).json({error:errors.array()})
}

try {
  


let user=await User.findOne({email:req.body.email})
if(user){
  return res.status(400).json({error:"email of the user is used already"})
}
let salt=await bcrypt.genSalt(10)
let secPass=await bcrypt.hash(req.body.password,salt)

user=await User.create({
  name:req.body.name,
  email:req.body.email,
  password:secPass
})

const data={
  user:{
    id:user.id
  }
}

const authToken=jwt.sign(data,JWT_SECRET)

// res.json(user)
res.json({authToken})

} catch (error) {
  console.error(error.message)
  res.status(500).send("some error occured")
}

//Earlier we were using this .then method but now shifted to async await
// .then(user=>{res.json(user)}).catch(err=>{console.log(err) 
//   res.json({error:"please enter unique vlaue",msg:err.message})}  )
})

//for authentication/login

router.post('/login',[
  body('email','Enter a valid email').isEmail(),
  body('password','Password cannot be blank').exists()
  ] ,async(req, res) => {
  const errors=validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({error:errors.array()})
  }
  const {email,password}=req.body
  try {
    let user=await User.findOne({email})
  if(!user){
    return res.status(400).json({error:"Please login with correct credentials"})
  }

  const passwordComp=await bcrypt.compare(password,user.password)
  if(!passwordComp){
    return res.status(400).json({error:"Please login with correct credentials"})
}
  
  const data={
    user:{
      id:user.id
    }
  }
  
  const authToken=jwt.sign(data,JWT_SECRET)
  
  res.json({authToken})
  
  } catch (error) {
    console.error(error.message)
    res.status(500).send("Internal server error occured ")
  }
})


  module.exports = router