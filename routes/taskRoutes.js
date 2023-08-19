const express=require("express");
const { createTask, getTasks, getTask, deleteTask, updateTask, completeTask } = require("../controllers/taskController");
const router=express.Router();

router.post("/createTask", createTask );
router.get("/getTasks/:userId", getTasks );
router.get("/getTask/:id", getTask );
router.delete("/deleteTask/:id", deleteTask ); 
router.put("/updateTask/:id", updateTask );
router.put("/completeTask/:id", completeTask );

module.exports=router;