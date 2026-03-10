import { Router } from "express";
import {protect} from "../middleware/authMiddleware.js";


import { registerUser, loginUser, profile, sendResetPassword, resetPassword} from "../controllers/authUserController.js";

const router = Router();

router.post('/register', registerUser); 
router.post('/login', loginUser);
router.get('/profile', protect, profile);

// Password reset – both public (NO protect middleware!)
router.post('/password-reset', sendResetPassword);
router.post('/reset-password/:resetToken', resetPassword);


export default router;