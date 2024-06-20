const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;
const tasksRouter = require('./tasks');

app.use(express.static('public'));
app.use(express.json());

app.use('/tasks', tasksRouter);

app.listen(PORT, () => {
    console.log(`APP corriendo en http://localhost:8080`);
});
