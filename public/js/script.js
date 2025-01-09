// Global varifetchTasksables
let selectedCategoryId = null;

// Helper function to fetch and render categories
const fetchCategories = () => {
  $.get('/api/categories', data => {
    $('#categories-container').html('');
    data.forEach(category => {
      $('#categories-container').append(`
        <div class="category-item" data-id="${category._id}">
          <span>${category.category}</span>
          <div>
            <button class="edit-category">Edit</button>
            <button class="delete-category">Delete</button>
          </div>
        </div>
      `);
    });
  });
};

// Add a category
$('#add-category-btn').on('click', () => {
  const category = $('#category-input').val().trim();
  if (!category) return alert('Please enter a category name!');
});

// Add a task
$('#add-task-btn').on('click', () => {
  if (!selectedCategoryId) return alert('Please select a category first!');

  const task = $('#task-input').val().trim();
  if (!task) return alert('Please enter a task!');

  $.post('/api/task', {categoryId: selectedCategoryId, task}, () => {
    $('#task-input').val('');
    fetchTasks(selectedCategoryId);
  });
});

// Fetch tasks for a category
const fetchTasks = categoryId => {
  $.get(`/api/categories`, data => {
    const category = data.find(cat => cat._id === categoryId);

    $('#tasks-container').html('');
    category.tasks.forEach(task => {
      $('#tasks-container').append(`
        <div class="task-item" data-id="${task._id}">
          <span>${task.task}</span>
          <div>
            <button class="edit-task">Edit</button>
            <button class="delete-task">Delete</button>
          </div>
        </div>
      `);
    });
  });
};

// Select a category
$(document).on('click', '.category-item', function () {
  selectedCategoryId = $(this).data('id');
  const categoryName = $(this).find('span').text();
  $('#task-header').text(`Tasks for ${categoryName}`);
  fetchTasks(selectedCategoryId);
});

// Delete a category
$(document).on('click', '.delete-category', function () {
  const categoryId = $(this).closest('.category-item').data('id');
  $.ajax({
    url: `/api/category/${categoryId}`,
    type: 'DELETE',
    success: () => fetchCategories(),
  });
});
// Delete a task
$(document).on('click', '.delete-task', function () {
  const taskId = $(this).closest('.task-item').data('id');
  $.ajax({
    url: `/api/task/${selectedCategoryId}`,
    type: 'DELETE',
    data: {taskId},
    success: () => fetchTasks(selectedCategoryId),
  });
});
// signup ans login
$('#signup-btn').on('click', () => $('#signup-modal').show());
$('#login-btn').on('click', () => $('#login-modal').show());

// signup ans login close
$('#close-signup').on('click', () => $('#signup-modal').hide());
$('#close-login').on('click', () => $('#login-modal').hide());

// // Close modals when clicking outside
// $(window).on('click', e => {
//   if ($(e.target).is('#signup-modal')) $('#signup-modal').hide();
//   if ($(e.target).is('#login-modal')) $('#login-modal').hide();
// });

// Signup functionality
$('#signup-submit').on('click', () => {
  const username = $('#signup-username').val().trim();
  const email = $('#signup-email').val().trim();
  const password = $('#signup-password').val().trim();

  if (!username || !email || !password)
    return alert('Please fill in all fields!');

  $.post('/auth/signup', {username, email, password})
    .done(() => {
      alert('Signup successful! Please login.');
      $('#signup-modal').hide();
    })
    .fail(err => alert(err.responseJSON.error));
});

// Login functionality
$('#login-submit').on('click', () => {
  const email = $('#login-email').val().trim();
  const password = $('#login-password').val().trim();

  if (!email || !password) return alert('Please fill in all fields!');

  $.post('/auth/login', {email, password})
    .done(response => {
      alert(response.message);
      localStorage.setItem('token', response.token);
      $('#login-modal').hide();
    })
    .fail(err => alert(err.responseJSON.error));
});

$(document).ready(function () {
  const token = localStorage.getItem('token');
  if (token) {
    // User is logged in
    $('#login-btn').hide();
    $('#signup-btn').hide();
    $('.login-section').append('<button id="logout-btn">Logout</button>');

    // Logout functionality
    $('#logout-btn').on('click', () => {
      localStorage.removeItem('token');
      location.reload();
    });
  }
});

// Initial fetch
fetchCategories();
