const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());

// Подключение к MongoDB
const mongoHost = process.env.MONGO_HOST || 'localhost';
mongoose.connect(`mongodb://${mongoHost}:27017/todos`, { useNewUrlParser: true, useUnifiedTopology: true });

// Модель задачи
const Todo = mongoose.model('Todo', new mongoose.Schema({ text: String, completed: { type: Boolean, default: false } }));

app.get('/todos', async (req, res) => { res.json(await Todo.find()); });
app.post('/todos', async (req, res) => { const todo = new Todo(req.body); res.status(201).json(await todo.save()); });
app.get('/todos/:id', async (req, res) => { res.json(await Todo.findById(req.params.id)); });
app.put('/todos/:id', async (req, res) => { res.json(await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true })); });
app.delete('/todos/:id', async (req, res) => { await Todo.findByIdAndDelete(req.params.id); res.status(204).send(); });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
