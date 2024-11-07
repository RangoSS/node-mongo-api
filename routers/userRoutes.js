import express from 'express';
// routers/userRoutes.js
import { authenticateJWT, authorize } from "../middleware/auth.js";



import { 
    postUser, 
    createTodo, 
    getTodo,
    postRecipe,
    loginUser,
    getUser
} from '../controller/userController.js'; // Importing from your controller

const router = express.Router();

// POST endpoint to add an employee
router.post('/todo', createTodo);

router.post('/login', loginUser); // Login user

router.post('/recipe',authenticateJWT,authorize('create_recipes'), postRecipe);

router.post('/user-info', postUser);

// GET endpoint to retrieve all employees
router.get('/todo', getTodo);
router.get('/user-info', getUser);

// GET endpoint to retrieve all employees
//router.get('/user-info', getUser);



export default router; // Correctly export the router
