import UserModel from '../models/user.js';
import jwt from 'jsonwebtoken';

const Getuser = async (req, res) => {
    try {
        // Check if the request is authorized
        const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ Message: "Unauthorized" });
        }

        // Verify the token
        jwt.verify(token, process.env.JWT_SECRETE, (err, decoded) => {
            if (err) {
                return res.status(401).json({ Message: "Unauthorized" });
            }
        });

        const user = await UserModel.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ Message: "Internal server error" });
        console.log(error);
    }
};

const deletUser=async(req,res)=>{
    try{
        const userId=req.params.id
            const checkAdmin=await UserModel.findById(userId);
        if(checkAdmin.role==="admin"){
            return res.status(409).json({message:"you can not delete yourself"});
        }
        const user=await UserModel.findByIdAndDelete(userId);
        if(!user) {
            return res.status(404).json({Message:"user not found"});
        }
        res.status(200).json({Message:"user deleted"});
    }
    catch(error){
        res.status(400).json({Message:"internal server error"});
        console.log(error)
       
    }
}
export {Getuser, deletUser}