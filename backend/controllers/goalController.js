import asyncHandler from "express-async-handler";
import Goal from "../Models/goalModel.js"; 


// @desc  Get goals
//@route  Get /api/goals
//@access Private
const getGoals = asyncHandler(async (req, res) => {
    const goals = await Goal.find();
    
    res.status(200).json(goals);
}); 

// @desc  Set goals
//@route  Post /api/goals
//@access Private
const setGoal = asyncHandler(async (req, res) => {
    const text = req.body.text;
    if(!text){
        res.status(400);
        throw new Error("Please add a text field");
    }
    const goal = await Goal.create({
        text: text 
    });
    res.status(200).json(goal);
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
    const updatedGoal = await Goal.findByIdAndUpdate(id, { text: text }, { new: true });
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
    await Goal.findByIdAndDelete(id);
    res.status(200).json({ message: "Deleted Goal!", id: id });
});




export { getGoals, setGoal, updateGoal, deleteGoal };