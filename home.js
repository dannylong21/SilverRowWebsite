const home = () => {
    // Get the navbar and roster table elements
    const navbarContainer = document.getElementById('navbar-container');
    const rosterTable = document.getElementById('roster-table');
    
    // Move navbar-container to be a child of body (before removing image-container)
    document.body.appendChild(navbarContainer);
    
    // Make navbar-container static (remove absolute positioning)
    navbarContainer.classList.remove('absolute', 'bottom-0');
    navbarContainer.style.position = 'static';
    
    // Move roster-table under navbar-container (after it in the DOM)
    document.body.insertBefore(rosterTable, navbarContainer.nextSibling);
    
    // Now remove the image-container element
    const imageContainer = document.querySelector('.image-container');
    if (imageContainer) {
        imageContainer.remove();
    }
}

const aboutus = () => {
    // Get the navbar and roster table elements
    const navbarContainer = document.getElementById('navbar-container');
    const rosterTable = document.getElementById('roster-table');
    
    // Move navbar-container to be a child of body (before removing image-container)
    document.body.appendChild(navbarContainer);
    
    // Make navbar-container static (remove absolute positioning)
    navbarContainer.classList.remove('absolute', 'bottom-0');
    navbarContainer.style.position = 'static';
    
    // Move roster-table under navbar-container (after it in the DOM)
    document.body.insertBefore(rosterTable, navbarContainer.nextSibling);
    
    // Now remove the image-container element
    const imageContainer = document.querySelector('.image-container');
    if (imageContainer) {
        imageContainer.remove();
    }
}

const personnel = () => {
    // Get the navbar and roster table elements
    const navbarContainer = document.getElementById('navbar-container');
    const rosterTable = document.getElementById('roster-table');
    
    // Move navbar-container to be a child of body (before removing image-container)
    document.body.appendChild(navbarContainer);
    
    // Make navbar-container static (remove absolute positioning)
    navbarContainer.classList.remove('absolute', 'bottom-0');
    navbarContainer.style.position = 'static';
    
    // Move roster-table under navbar-container (after it in the DOM)
    document.body.insertBefore(rosterTable, navbarContainer.nextSibling);
    
    // Now remove the image-container element
    const imageContainer = document.querySelector('.image-container');
    if (imageContainer) {
        imageContainer.remove();
    }
}

const services = () => {
    // Get the navbar and roster table elements
    const navbarContainer = document.getElementById('navbar-container');
    const rosterTable = document.getElementById('roster-table');
    
    // Move navbar-container to be a child of body (before removing image-container)
    document.body.appendChild(navbarContainer);
    
    // Make navbar-container static (remove absolute positioning)
    navbarContainer.classList.remove('absolute', 'bottom-0');
    navbarContainer.style.position = 'static';
    
    // Move roster-table under navbar-container (after it in the DOM)
    document.body.insertBefore(rosterTable, navbarContainer.nextSibling);
    
    // Now remove the image-container element
    const imageContainer = document.querySelector('.image-container');
    if (imageContainer) {
        imageContainer.remove();
    }
}

const contact = () => {
    // Get the navbar and roster table elements
    const navbarContainer = document.getElementById('navbar-container');
    const rosterTable = document.getElementById('roster-table');
    
    // Move navbar-container to be a child of body (before removing image-container)
    document.body.appendChild(navbarContainer);
    
    // Make navbar-container static (remove absolute positioning)
    navbarContainer.classList.remove('absolute', 'bottom-0');
    navbarContainer.style.position = 'static';
    
    // Move roster-table under navbar-container (after it in the DOM)
    document.body.insertBefore(rosterTable, navbarContainer.nextSibling);
    
    // Now remove the image-container element
    const imageContainer = document.querySelector('.image-container');
    if (imageContainer) {
        imageContainer.remove();
    }
}