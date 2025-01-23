import UserModel from "../models/user.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        const existUser = await UserModel.findOne({ email });    
        if (existUser) {
            return res.status(401).json({ success:false,message: "User already exist" });
        }
        const hasepassword = await bcryptjs.hash(password, 10);
        const newUser = new UserModel({
            name,
            email,
            password: hasepassword
        });
        await newUser.save();

        res.status(200).json({Message:"users register successfully",newUser});
    } catch (error) {
        res.status(500).json({success:false, message: "Something went wrong"
    })
    console.log(error);
    }

}


const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(401).json({ success:false,message: "User not found" });
        }

        const ispasswordValid = await bcryptjs.compare(password, user.password);
        if (!ispasswordValid) {
            return res.status(404).json({ success:false,message: "Invalid credentials" });
        }
        const token = jwt.sign({userId:user._id}, process.env.JWT_SECRETE)

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            maxAge: 3600000
        });
        res.status(200).json({ success:true, message: "User login successfully", user,token });

    } catch (error) {
        res.status(500).json({success:false, message: "Something went wrong"    })      
        console.log(error);
    }   
}
   const logout = async (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).json({ success:true, message: "User logout successfully" });
    } catch (error) {
        res.status(500).json({success:false, message: "Something went wrong"    })      
        console.log(error);
    }     
}



export { register, login , logout};