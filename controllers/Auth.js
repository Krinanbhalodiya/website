import UserModel from "../models/user.js";
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();


const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existUser = await UserModel.findOne({ email });
        if (existUser) {
            return res.status(401).json({ success: false, message: "User already Exist" });
        }
        const hasepassword = await bcryptjs.hashSync(password, 10);
        const newUser = new UserModel({
            name, email, password: hasepassword
        });

        await newUser.save();

        res.status(200).json({ message: "user register successfully", newUser });
    } catch (error) {
        res.status(500).json({ success: false, message: "internal server error" });
        console.log(error);
    }
};

const Login=async(req,res)=>{
    try {
          const {email,password}=req.body

          const user=await UserModel.findOne({email})

          if (!user) {
              return res.status(404).json({success:false,message:"Invalid credentials"})
          }

          const ispassaowrdValid= await bcryptjs.compare(password,user.password)
          if (!ispassaowrdValid) {
            return res.status(404).json({success:false,message:"Invalid credentials"})
            
          }
               const token= jwt.sign({userId:user._id},process.env.JWT_SECRETE)

                res.cookie('token',token,{
                    httpOnly: true,
                    secure: false,
                    maxAge: 3600000,
                    
                })
              res.status(200).json({success:true,message:"Login successfully",user,token})

    } catch (error) {
        res.status(500).json({success:false,message:"interanl server ereo"})
        console.log(error)
    }
}
  const Logout=async(req,res)=>{
    try {
        res.clearCookie('token')
        res.status(200).json({message:"user Logout successfully"})
    } catch (error) {
        res.status(500).json({success:false,message:"interanl server ereo"})
        console.log(error)
    }
  }
     const CheckUser=async(req,res)=>{
            try {
                const user=req.user
                if (!user) {
                    res.status(404).json({message:'User not found'})
                }
                res.status(200).json(user)

                
            } catch (error) {
                res.status(500).json({message:"internal server error"})
                console.log(error)
                
            }
     }
     

    
    // true
    //  const forgotPassword = async (req, res) => {
    //     try {
    //         const { email } = req.body;
    //         const user = await UserModel.findOne({ email });
    
    //         if (!user) {
    //             return res.status(404).json({ success: false, message: "User not found" });
    //         }
    
    //         const resetToken = crypto.randomBytes(32).toString('hex');
    //         user.resetPasswordToken = resetToken;
    //         user.resetPasswordExpires = Date.now() + 3600000;
    
    //         await user.save();
    //         console.log("Updated User:", await UserModel.findOne({ email })); // Debugging log
    
    //         res.status(200).json({ success: true, message: "Reset token generated" });
    
    //     } catch (error) {
    //         console.log("Error:", error);
    //         res.status(500).json({ success: false, message: "Internal server error" });
    //     }
    // };
   // true 
    // const resetPassword = async (req, res) => {
    //     try {
    //         const { token, newPassword } = req.body;  // 🔹 Accept token from request body
    
    //         const user = await UserModel.findOne({
    //             resetPasswordToken: token,
    //             resetPasswordExpires: { $gt: Date.now() },  // 🔹 Ensure token is not expired
    //         });
    
    //         if (!user) {
    //             return res.status(400).json({ success: false, message: "Invalid or expired token" });
    //         }
    
    //         user.password = await bcryptjs.hash(newPassword, 10);
    //         user.resetPasswordToken = undefined;
    //         user.resetPasswordExpires = undefined;
    //         await user.save();
    
    //         res.status(200).json({ success: true, message: "Password reset successfully" });
    //     } catch (error) {
    //         console.log(error);
    //         res.status(500).json({ success: false, message: "Internal server error" });
    //     }
    // };
    
    // const resetPassword = async (req, res) => {
    //     try {
    //         const { token } = req.params;
    //         const { newPassword } = req.body;
    
    //         const user = await UserModel.findOne({
    //             resetPasswordToken: token,
    //             resetPasswordExpires: { $gt: Date.now() },
    //         });
    
    //         if (!user) {
    //             return res.status(400).json({ success: false, message: "Invalid or expired token" });
    //         }
    
    //         user.password = await bcryptjs.hash(newPassword, 10);
    //         user.resetPasswordToken = undefined;
    //         user.resetPasswordExpires = undefined;
    //         await user.save();
    
    //         res.status(200).json({ success: true, message: "Password reset successfully" });
    //     } catch (error) {
    //         console.log(error);
    //         res.status(500).json({ success: false, message: "Internal server error" });
    //     }
    // };
    

    // const forgotPassword = async (req, res) => {
    //     try {
    //         const { email } = req.body;
    //         const user = await UserModel.findOne({ email });
    //         if (!user) {
    //             return res.status(404).json({ success: false, message: "User not found" });
    //         }
    //         const otp = Math.floor(100000 + Math.random() * 900000).toString();
    //         user.resetPasswordOTP = otp;
    //         user.resetPasswordExpires = Date.now() + 300000; // OTP expires in 5 minutes
    //         await user.save();
    
    //         console.log(`OTP generated for: ${email} -> ${otp}`);
    
    //         const mailOptions = {
    //             from: "hello@demomailtrap.com",
    //             to: email,
    //             subject: "Password Reset OTP",
    //             text: `Your OTP for password reset is: ${otp}. It is valid for 5 minutes.`,
    //         };
    
    //         transport.sendMail(mailOptions, (error, info) => {
    //             if (error) {
    //                 console.error("Email sending error:", error);
    //                 return res.status(500).json({ success: false, message: "Failed to send email", error });
    //             }
    //             console.log(`OTP email sent to: ${email}`);
    //             console.log(`Email Response: ${info.response}`);
    //             res.status(200).json({ success: true, message: "OTP sent to email", email });
    //         });
    
    //     } catch (error) {
    //         console.log("Error:", error);
    //         res.status(500).json({ success: false, message: "Internal server error" });
    //     }
    // };
    
    // const resetPassword = async (req, res) => {
    //     try {
    //         const { email, otp, newPassword } = req.body;
    //         const user = await UserModel.findOne({
    //             email,
    //             resetPasswordOTP: otp,
    //             resetPasswordExpires: { $gt: Date.now() },
    //         });
    //         if (!user) {
    //             return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    //         }
    //         user.password = await bcryptjs.hash(newPassword, 10);
    //         user.resetPasswordOTP = undefined;
    //         user.resetPasswordExpires = undefined;
    //         await user.save();
    //         res.status(200).json({ success: true, message: "Password reset successfully" });
    //     } catch (error) {
    //         console.log(error);
    //         res.status(500).json({ success: false, message: "Internal server error" });
    //     }
    // };
    

    console.log('Email User:', process.env.EMAIL_USER);
    console.log('Email Pass:', process.env.EMAIL_PASS);
    

    
    


    const forgotPassword = async (req, res) => {
        try {
            const { email } = req.body;
            const user = await UserModel.findOne({ email });
    
            if (!user) {
                return res.status(404).json({ success: false, message: "User not found" });
            }
    
            // Generate 6-digit OTP
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            user.resetPasswordToken = otp;
            user.resetPasswordExpires = Date.now() + 300000; // OTP expires in 5 minutes
            await user.save();
    
            console.log(`OTP generated for ${email}: ${otp}`);
    
            // Configure email transport
            

           

            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
                secure: process.env.SMTP_SECURE === "true", // false for TLS
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });
            
            
        
    
            // transporter.sendMail(mailOptions, (error) => {
            //     if (error) {
            //         console.error("Email sending error:", error);
            //         return res.status(500).json({ success: false, message: "Failed to send OTP email", error });
            //     }
            //     console.log(`OTP sent to ${email}`);
            //     res.status(200).json({ success: true, message: "OTP sent to your email." });
            // });
    
        } catch (error) {
            console.log("Error:", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    };
    
    const resetPassword = async (req, res) => {
        try {
            const { email, otp, newPassword } = req.body;
    
            const user = await UserModel.findOne({
                email,
                resetPasswordOTP: otp,
                resetPasswordExpires: { $gt: Date.now() }, // Ensure OTP is not expired
            });
    
            if (!user) {
                return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
            }
    
            // Hash and update the new password
            user.password = await bcryptjs.hash(newPassword, 10);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();
    
            res.status(200).json({ success: true, message: "Password reset successfully" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    };
    


    // const forgotPassword = async (req, res) => {
    //     try {
    //         const { email } = req.body;
    //         const user = await UserModel.findOne({ email });
    //         if (!user) {
    //             return res.status(404).json({ success: false, message: "User not found" });
    //         }
    //         const otp = Math.floor(100000 + Math.random() * 900000).toString();
    //         user.resetPasswordOTP = otp;
    //         user.resetPasswordExpires = Date.now() + 300000; // OTP expires in 5 minutes
    //         await user.save();
    //         console.log(`OTP generated for: ${email} -> ${otp}`);
    //         const sender = {
    //           address: "hello@demomailtrap.com",
    //           name: "Mailtrap Test",
    //         };
    //         const recipients = [email];
    //         const mailOptions = {
    //           from: sender,
    //           to: recipients,
    //           subject: "Password Reset OTP",
    //           text: `Your OTP for password reset is: ${otp}. It is valid for 5 minutes.`,
    //         };
    //         transport.sendMail(mailOptions, (error, info) => {
    //             if (error) {
    //                 console.error("Email sending error:", error);
    //                 return res.status(500).json({ success: false, message: "Failed to send email", error });
    //             }
    //             console.log(`OTP email sent to: ${email}`);
    //             console.log(`Email Response: ${info.response}`);
    //             res.status(200).json({ success: true, message: "OTP sent to email", email });
    //         });
    //     } catch (error) {
    //         console.log("Error:", error);
    //         res.status(500).json({ success: false, message: "Internal server error" });
    //     }
    // };
    
    // const resetPassword = async (req, res) => {
    //     try {
    //         const { email, otp, newPassword } = req.body;
    //         const user = await UserModel.findOne({
    //             email,
    //             resetPasswordOTP: otp,
    //             resetPasswordExpires: { $gt: Date.now() },
    //         });
    //         if (!user) {
    //             return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    //         }
    //         user.password = await bcryptjs.hash(newPassword, 10);
    //         user.resetPasswordOTP = undefined;
    //         user.resetPasswordExpires = undefined;
    //         await user.save();
    //         res.status(200).json({ success: true, message: "Password reset successfully" });
    //     } catch (error) {
    //         console.log(error);
    //         res.status(500).json({ success: false, message: "Internal server error" });
    //     }
    // };





export {register,Login,Logout,CheckUser,forgotPassword,resetPassword}
