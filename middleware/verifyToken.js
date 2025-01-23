import cookieParser from "cookie-parser";
import jwt from 'jsonwebtoken';
import UserModel from '../models/user.js';

const isAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      // Respond with a clear message when token is missing
      return res.status(401).json({ message: "Authentication token is missing." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Ensure the environment variable is correct
    const user = await UserModel.findById(decoded.userId);

    if (!user) {
      // Respond when user is not found in the database
      return res.status(401).json({ message: "User not found. Please authenticate." });
    }

    if (user.role !== "admin") {
      // Respond when the user does not have admin privileges
      return res.status(403).json({ message: "Access denied. Admin privileges required." });
    }

    req.user = user; 
    app.use(cookieParser());
    // Attach user to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Error in isAdmin middleware:", error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};

export { isAdmin };
