const Task = require("../models/taskModel");

//Creating a Task route (Saving Data to DataBase)
const createTask = async (req, res) => {
  try {
    const {name, userId} = req.body;
    const task = await Task.create({
      name,
      userId
    });
    res.json(task);
  } catch (error) {
    console.log("Error While Saving");
    res.json({ msg: error.message });
  }
};

//Reading (GET) the data from DataBase
const getTasks = async (req, res) => {
  try {
    const {userId} = req.params;
    const tasks = await Task.find({userId});
    res.json(tasks);
  } catch (error) {
    res.json({ msg: error.message });
  }
};

//Get one Task

const getTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) {
      res.json(`No task with id: ${id}`);
    }
    res.json(task);
  } catch (error) {
    res.json(error.message);
  }
};

//Delete Task
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id).deleteOne();
    if (!task) {
      res.send(`No task with id: ${id}`);
    }
    res.send(`Task deleted!`);
  } catch (error) {
    res.json(error.message);
  }
};

//Update Task
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const {name} = req.body;
    const task = await Task.findByIdAndUpdate({ _id: id }, {name} , {
      new: true,
      runValidators: true,
    });
    if (!task) {
      res.json(`No task found with id: ${id}`);
    }
    res.json(task);
  } catch (error) {
    res.json({ msg: error.message });
  }
};

const completeTask = async (req, res)=>{
  try {
    const { id } = req.params;
    const {name, completed} = req.body;
    const task = await Task.findByIdAndUpdate({ _id: id }, {name, completed} , {
      new: true,
      runValidators: true,
    });
    if (!task) {
      res.json(`No task found with id: ${id}`);
    }
    res.json(task);
  } catch (error) {
    res.json({ msg: error.message });
  }
}

module.exports = {
  createTask,
  getTasks,
  getTask,
  deleteTask,
  updateTask,
  completeTask
};
