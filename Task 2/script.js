document.addEventListener('DOMContentLoaded', function() {
    // Navigation functionality
    const navLinks = document.querySelectorAll('.main-nav a');
    const sections = document.querySelectorAll('.dashboard-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and sections
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            // Add active class to clicked link and corresponding section
            this.classList.add('active');
            const sectionId = this.getAttribute('href');
            document.querySelector(sectionId).classList.add('active');
            
            // Update stats when switching to home section
            if (sectionId === '#home') {
                updateStats();
            }
        });
    });
    
    // To-Do List Functionality
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const showAllBtn = document.getElementById('showAll');
    const showActiveBtn = document.getElementById('showActive');
    const showCompletedBtn = document.getElementById('showCompleted');
    const taskCount = document.getElementById('taskCount');
    const clearCompletedBtn = document.getElementById('clearCompleted');
    const completedCountElement = document.getElementById('completed-count');
    const pendingCountElement = document.getElementById('pending-count');
    
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let currentFilter = 'all';
    
    function renderTasks() {
        taskList.innerHTML = '';
        
        const filteredTasks = tasks.filter(task => {
            if (currentFilter === 'active') return !task.completed;
            if (currentFilter === 'completed') return task.completed;
            return true;
        });
        
        if (filteredTasks.length === 0) {
            const emptyMessage = document.createElement('li');
            emptyMessage.textContent = currentFilter === 'all' ? 'No tasks yet!' : 
                                      currentFilter === 'active' ? 'No active tasks!' : 'No completed tasks!';
            emptyMessage.style.textAlign = 'center';
            emptyMessage.style.color = '#888';
            emptyMessage.style.padding = '20px';
            taskList.appendChild(emptyMessage);
        } else {
            filteredTasks.forEach((task, index) => {
                const taskItem = document.createElement('li');
                taskItem.className = 'task-item' + (task.completed ? ' completed' : '');
                
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'task-checkbox';
                checkbox.checked = task.completed;
                checkbox.addEventListener('change', () => toggleTaskComplete(index));
                
                const taskText = document.createElement('span');
                taskText.className = 'task-text';
                taskText.textContent = task.text;
                
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'delete-btn';
                deleteBtn.textContent = 'Delete';
                deleteBtn.addEventListener('click', () => deleteTask(index));
                
                taskItem.appendChild(checkbox);
                taskItem.appendChild(taskText);
                taskItem.appendChild(deleteBtn);
                
                taskList.appendChild(taskItem);
            });
        }
        
        updateTaskCount();
        updateStats();
    }
    
    function addTask() {
        const text = taskInput.value.trim();
        if (text) {
            tasks.push({ text, completed: false });
            saveTasks();
            taskInput.value = '';
            renderTasks();
        }
    }
    
    function toggleTaskComplete(index) {
        const taskText = tasks.filter(task => {
            if (currentFilter === 'active') return !task.completed;
            if (currentFilter === 'completed') return task.completed;
            return true;
        })[index].text;
        
        const originalIndex = tasks.findIndex(task => task.text === taskText);
        tasks[originalIndex].completed = !tasks[originalIndex].completed;
        saveTasks();
        renderTasks();
    }
    
    function deleteTask(index) {
        const taskText = tasks.filter(task => {
            if (currentFilter === 'active') return !task.completed;
            if (currentFilter === 'completed') return task.completed;
            return true;
        })[index].text;
        
        const originalIndex = tasks.findIndex(task => task.text === taskText);
        tasks.splice(originalIndex, 1);
        saveTasks();
        renderTasks();
    }
    
    function updateTaskCount() {
        const activeTasks = tasks.filter(task => !task.completed).length;
        taskCount.textContent = `${activeTasks} ${activeTasks === 1 ? 'task' : 'tasks'} remaining`;
    }
    
    function updateStats() {
        const completedTasks = tasks.filter(task => task.completed).length;
        const pendingTasks = tasks.filter(task => !task.completed).length;
        
        completedCountElement.textContent = completedTasks;
        pendingCountElement.textContent = pendingTasks;
    }
    
    function clearCompleted() {
        tasks = tasks.filter(task => !task.completed);
        saveTasks();
        renderTasks();
    }
    
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    // Event listeners for To-Do List
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addTask();
    });
    
    showAllBtn.addEventListener('click', function() {
        currentFilter = 'all';
        showAllBtn.classList.add('active');
        showActiveBtn.classList.remove('active');
        showCompletedBtn.classList.remove('active');
        renderTasks();
    });
    
    showActiveBtn.addEventListener('click', function() {
        currentFilter = 'active';
        showAllBtn.classList.remove('active');
        showActiveBtn.classList.add('active');
        showCompletedBtn.classList.remove('active');
        renderTasks();
    });
    
    showCompletedBtn.addEventListener('click', function() {
        currentFilter = 'completed';
        showAllBtn.classList.remove('active');
        showActiveBtn.classList.remove('active');
        showCompletedBtn.classList.add('active');
        renderTasks();
    });
    
    clearCompletedBtn.addEventListener('click', clearCompleted);
    
    // Initial render of To-Do List
    renderTasks();
    
    // Image Gallery Functionality
    const addImageBtn = document.getElementById('addImageBtn');
    const imageUpload = document.getElementById('imageUpload');
    const imageGallery = document.getElementById('imageGallery');
    const galleryCountElement = document.getElementById('gallery-count');
    
    function updateGalleryCount() {
        const count = imageGallery.querySelectorAll('.gallery-item').length;
        galleryCountElement.textContent = count;
    }
    
    function addImageToGallery(imageUrl) {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        
        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = 'Uploaded image';
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-img-btn';
        deleteBtn.textContent = '×';
        deleteBtn.addEventListener('click', function() {
            galleryItem.remove();
            updateGalleryCount();
        });
        
        galleryItem.appendChild(img);
        galleryItem.appendChild(deleteBtn);
        imageGallery.appendChild(galleryItem);
        
        updateGalleryCount();
    }
    
    addImageBtn.addEventListener('click', function() {
        imageUpload.click();
    });
    
    imageUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                addImageToGallery(event.target.result);
            };
            reader.readAsDataURL(file);
        }
        // Reset the input to allow selecting the same file again
        imageUpload.value = '';
    });
    
    // Add event listeners for existing delete buttons
    document.querySelectorAll('.delete-img-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            this.parentElement.remove();
            updateGalleryCount();
        });
    });
    
    // Initial gallery count
    updateGalleryCount();
    
    // Contact Form Validation
    const contactForm = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const messageError = document.getElementById('message-error');
    const formSuccess = document.getElementById('form-success');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Reset error messages
        nameError.textContent = '';
        emailError.textContent = '';
        messageError.textContent = '';
        formSuccess.style.display = 'none';
        
        let isValid = true;
        
        // Name validation
        if (nameInput.value.trim() === '') {
            nameError.textContent = 'Name is required';
            isValid = false;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailInput.value.trim() === '') {
            emailError.textContent = 'Email is required';
            isValid = false;
        } else if (!emailRegex.test(emailInput.value.trim())) {
            emailError.textContent = 'Please enter a valid email address';
            isValid = false;
        }
        
        // Message validation
        if (messageInput.value.trim() === '') {
            messageError.textContent = 'Message is required';
            isValid = false;
        }
        
        if (isValid) {
            // In a real application, you would send the form data to a server here
            formSuccess.textContent = 'Thank you for your message! We will get back to you soon.';
            formSuccess.style.display = 'block';
            contactForm.reset();
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                formSuccess.style.display = 'none';
            }, 5000);
        }
    });
});