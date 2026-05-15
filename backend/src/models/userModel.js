import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required:[true, 'Please Add a name'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Please Add an email'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Please Add a password'],
        select: false  // Important: prevent leaking in queries      
    },
    //Password reset token
    resetPasswordToken: {
        type: String, 
        select: false,
        index: true
    },
    resetPasswordExpires: {
        type: Date, 
        select: false
    },
    
},{timestamps: true});

//Auto-hash password before save
userSchema.pre("save", async function(){
    if(!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt); 
});


// export default mongoose.model("User", userSchema);
const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;