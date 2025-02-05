import mongoose from "mongoose";

const userSechmea= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique: true
    },
    role:{
        type:String,
        enum:['admin',"user"],
        default:"user"
    },
    password:{
        type:String,
        required:true
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date 
}
},{timestamps:true})


const UserModel= mongoose.model('users',userSechmea)


export default UserModel