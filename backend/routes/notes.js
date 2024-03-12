const express=require('express');
const router=express.Router();


//route to get notes
router.get('/', (req, res) => {
    res.json('Hello notes');
  })

  module.exports=router