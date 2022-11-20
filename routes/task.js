const express = require('express');
const router = express.Router();
const Task = require('../model/task');

const { verifyToken } = require('../middleware/middleware-token');

/* GET task listing. */
router.get('/', verifyToken , function (req, res) {
  return res.json({ status: true, contents: Task })
})

module.exports = router;