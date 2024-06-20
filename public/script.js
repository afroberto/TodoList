const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');

const renderTasks = (tasks) => {
    taskList.innerHTML = '';

    tasks.forEach(task => {
        //console.log(task)
        //console.log("TaskRender");
        var li = document.createElement('li');
        li.innerHTML = `
            <span class="${task.estado === 'completada' ? 'completed' : ''}">
                ${task.titulo} - ${task.descripcion}
            </span>
            <div>
                <button class="completeBtn btn ${task.estado === 'completada' ? 'btn-warning' : 'btn-success'}" data-id="${task.id}">
                    ${task.estado === 'completada' ? 'Reabrir' : 'Completar'}
                </button>
                <button class="deleteBtn btn btn-danger" data-id="${task.id}">Eliminar</button>
            </div>
        `;
        taskList.appendChild(li);
        ////////////////////////////////////
        li.querySelector('.completeBtn').addEventListener('click', () => {
            const taskId = parseInt(li.querySelector('.completeBtn').getAttribute('data-id'));
            const task = tasks.find(task => task.id === taskId);
        
            const updatedTask = {
                titulo: task.titulo,
                descripcion: task.descripcion,
                estado: task.estado === 'pendiente' ? 'completada' : 'pendiente'
            };
        
            fetch(`/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedTask)
            })
            .then(response => response.json())
            .then(updatedTask => {
                const updatedTaskIndex = tasks.findIndex(task => task.id === updatedTask.id);
                tasks[updatedTaskIndex] = updatedTask;
                renderTasks(tasks);
            })
            .catch(error => console.error('Error:', error));
        });
        //////////////////////////////////////
        li.querySelector('.deleteBtn').addEventListener('click', () => {
            const taskId = parseInt(li.querySelector('.deleteBtn').getAttribute('data-id'));
            console.log('Eliminar tarea con ID:', taskId);
            
            fetch(`/tasks/${taskId}`, {
                method: 'DELETE'
            })
            .then(response => {
                console.log(response);
                if (response.ok) {
                    tasks = tasks.filter(task => task.id !== taskId);
                    renderTasks(tasks);
                } else {
                    console.error('Error al eliminar la tarea:', response.statusText);
                }
            })
            .catch(error => console.error('Error en la solicitud DELETE:', error));
        });
        /////////////////////////////////////////
    });
};

//Agregar
document.getElementById('taskForm').addEventListener('submit', (event) => {
    event.preventDefault();

    const titulo = document.getElementById('titulo').value;
    const descripcion = document.getElementById('descripcion').value;
    const newTask = { titulo, descripcion };

    fetch('/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTask)
    })
    .then(response => response.json())
    .then(data => {
        console.log('ADD:', data);
        document.getElementById('titulo').value = "";
        document.getElementById('descripcion').value = "";
        window.location.reload();
    })
    .catch(error => console.error('Error al agregar la tarea:', error));
});

//Consultar al iniciar la pagina
fetch('/tasks')
.then(response => response.json())
.then(data => {
    tasks = data;
    renderTasks(tasks);
})
.catch(error => console.error('Error:', error));
