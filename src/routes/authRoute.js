import express from "express";
import Admin from '../models/adminModel.js';
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'
import cookiegen from "../utils/auth/cookieGen.js";
const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const { identifier, password } = req.body;

        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        
        if (regex.test(identifier)) {
            const user = await Admin.findOne({ email:identifier });
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "Email Not Found"
                })

            }
            else {

                const isMatch = await bcrypt.compare(password, user.password);
                
                if (!isMatch) {
                    return res.status(401).json({
                        success: false,
                        message: 'Invalid Password'
                    })
                }
                    console.log(req.hostname);
                    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
                    const data = {name:user.name, role:user.role };
                    return (res.status(200).cookie("token",token,cookiegen(req)).json({
                        success: true,
                        message: 'Login Successfull',
                        data: data 
                    }))
                    
            }
        }
        else if (identifier!=="") {
            const user = await Admin.findOne({ username:identifier });
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid username'
                })
            }
            else {
                const isMatch = await bcrypt.compare(password, user.password);
                // let isMatch = true
                
                if (!isMatch) {
                    return res.status(401).json({
                        success: false,
                        message: 'Invalid Password'
                    })
                }

                const token = jwt.sign({
                    id: user._id,
                    role: user.role
                },
                    process.env.JWT_SECRET,
                    {
                        expiresIn: process.env.JWT_EXPIRES_IN
                    }
                )

                const data = {name:user.name, role:user.role };

                
                return cookiegen(res,data);
            }
        }
        else{
            return res.status(400).json({
                success:false,
                message:"data is missing"
            })
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});


// Logout route
router.post("/logout", async (req, res) => {
    try {
      // clear auth cookie
      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
  
      return res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Logout failed",
        error: error.message,
      });
    }
  });

router.post("/me", (req, res) => {
    try {
      const token = req.cookies.token;
      if (!token) {
        return res.status(401).json({ message: "No token" });
      }
  
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      res.json({ success: true, user: decoded });
    } catch (err) {
      res.status(401).json({ success: false, message: "Invalid token" });
    }
  });




export default router;