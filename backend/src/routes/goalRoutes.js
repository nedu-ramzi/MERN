import { Router } from "express";
import {getGoals, setGoal, updateGoal, deleteGoal} from '../controllers/goalController.js';
import {protect} from "../middleware/authMiddleware.js";    

const router = Router();

router.route('/').get(protect, getGoals).post(protect, setGoal);
router.route('/:id').put(protect, updateGoal).delete(protect, deleteGoal);

// router.get('/', getGoals);

// router.post('/', setGoal);

// router.put('/:id', updateGoal);

// router.delete('/:id', deleteGoal);

export default router;