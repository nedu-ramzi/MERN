import jwt from "jsonwebtoken";
import User from "../Models/userModel.js";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import crypto from "crypto";
import { sendResetPasswordEmail } from "../utils/sendEmail.js"; 

// generate JWT payload
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN});
}


// @desc  Register a new user
//@route  POST /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if(!name || !email || !password){
        res.status(400);
        throw new Error("Please add all fields");
    }

    //check if user exists
    const userExists = await User.findOne({email});
    if(userExists){
        res.status(400);
        throw new Error("User already exists");
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create user
    const user = await User.create({
        name,
        email,
        password: hashedPassword
        });

    if(user){
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        });
    } else {
        res.status(400);
        throw new Error("Invalid user data");
    } 
    
});

// @desc  Authenticate a user
//@route  POST /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
   const { email, password } = req.body;    

   if (!email || !password) {
        res.status(400);
        throw new Error("Please provide email and password");
    }
   
   const user = await User.findOne({ email }).select("+password");

   if (!user) {
        res.status(401);
        throw new Error("Invalid email or password");
    }

    // check if user exists and password matches
    const comparePassword = await bcrypt.compare(password, user.password);
    if(!comparePassword){
        res.status(401);
        throw new Error("Invalid email or password");
    }

    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
    });
}) ; 


// @desc  Get user profile
//@route  GET /api/users/me
//@access private
const profile = async (req, res) => {
    //req.user is globally set in the authMiddleware after token verification
    const {_id, name, email} = await User.findById(req.user._id);
    res.status(200).json({
        id:  _id,
        name,
        email
    });
}


// @desc  Send password reset link in mail
//@route  Post '/api/auth/password-reset'
//@access public
const sendResetPassword = asyncHandler(async (req, res) => {
    try{
        const { email } = req.body;

        if(!email){
            res.status(400);
            throw new Error("Please provide an email");
        }
       // We don't reveal if user exists - better security
        const user = await User.findOne({ email });

        if (!user) {
        return res.status(200).json({
        message: "If the email exists, you will receive a password reset link.",
        });
        }
        // Generate secure random token
        const resetToken = crypto.randomBytes(32).toString('hex');

        //store hashed token and expiration in DB
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; //1 hour
        await user.save();

        //send email with token
        await sendResetPasswordEmail(user, resetToken);   
        res.status(200).json({ message: "Password reset email sent" });
        
    } catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({ message: "Something went wrong. Try again later." });
    }
});

// @desc  Reset Passord
//@route  Post '/api/auth/resetpassoword'
//@access private
const resetPassword = asyncHandler(async (req, res) => {
    
        const { resetToken } = req.params;
        const { password, confirmPassword } = req.body;

        if(!password || !confirmPassword) {
            res.status(400);
            throw new Error("Please provide password and confirm password");
        }

        if(password !== confirmPassword){
            res.status(400);
            throw new Error("Passwords do not match");
        }

        if (password.length < 8) {
            res.status(400);
            throw new Error("Password must be at least 8 characters long");
        }

        // Hash incoming token to match stored value
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        // Find user by token and check if token is not expired
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        }).select("+resetPasswordToken +resetPasswordExpires +password");

        if(!user){
            res.status(400);
            throw new Error("Invalid or expired token");
        }

        
        // Update password - pre-save hook will hash it
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json({ message: "Password reset successful, you can now login with your new password" });

});


export { registerUser, loginUser, profile , sendResetPassword, resetPassword};