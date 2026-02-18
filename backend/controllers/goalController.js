import asyncHandler from "express-async-handler";


// @desc  Get goals
//@route  Get /api/goals
//@access Private
const getGoals = asyncHandler(async (req, res) => {
    res.status(200).json({ message: "Welcome to the Goal API!" });
}); 

// @desc  Set goals
//@route  Post /api/goals
//@access Private
const setGoal = asyncHandler(async (req, res) => {
    res.status(200).json({ message: "Set Goal!" });
}); 

// @desc  Update goals
//@route  Put /api/goals/:id
//@access Private
const updateGoal = asyncHandler(async (req, res) => {
    res.status(200).json({ message: "Updated Goal!" });
});     


// @desc  Delete goals
//@route  Delete /api/goals/:id
//@access Private
const deleteGoal = asyncHandler(async (req, res) => {
    res.status(200).json({ message: "Deleted Goal !" });
});




export { getGoals, setGoal, updateGoal, deleteGoal };