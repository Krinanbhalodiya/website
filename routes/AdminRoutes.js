import express from 'express';
import { deletUser, Getuser } from '../controllers/Admin.js';
import { isAdmin } from '../middleware/verifyToken.js';


const AdminRoutes = express.Router();
AdminRoutes.get('/getuser',isAdmin,Getuser)
AdminRoutes.post('/delet/:id',isAdmin,Getuser,deletUser)

export default AdminRoutes;