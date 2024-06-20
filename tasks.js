const express = require('express');
const router = express.Router();

var tasks = [
    { id: 1, titulo: 'Tarea1', descripcion: 'Descripcion1', estado: 'completada' },
    { id: 2, titulo: 'Tarea2', descripcion: 'Descripcion2', estado: 'pendiente' },
    { id: 3, titulo: 'Tarea3', descripcion: 'Descripcion3', estado: 'completada' }
];

//GET
router.get('/', (req, res) => {
    res.json(tasks);
});

//ADD
router.post('/', (req, res) => {
    const { titulo, descripcion } = req.body;
    const newId = tasks.length > 0 ? Math.max(...tasks.map(task => task.id)) + 1 : 1;
    const newTask = { id: newId, titulo, descripcion, estado: 'pendiente' };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

//UPD
router.put('/:id', (req, res) => {
    const taskId = parseInt(req.params.id);
    const { titulo, descripcion, estado } = req.body;
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        tasks[taskIndex] = { ...tasks[taskIndex], titulo, descripcion, estado };
        res.json(tasks[taskIndex]);
    } else {
        res.status(404).send('Tarea no encontrada');
    }
});

//DEL
router.delete('/:id', (req, res) => {
    try {
        const taskId = parseInt(req.params.id);
        const taskIndex = tasks.findIndex(task => task.id === taskId);

        if (taskIndex !== -1) {
            tasks = tasks.filter(task => task.id !== taskId);
            res.status(204).end();
        } else {
            res.status(404).send('Tarea no encontrada');
        }
    } catch (error) {
        console.error('Error DELETE:', error);
    }
});

module.exports = router;
