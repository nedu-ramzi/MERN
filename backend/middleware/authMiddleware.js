import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

export const protect = asyncHandler(async (req, res, next)=>{
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            //get token from header
            token = req.headers.authorization.split(' ')[1]; //split method converts to array so we pick the 1st index which is the token

            //verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            //get user from the token
            req.user = await User.findById(decoded.id).select('-password'); //finds the token with it's ID and minuseit hashed password

            next();
        } catch (error) {
            console.log("JWT error",error);
            res.status(401);
            throw new Error('Not Authorized');
        }
    }

    if(!token){
        res.status(401);
        throw new Error('Not authorized, No Token');
    }
});
