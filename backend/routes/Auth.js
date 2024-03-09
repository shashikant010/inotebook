const express=require('express');
const router=express.Router();
const User = require('../models/User');
const {body,validationResult}=require('express-validator');

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


user=await User.create({
  name:req.body.name,
  email:req.body.email,
  password:req.body.password
})

res.json(user)

} catch (error) {
  console.error(error.message)
  res.status(500).send("some error occured")
}

//Earlier we were using this .then method but now shifted to async await
// .then(user=>{res.json(user)}).catch(err=>{console.log(err) 
//   res.json({error:"please enter unique vlaue",msg:err.message})}  )

  })

  module.exports = router