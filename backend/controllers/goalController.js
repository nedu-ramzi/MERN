import asyncHandler from "express-async-handler";
import Goal from "../models/goalModel.js";
import User from "../models/userModel.js";


// @desc  Get goals
//@route  Get /api/goals
//@access Private
const getGoals = asyncHandler(async (req, res) => {
    const goals = await Goal.find({user:req.user.id});
    
    res.status(200).json(goals);
}); 

// @desc  Set goals
//@route  Post /api/goals
//@access Private
const setGoal = asyncHandler(async (req, res) => {
    const {text} = req.body;
    if(!text){
        res.status(400);
        throw new Error("Please add a text field");
    }
    const goal = await Goal.create({
        text: text,
        user: req.user.id
    });
    res.status(201).json({message: "Goal created", goal});
}); 

// @desc  Update goals
//@route  Put /api/goals/:id
//@access Private
const updateGoal = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const goal = await Goal.findById(id);
    const text = req.body.text;

    if(!goal){
        res.status(400);
        throw new Error("Goal not found");
    }
    // Check for user
    const user = await User.findById(req.user.id);
    if(!user){
        res.status(401);
        throw new Error("User not found");
    } 
    // Make sure the logged in user matches the goal user
    if(goal.user.toString() !== user.id){
        res.status(401);
        throw new Error("User not authorized");
    }

    const updatedGoal = await Goal.findByIdAndUpdate(id, { text: text }, { returnDocument: 'after' });
    if (!updatedGoal) {
        res.status(404);
        throw new Error("Goal not found");
    }
    res.status(200).json(updatedGoal);
});     


// @desc  Delete goals
//@route  Delete /api/goals/:id
//@access Private
const deleteGoal = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const goal = await Goal.findById(id);

    if(!goal){  
        res.status(400);
        throw new Error("Goal not found");
    }

    // Check for user
    const user = await User.findById(req.user.id);
    if(!user){
        res.status(401);
        throw new Error("User not found");
    } 
    // Make sure the logged in user matches the goal user
    if(goal.user.toString() !== user.id){
        res.status(401);
        throw new Error("User not authorized");
    }

    await Goal.findByIdAndDelete(id);
    res.status(200).json({ message: "Deleted Goal!", id: id });
});




export { getGoals, setGoal, updateGoal, deleteGoal };