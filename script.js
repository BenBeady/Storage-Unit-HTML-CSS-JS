// Grab every drawer on the page
const drawers = document.querySelectorAll('.drawer');

// Loop through each drawer and set it up
drawers.forEach(drawer => {

    const drawerId = drawer.dataset.drawer;  // "filing", "important", etc.
    const list = drawer.querySelector('.drawer-contents');

    // 1. Load any saved files from localStorage and display them
    loadFiles(drawerId, list);

    // 2. When a file is dragged OVER the drawer
    drawer.addEventListener('dragover', (e) => {
        e.preventDefault();  // required, or drop won't work
        drawer.classList.add('drag-over');
    });

    // 3. When the file leaves without being dropped
    drawer.addEventListener('dragleave', () => {
        drawer.classList.remove('drag-over');
    });

    // 4. When a file is dropped
    drawer.addEventListener('drop', (e) => {
        e.preventDefault();
        drawer.classList.remove('drag-over');

        // Get the dropped files
        const files = e.dataTransfer.files;

        // Add each file's name to the drawer
        for (const file of files) {
            addFile(drawerId, file.name, list);
        }
    });
});


// Add a file name to a drawer and save it
function addFile(drawerId, fileName, list) {
    const saved = JSON.parse(localStorage.getItem(drawerId) || '[]');
    saved.push(fileName);
    localStorage.setItem(drawerId, JSON.stringify(saved));
    renderList(drawerId, list);
}

// Remove a file from a drawer
function removeFile(drawerId, fileName, list) {
    let saved = JSON.parse(localStorage.getItem(drawerId) || '[]');
    saved = saved.filter(name => name !== fileName);
    localStorage.setItem(drawerId, JSON.stringify(saved));
    renderList(drawerId, list);
}

// Load saved files on page open
function loadFiles(drawerId, list) {
    renderList(drawerId, list);
}

// Draw the list of files inside the drawer
function renderList(drawerId, list) {
    const saved = JSON.parse(localStorage.getItem(drawerId) || '[]');
    list.innerHTML = '';  // clear it first

    saved.forEach(fileName => {
        const li = document.createElement('li');
        li.textContent = fileName;

        const removeBtn = document.createElement('span');
        removeBtn.textContent = '✕';
        removeBtn.className = 'remove';
        removeBtn.onclick = () => removeFile(drawerId, fileName, list);

        li.appendChild(removeBtn);
        list.appendChild(li);
    });
}