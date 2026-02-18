import { Router } from "express";
import {getGoals, setGoal, updateGoal, deleteGoal} from '../controllers/goalController.js';

const router = Router();

router.route('/').get(getGoals).post(setGoal);
router.route('/:id').put(updateGoal).delete(deleteGoal);

// router.get('/', getGoals);

// router.post('/', setGoal);

// router.put('/:id', updateGoal);

// router.delete('/:id', deleteGoal);

export default router;