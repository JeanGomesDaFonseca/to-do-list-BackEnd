const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Conectar ao MongoDB
const uri = '<sua-string-de-conexao>';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let tasksCollection;

client.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao MongoDB:', err);
    return;
  }

  console.log('Conectado ao MongoDB');
  const db = client.db('seuBancoDeDados');
  tasksCollection = db.collection('tasks');
});

app.get('/tasks', async (req, res) => {
  const tasks = await tasksCollection.find({}).toArray();
  res.json(tasks);
});

app.post('/tasks', async (req, res) => {
  const newTask = req.body;
  const result = await tasksCollection.insertOne(newTask);
  newTask._id = result.insertedId;
  res.json(newTask);
});

app.put('/tasks/:id', async (req, res) => {
  const taskId = req.params.id;
  const updatedTask = req.body;

  const result = await tasksCollection.findOneAndUpdate(
    { _id: ObjectId(taskId) },
    { $set: updatedTask },
    { returnDocument: 'after' }
  );

  if (result.value) {
    res.json(result.value);
  } else {
    res.status(404).json({ error: 'Tarefa não encontrada.' });
  }
});

app.delete('/tasks/:id', async (req, res) => {
  const taskId = req.params.id;

  const result = await tasksCollection.findOneAndDelete({ _id: ObjectId(taskId) });

  if (result.value) {
    res.json({ message: 'Tarefa excluída com sucesso.', deletedTask: result.value });
  } else {
    res.status(404).json({ error: 'Tarefa não encontrada.' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
