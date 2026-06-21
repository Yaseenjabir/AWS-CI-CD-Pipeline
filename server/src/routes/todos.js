const router = require('express').Router();
const Todo = require('../models/Todo');

router.get('/', async (req, res) => {
  const todos = await Todo.find().sort({ createdAt: -1 });
  res.json(todos);
});

router.post('/', async (req, res) => {
  const todo = await Todo.create({ title: req.body.title });
  res.status(201).json(todo);
});

router.patch('/:id', async (req, res) => {
  const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!todo) return res.status(404).json({ message: 'Not found' });
  res.json(todo);
});

router.delete('/:id', async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

module.exports = router;
