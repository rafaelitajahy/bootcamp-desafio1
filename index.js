const express = require('express');

const server = express();

server.use(express.json());

const projects = [
  {
    id: '1',
    title: 'App HelpDesk',
    tasks: ['Criar login', 'Criar tabelas bancdo de dados']
  },
  {
    id: '2',
    title: 'App Loja Online',
    tasks: ['Criar login', 'Crir homepage']
  }
];

var project;

server.use((req, res, next) => {
  console.log(`Request: ${req.method} - ${req.url}`);

  next();
});

function checkProjectExists(req, res, next) {
  const { id } = req.params;

  project = searchId(id);

  if (project !== null) {
    next();
  } else {
    res.status(400).send({ message: 'Project not found' });
  }
}

function searchId(id) {
  for (const project of projects) {
    if (project.id === id) {
      return project;
    }
  }

  return null;
}

//Rotas
server.get('/projects', (req, res) => {
  res.json(projects);
});

server.get('/projects/:id', checkProjectExists, (req, res) => {
  res.json(project);
});

server.post('/projects', (req, res) => {
  const project = req.body;

  projects.push(project);

  res.json(projects);
});

server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const tasks = req.body;
  const { id } = req.params;

  for (const project of projects) {
    if (project.id === id) {
      project.tasks.push(tasks.title);

      return res.json(projects);
    }
  }
});

server.put('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const title = req.body;

  for (const project of projects) {
    if (project.id === id) {
      project.title = title;

      res.json(projects);
    }
  }
});

server.delete('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;

  for (const project of projects) {
    if (project.id === id) {
      const index = projects.indexOf(project);
      projects.splice(index, 1);

      res.json(projects);
    }
  }
});

server.listen(3000);
