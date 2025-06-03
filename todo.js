const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const prioritySelect = document.getElementById('priority');
const list = document.getElementById('todo-list');
let todos = [];

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}
function loadTodos() {
  const data = localStorage.getItem('todos');
  if (data) todos = JSON.parse(data);
}

function renderTodos() {
  list.innerHTML = '';
  todos.forEach((todo, idx) => {
    const li = document.createElement('li');
    li.className = `${todo.priority.toLowerCase()}${todo.completed ? ' completed' : ''}`;
    if (todo.editing) {
      li.innerHTML = `
        <input class="edit-input" value="${todo.text}" />
        <div class="todo-actions">
          <button class="save">Save</button>
          <button class="cancel">Cancel</button>
        </div>
      `;
    } else {
      li.innerHTML = `
        <span>
          <input type="checkbox" ${todo.completed ? 'checked' : ''} class="toggle">
          <b>[${todo.priority}]</b> ${todo.text}
        </span>
        <div class="todo-actions">
          <button class="edit">Edit</button>
          <button class="delete">Delete</button>
        </div>
      `;
    }

    // Complete/Toggle
    li.querySelector('.toggle')?.addEventListener('change', () => {
      todos[idx].completed = !todos[idx].completed;
      saveTodos();
      renderTodos();
    });

    // Delete
    li.querySelector('.delete')?.addEventListener('click', () => {
      todos.splice(idx, 1);
      saveTodos();
      renderTodos();
    });

    // Edit
    li.querySelector('.edit')?.addEventListener('click', () => {
      todos[idx].editing = true;
      renderTodos();
    });

    // Save Edit
    li.querySelector('.save')?.addEventListener('click', () => {
      const newText = li.querySelector('.edit-input').value.trim();
      if (newText) {
        todos[idx].text = newText;
        todos[idx].editing = false;
        saveTodos();
        renderTodos();
      }
    });

    // Cancel Edit
    li.querySelector('.cancel')?.addEventListener('click', () => {
      todos[idx].editing = false;
      renderTodos();
    });

    list.appendChild(li);
  });
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const text = input.value.trim();
  const priority = prioritySelect.value;
  if (text) {
    todos.unshift({ text, priority, completed: false, editing: false });
    input.value = '';
    saveTodos();
    renderTodos();
  }
});

loadTodos();
renderTodos();
