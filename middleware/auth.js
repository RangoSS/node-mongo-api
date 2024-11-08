// middleware/auth.js
import jwt from 'jsonwebtoken';
import { permissions } from '../roles/roles.js';
import dotenv from "dotenv";

dotenv.config(); // initialize dotenv

// Middleware for authentication
// Middleware for authentication
export const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    console.log(req.headers);
    
    if (!token) {
        return res.status(403).json({ success: false, message: 'No token provided.' });
    }

    jwt.verify(token,process.env.jwt_secret, (err, user) => {
        if (err) {
            console.error("Token verification error:", err); // Log the error details
            return res.status(403).json({ success: false, message: 'Failed to authenticate token.' });
        }

        req.user = user; // Attach user details from the token to the request
        console.log("Authenticated user:", req.user); // Debugging line to check user details
        next();
    });
};

// Middleware for authorization
export const authorize = (action) => {
    return (req, res, next) => {
        const { role } = req.user;

        console.log(`Authorizing action '${action}' for role '${role}'`); // Debugging line
        console.log("Permissions for role:", permissions[role]); // Check permissions for debugging

        if (!permissions[role] || !permissions[role].includes(action)) {
            return res.status(403).json({
                success: false,
                message: "You do not have permission to perform this action."
            });
        }

        next();
    };
};
