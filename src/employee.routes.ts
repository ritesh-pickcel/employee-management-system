import * as express from "express";
import * as mongodb from "mongodb";

import { collections } from "./database";

export const empRouter = express.Router();

empRouter.use(express.json());

// Get list of employees
empRouter.get("/", async (_req,res)=>{
    try{
        const employess = await collections.employees.find({}).toArray();
        res.status(200).send(employess);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Get single employee data by id
empRouter.get('/:id',async (req, res) => {
    try {
        const id = req?.params?.id;
        const employee = await collections.employees.findOne({"_id": new mongodb.ObjectId(id)});
        
        if(employee){
            res.status(200).send(employee);
        } else {
            res.status(404).send(`Failed to find an employee with ID ${id}`)
        }
    } catch (error) {
        res.status(404).send(`Failed to find an employee with ID ${req?.params?.id}`)
    }
});

// Post / Save employee to DB
empRouter.post("/",async (req,res) => {
    try{
        const data = req.body;
        const result = await collections.employees.insertOne(data);

        if(result.acknowledged){
            res.status(201).send(`Created a ne employee : ID ${result.insertedId}`);
        } else {
            res.status(500).send("Faild to create a new employee");
        }
    } catch(error){
        console.error(error.message);
        res.status(400).send(error.message);
    }
});

// Update employee data by id
empRouter.put("/:id",async (req,res) => {
    try {
        const id = req?.params?.id;
        const data = req.body;

        const result = await collections.employees.updateOne({ "_id": new mongodb.ObjectId(id) }, { $set: data });

        if(result && result.matchedCount){
            res.status(200).send(`Updated an Employee with ID ${id}`)
        } else if (!result.matchedCount){
            res.status(404).send(`Failed to find an employee with ID ${id}`);
        } else {
            res.status(304).send(`Failed to Update an employee with ID ${id}`);
        }
    } catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }    
})

// Delete Employee Data by Id
empRouter.delete('/:id',async (req,res) => {
    try {
        const id = req?.params?.id;

        const result = await collections.employees.deleteOne({"_id": new mongodb.ObjectId(id)});
        
        if(result && result.deletedCount){
            res.status(200).send(`Removed an Employee with ID ${id}`)
        } else if (!result.deletedCount){
            res.status(404).send(`Failed to find an employee with ID ${id}`);
        } else {
            res.status(400).send(`Failed to remove an employee with ID ${id}`);
        }

    } catch (error) {
        console.error(error.message);
        res.status(400).send(error.message);
    }
})