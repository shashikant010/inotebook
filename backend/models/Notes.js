import mongoose from 'mongoose';
const { Schema } = mongoose;

const notesSchema = new Schema({
  title: {
    type:string,
    required:true,
  },

  description: {
    type:string,
    required:true,
    unique:true
  },
  tag: {
    type:string,
    default:'general'
  },

  date: { 
    type: Date, default: Date.now },
})

module.exports=mongoose.model('notes',notesSchema);