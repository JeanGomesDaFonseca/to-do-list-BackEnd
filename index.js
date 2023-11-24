const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());

let tasks = [];

app.get('/tasks', (req, res) => {
    res.json(tasks);
});

app.post('/tasks', (req, res) => {
    const newTask = req.body;
    tasks.push(newTask);
    res.json(newTask);
});

app.put('/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    const updatedTask = req.body;

    const taskIndex = tasks.findIndex(task => task.id === taskId);

    if (taskIndex !== -1) {
        tasks[taskIndex] = { ...tasks[taskIndex], ...updatedTask };

        res.json(tasks[taskIndex]);
    } else {
        res.status(404).json({ error: 'Tarefa não encontrada.' });
    }
});

app.delete('/tasks/:id', (req, res) => {
    const taskId = req.params.id;

    const taskIndex = tasks.findIndex(task => task.id === taskId);

    if (taskIndex !== -1) {
        const deletedTask = tasks.splice(taskIndex, 1)[0];

        res.json({ message: 'Tarefa excluída com sucesso.', deletedTask });
    } else {
        res.status(404).json({ error: 'Tarefa não encontrada.' });
    }
});


app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
