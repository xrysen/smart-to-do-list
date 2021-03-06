/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const dbHelper = require('../db/helpers/db_tasks');
const categorizeTask = require('../externalApis/categorizer');

module.exports = (db) => {
  router.get("/", (req, res) => {
    const userId = req.session.userId;
    dbHelper.getTasksByUserId(db, userId)
      .then(data => {
        const tasks = data.rows;
        res.json({ tasks });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.post("/", (req, res) => {
    const userId = req.session.userId;
    const task = req.body.text // important change tasks -> text
    categorizeTask(task)
      .then(data => {
        const categoryId = data;
        return dbHelper.createNewTask(db, task, userId, categoryId)
      })
      .then(data => {
        const newTask = data.rows[0];
        res.json(newTask);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  // deletes row in table tasks where id = :id
  router.get("/delete/:id", (req, res) => {
    return dbHelper.deleteTask(db, req.params.id)
    .then(() => {
      console.log("Deleted from database");
      res.redirect("/");
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
  });

  // Updates category_id for table tasks where the id is equal to :id
  router.get("/update/:id/:newCatId", (req, res) => {
    return dbHelper.updateTaskCategory(db, req.params.newCatId, req.params.id)
    .then((data) => {
      console.log("Category updated to:", req.params.newCatId);
      movedTask = data.rows[0];
      res.json(movedTask);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message })
    });
  });

  //Sets is_active to false and creates a timestamp when the task was completed
  router.post("/archive/:id", (req, res) => {
    return dbHelper.setTaskComplete(db, req.params.id)
    .then(() => {
      console.log("Task completed!");
      res.redirect("/");
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message })
    });
  });

  // Updates rating for the id passed in
  router.post("/ratings/:id/:rating", (req, res) => {
    return dbHelper.setTaskRating(db, req.params.rating, req.params.id)
    .then(() => {
      console.log("Setting rating");
      res.redirect("/");
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message })
    });
  });

  return router;
};
