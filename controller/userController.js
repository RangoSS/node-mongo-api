import mongoose from 'mongoose';
import { Todo, User, Recipe } from "../models/todo_models.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { roles } from "../roles/roles.js";
import dotenv from "dotenv";

dotenv.config(); // initialize dotenv


// User login
// User authentication (Login)
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        console.log("User found:", user);

        if (!user) {
            return res.status(404).send({ success: false, message: 'User not found' });
        }

        // Compare the entered password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).send({ success: false, message: 'Invalid password' });
        }

        // If the password matches, create a JWT token
        const token = jwt.sign({ id: user._id, role: user.role },process.env.jwt_secret, { expiresIn: '1h' });

        // Prepare the response
        const response = {
            success: true,
            message: 'Login successful',
            token,
            user: { 
                name: user.name, 
                email: user.email, 
                role: user.role 
             }
        };

        // Log the response that will be sent to the client
        console.log("Response sent to client:", response);

        // Send the response
        res.send(response);
        
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: 'Server error' });
    }
};


// Endpoint to get the todo list
export const getTodo = async (req, res) => {
    try {
        const result = await Todo.find();
        res.send({
            success: true,
            message: "Todo List Retrieved Successfully",
            data: result
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Unable to retrieve Todo list data",
            error: error.message
        });
    }
};

// Endpoint to create a todo
export const createTodo = async (req, res) => {
    const todoDetails = req.body;
    try {
        const result = await Todo.create(todoDetails);
        res.send({
            success: true,
            message: "Todo is created successfully",
            data: result
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Todo creation unsuccessful",
            error: error.message
        });
    }
};

// Endpoint for creating a user (without photo upload)
export const postUser = async (req, res) => {
    const { name, surname, idNumber, email, password, role } = req.body;

    if (!Object.values(roles).includes(role)) {
        return res.status(400).send({ success: false, message: "Invalid role assigned to the user." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const userDetails = { name, surname, idNumber, email, password: hashedPassword, role };

        const result = await User.create(userDetails);
        res.send({ success: true, message: "User created successfully", data: result });
    } catch (error) {
        console.error(error);
        res.status(400).send({ success: false, message: "User creation failed", error: error.message });
    }
};
 
//create recipes 
export const postRecipe = async (req, res) => {
    try {
        // Destructure the incoming data
        const { name, ingredients, instructions, category, preparationTime, cookingTime, servings, createdBy } = req.body;

        // Check if the required fields are present
        if (!name || !ingredients || !instructions || !category || !preparationTime || !cookingTime || !servings || !createdBy ) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Create a new recipe
        const newRecipe = new Recipe({
            name,
            ingredients,
            instructions,
            category,
            preparationTime,
            cookingTime,
            servings,
            createdBy
        
        });

        // Save the recipe to the database
        await newRecipe.save();

        // Return a success response
        return res.status(201).json({ message: "Recipe created successfully", recipe: newRecipe });

    } catch (error) {
        // Handle errors (e.g., database issues)
        console.error(error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Endpoint to get user data
export const getUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId).lean();

        if (!user) {
            return res.status(404).send({ success: false, message: "User not found" });
        }

        res.send({
            success: true,
            message: "User data retrieved successfully",
            data: user
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Server error", error: error.message });
    }
};

// Endpoint to update user data
export const updateUser = async (req, res) => {
    const { userId } = req.params;
    const { name, surname, idNumber, email, password, role } = req.body;

    try {
        // Find user and update
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ success: false, message: "User not found" });
        }

        // Optionally update password if provided
        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        // Update other fields
        user.name = name || user.name;
        user.surname = surname || user.surname;
        user.idNumber = idNumber || user.idNumber;
        user.email = email || user.email;
        user.role = role || user.role;

        await user.save();
        res.send({
            success: true,
            message: "User updated successfully",
            data: user
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "User update failed",
            error: error.message
        });
    }
};

// Endpoint to delete a user
export const deleteUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const result = await User.findByIdAndDelete(userId);
        if (!result) {
            return res.status(404).send({ success: false, message: "User not found" });
        }
        res.send({
            success: true,
            message: "User deleted successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "User deletion failed",
            error: error.message
        });
    }
};
