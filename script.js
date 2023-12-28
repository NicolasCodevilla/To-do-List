document.addEventListener('DOMContentLoaded', function () {
    // Recupera tarefas salvas no armazenamento local ou inicializa um array vazio
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    // Obtém a referência à lista de tarefas no DOM
    const tasksList = document.getElementById('tasks');
    // Adiciona cada tarefa salva ao DOM usando a função createTaskElement
    savedTasks.forEach(task => {
        tasksList.appendChild(createTaskElement(task.text, task.completed));
    });
});

// Função para criar elementos de tarefa
function createTaskElement(taskText, completed = false) {
    const li = document.createElement('li');
    const checkbox = createCheckbox(completed);
    const label = createLabel(taskText, completed);
    const editInput = createEditInput(taskText);
    const editButton = createEditButton(li, label, editInput);
    const deleteButton = createDeleteButton(li);

    // Adiciona elementos ao li
    li.appendChild(checkbox);
    li.appendChild(label);
    li.appendChild(editInput);
    li.appendChild(editButton);
    li.appendChild(deleteButton);

    // Adiciona ouvintes de eventos para a checkbox e o botão de edição
    checkbox.addEventListener('change', () => toggleTaskCompletion(li, label, taskText));
    editButton.addEventListener('click', () => enableEditMode(li, label, editInput));

    return li;
}

// Função para criar uma checkbox
function createCheckbox(completed) {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = completed;
    return checkbox;
}

// Função para criar uma label
function createLabel(taskText, completed) {
    const label = document.createElement('label');
    label.innerText = taskText;
    if (completed) label.classList.add('completed');
    return label;
}

// Função para criar um campo de edição de tarefa
function createEditInput(value) {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = value;
    input.className = 'edit-input';
    return input;
}

// Função para criar um botão de edição
function createEditButton(li, label, editInput) {
    const editButton = document.createElement('button');
    editButton.className = 'edit-btn';
    editButton.innerText = 'Editar';
    return editButton;
}

// Função para criar um botão de exclusão
function createDeleteButton(li) {
    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-btn';
    deleteButton.innerText = 'Excluir';
    deleteButton.onclick = () => deleteTask(li);
    return deleteButton;
}

// Abre o modal de adição de tarefa
function openModal() {
    const modal = document.getElementById('myModal');
    const overlay = document.querySelector('.overlay');
    modal.style.display = 'block';
    overlay.style.display = 'block';
    document.getElementById('newTaskInput').focus();
}

// Fecha o modal de adição de tarefa
function closeModal() {
    const modal = document.getElementById('myModal');
    const overlay = document.querySelector('.overlay');
    modal.style.display = 'none';
    overlay.style.display = 'none';
}

// Adiciona uma nova tarefa à lista
function addTask() {
    const newTaskInput = document.getElementById('newTaskInput');
    const newTask = newTaskInput.value.trim();

    if (newTask) {
        const tasksList = document.getElementById('tasks');
        const newTaskElement = createTaskElement(newTask);
        tasksList.appendChild(newTaskElement);
        updateLocalStorage();
        closeModal();
        newTaskInput.value = ''; // Limpa o campo de entrada
    }
}
// Adiciona um ouvinte de evento para o pressionar da tecla Enter
const KeyPress = (event) => {
    if (event.key === 'Enter') 
    addTask()
    }
    document.addEventListener('keypress', KeyPress);


// Alterna a conclusão de uma tarefa
function toggleTaskCompletion(li, label, taskText) {
    label.classList.toggle('completed');
    updateLocalStorage();
}

// Exclui uma tarefa da lista
function deleteTask(li) {
    const tasksList = document.getElementById('tasks');
    tasksList.removeChild(li);
    updateLocalStorage();
}

// Atualiza as tarefas no armazenamento local com o estado atual
function updateLocalStorage() {
    const tasks = Array.from(document.querySelectorAll('#tasks li')).map(li => ({
        text: li.querySelector('label').innerText,
        completed: li.querySelector('input[type="checkbox"]').checked
    }));

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Ativa o modo de edição para uma tarefa
function enableEditMode(li, label, editInput) {
    const editButton = li.querySelector('.edit-btn');
    const saveButton = document.createElement('button');
    saveButton.className = 'edit-btn save-btn';
    saveButton.innerText = 'Salvar';

    const cancelButton = document.createElement('button');
    cancelButton.className = 'edit-btn cancel-btn';
    cancelButton.innerText = 'Cancelar';

    // Substitui o botão de edição pelo botão de salvar e cancelar
    editButton.replaceWith(saveButton, cancelButton);
    cancelButton.style.display = 'inline-block'; // Mostra o botão Cancelar

    // Habilita o modo de edição
    label.style.display = 'none';
    editInput.style.display = 'inline-block';
    editInput.focus();

    // Desabilita o modo de edição ao clicar em "Salvar"
    const disableEditMode = () => {
        label.innerText = editInput.value;
        label.style.display = 'inline-block';
        editInput.style.display = 'none';
        saveButton.replaceWith(editButton);
        cancelButton.style.display = 'none'; // Oculta o botão Cancelar
        updateLocalStorage();
        // Remove os ouvintes de eventos após a conclusão da edição
        saveButton.removeEventListener('click', disableEditMode);
        cancelButton.removeEventListener('click', disableEditMode);
        document.removeEventListener('keypress', handleKeyPress);
    };

    // Adiciona ouvinte de evento para o botão "Salvar"
    saveButton.addEventListener('click', disableEditMode);


    // Desabilita o modo de edição ao clicar em "Cancelar"
    cancelButton.addEventListener('click', () => {
        label.style.display = 'inline-block';
        editInput.style.display = 'none';
        saveButton.replaceWith(editButton);
        cancelButton.style.display = 'none'; // Oculta o botão Cancelar
        // Restaura o valor original ao clicar em "Cancelar"
        editInput.value = label.innerText;
        // Remove os ouvintes de eventos após a conclusão da edição
        saveButton.removeEventListener('click', disableEditMode);
        cancelButton.removeEventListener('click', disableEditMode);
        document.removeEventListener('keypress', handleKeyPress);
    });

    // Adiciona um ouvinte de evento para o pressionar da tecla Enter
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            disableEditMode();
        }
    };
    document.addEventListener('keypress', handleKeyPress);
}
