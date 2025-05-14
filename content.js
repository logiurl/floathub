// FloatHub Content Script
(function() {
  let isInitialized = false;
  let isEnabled = true;
  let websites = [];
  let dragging = false;
  let dragOffsetX = 0;
  let dragOffsetY = 0;
  let iconPosition = { x: 20, y: 100 };
  let framePosition = { x: 150, y: 100 };
  let activeFrameWebsite = null;

  // Initialize FloatHub
  function initializeFloatHub() {
    if (isInitialized) return;
    
    // Create container
    const container = document.createElement('div');
    container.id = 'floathub-container';
    container.style.left = `${iconPosition.x}px`;
    container.style.top = `${iconPosition.y}px`;
    
    // Create floating icon
    const icon = document.createElement('div');
    icon.id = 'floathub-icon';
    icon.innerHTML = `
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
      </svg>
    `;
    
    // Create toolbar
    const toolbar = document.createElement('div');
    toolbar.id = 'floathub-toolbar';
    toolbar.innerHTML = `
      <div class="floathub-toolbar-header">FloatHub</div>
      <div class="floathub-toolbar-content" id="floathub-websites"></div>
      <div class="floathub-add-button" id="floathub-add-button">+</div>
    `;
    
    // Create frame container
    const frameContainer = document.createElement('div');
    frameContainer.id = 'floathub-frame-container';
    frameContainer.innerHTML = `
      <div class="floathub-frame-header" id="floathub-frame-header">
        <div class="floathub-frame-title">
          <img class="floathub-frame-favicon" id="floathub-frame-favicon" src="" alt="">
          <span id="floathub-frame-title-text">Website</span>
        </div>
        <div class="floathub-frame-actions">
          <button class="floathub-frame-button floathub-frame-open-button" id="floathub-open-button" title="Open in new tab">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
            </svg>
          </button>
          <button class="floathub-frame-button" id="floathub-minimize-button">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 13H5v-2h14v2z"/>
            </svg>
          </button>
          <button class="floathub-frame-button" id="floathub-close-button">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
      </div>
      <div class="floathub-frame-content">
        <iframe id="floathub-frame-iframe" class="floathub-frame-iframe" sandbox="allow-same-origin allow-scripts allow-forms"></iframe>
      </div>
    `;
    
    // Add elements to the DOM
    container.appendChild(icon);
    container.appendChild(toolbar);
    document.body.appendChild(container);
    document.body.appendChild(frameContainer);
    
    // Add event listeners
    icon.addEventListener('click', toggleToolbar);
    icon.addEventListener('mousedown', startDragIcon);
    
    document.getElementById('floathub-add-button').addEventListener('click', addWebsite);
    document.getElementById('floathub-frame-header').addEventListener('mousedown', startDragFrame);
    document.getElementById('floathub-minimize-button').addEventListener('click', minimizeFrame);
    document.getElementById('floathub-close-button').addEventListener('click', closeFrame);
    document.getElementById('floathub-open-button').addEventListener('click', openInNewTab);
    
    // Listen for window resize
    window.addEventListener('resize', handleWindowResize);
    
    // Update website list
    updateWebsitesList();
    
    // Set position for frame container
    frameContainer.style.left = `${framePosition.x}px`;
    frameContainer.style.top = `${framePosition.y}px`;
    
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('mousemove', drag);
    
    isInitialized = true;
    
    // Load saved position
    chrome.storage.sync.get(['iconPosition', 'framePosition'], function(result) {
      if (result.iconPosition) {
        iconPosition = result.iconPosition;
        container.style.left = `${iconPosition.x}px`;
        container.style.top = `${iconPosition.y}px`;
      }
      
      if (result.framePosition) {
        framePosition = result.framePosition;
        frameContainer.style.left = `${framePosition.x}px`;
        frameContainer.style.top = `${framePosition.y}px`;
      }
    });
  }
  
  // Toggle toolbar visibility
  function toggleToolbar() {
    const toolbar = document.getElementById('floathub-toolbar');
    toolbar.classList.toggle('active');
    
    if (toolbar.classList.contains('active')) {
      updateWebsitesList();
    }
  }
  
  // Update websites list in toolbar
  function updateWebsitesList() {
    const websitesContainer = document.getElementById('floathub-websites');
    websitesContainer.innerHTML = '';
    
    websites.forEach((website, index) => {
      const button = document.createElement('button');
      button.className = 'floathub-website-button';
      button.setAttribute('title', website.title || website.url);
      button.innerHTML = `<img src="${website.favicon}" alt="" class="floathub-website-favicon">`;
      button.addEventListener('click', () => openWebsiteInFrame(website));
      
      websitesContainer.appendChild(button);
    });
    
    if (websites.length === 0) {
      websitesContainer.innerHTML = '<div style="text-align:center;padding:8px;font-size:12px;color:#666;">No websites added yet.</div>';
    }
  }
  
  // Add a new website
  function addWebsite() {
    const url = prompt('Enter website URL:');
    if (!url) return;
    
    const finalUrl = url.startsWith('http') ? url : `https://${url}`;
    
    try {
      const domain = new URL(finalUrl).hostname.replace('www.', '');
      const website = {
        url: finalUrl,
        title: domain,
        favicon: `https://www.google.com/s2/favicons?domain=${domain}`
      };
      
      websites.push(website);
      chrome.storage.sync.set({ websites });
      updateWebsitesList();
      
      // Open the new website
      openWebsiteInFrame(website);
    } catch (error) {
      alert('Invalid URL. Please try again.');
    }
  }
  
  // Open website in frame
  function openWebsiteInFrame(website) {
    const frameContainer = document.getElementById('floathub-frame-container');
    const iframe = document.getElementById('floathub-frame-iframe');
    const favicon = document.getElementById('floathub-frame-favicon');
    const titleText = document.getElementById('floathub-frame-title-text');
    
    // Set website info
    favicon.src = website.favicon;
    titleText.textContent = website.title || website.url;
    iframe.src = website.url;
    
    // Show frame
    frameContainer.classList.add('active');
    activeFrameWebsite = website;
    
    // Hide toolbar
    document.getElementById('floathub-toolbar').classList.remove('active');
  }
  
  // Minimize frame with animation
  function minimizeFrame() {
    const frameContainer = document.getElementById('floathub-frame-container');
    const icon = document.getElementById('floathub-icon');
    
    // Add animation class
    frameContainer.classList.add('minimizing');
    
    // Wait for animation to complete
    setTimeout(() => {
      frameContainer.classList.remove('active');
      frameContainer.classList.remove('minimizing');
      
      // Flash the icon
      icon.style.transform = 'scale(1.2)';
      setTimeout(() => {
        icon.style.transform = '';
      }, 300);
    }, 400);
  }
  
  // Open website in new tab
  function openInNewTab() {
    if (activeFrameWebsite) {
      window.open(activeFrameWebsite.url, '_blank');
    }
  }
  
  // Handle window resize
  function handleWindowResize() {
    const frameContainer = document.getElementById('floathub-frame-container');
    
    // Ensure the frame doesn't go outside the viewport
    const maxWidth = window.innerWidth - 50;  // 50px margin
    const maxHeight = window.innerHeight - 50; // 50px margin
    
    const rect = frameContainer.getBoundingClientRect();
    
    // If frame exceeds window width
    if (rect.right > maxWidth) {
      const newWidth = maxWidth - rect.left;
      if (newWidth > 200) { // Don't make it too small
        frameContainer.style.width = `${newWidth}px`;
      } else {
        // If it would be too small, move it instead
        framePosition.x = Math.max(10, maxWidth - rect.width);
        frameContainer.style.left = `${framePosition.x}px`;
      }
    }
    
    // If frame exceeds window height
    if (rect.bottom > maxHeight) {
      const newHeight = maxHeight - rect.top;
      if (newHeight > 150) { // Don't make it too small
        frameContainer.style.height = `${newHeight}px`;
      } else {
        // If it would be too small, move it instead
        framePosition.y = Math.max(10, maxHeight - rect.height);
        frameContainer.style.top = `${framePosition.y}px`;
      }
    }
    
    // Also make sure the floating icon is visible
    const iconRect = document.getElementById('floathub-container').getBoundingClientRect();
    if (iconRect.right > window.innerWidth) {
      iconPosition.x = window.innerWidth - iconRect.width - 10;
      document.getElementById('floathub-container').style.left = `${iconPosition.x}px`;
    }
    if (iconRect.bottom > window.innerHeight) {
      iconPosition.y = window.innerHeight - iconRect.height - 10;
      document.getElementById('floathub-container').style.top = `${iconPosition.y}px`;
    }
    
    // Save positions
    chrome.storage.sync.set({ 
      iconPosition, 
      framePosition 
    });
  }
  
  // Start dragging the floating icon
  function startDragIcon(e) {
    e.preventDefault();
    dragging = 'icon';
    const rect = document.getElementById('floathub-icon').getBoundingClientRect();
    dragOffsetX = e.clientX - rect.left;
    dragOffsetY = e.clientY - rect.top;
  }
  
  // Start dragging the frame
  function startDragFrame(e) {
    e.preventDefault();
    
    // Only start drag if clicking on the header (not the buttons)
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
      return;
    }
    
    dragging = 'frame';
    const rect = document.getElementById('floathub-frame-container').getBoundingClientRect();
    dragOffsetX = e.clientX - rect.left;
    dragOffsetY = e.clientY - rect.top;
  }
  
  // Stop dragging
  function stopDrag() {
    if (dragging) {
      // Save positions
      chrome.storage.sync.set({ 
        iconPosition, 
        framePosition 
      });
      
      dragging = false;
    }
  }
  
  // Handle dragging
  function drag(e) {
    if (!dragging) return;
    
    if (dragging === 'icon') {
      iconPosition.x = e.clientX - dragOffsetX;
      iconPosition.y = e.clientY - dragOffsetY;
      
      const container = document.getElementById('floathub-container');
      container.style.left = `${iconPosition.x}px`;
      container.style.top = `${iconPosition.y}px`;
    } else if (dragging === 'frame') {
      framePosition.x = e.clientX - dragOffsetX;
      framePosition.y = e.clientY - dragOffsetY;
      
      const frameContainer = document.getElementById('floathub-frame-container');
      frameContainer.style.left = `${framePosition.x}px`;
      frameContainer.style.top = `${framePosition.y}px`;
    }
  }
  
  // Close frame
  function closeFrame() {
    const frameContainer = document.getElementById('floathub-frame-container');
    frameContainer.classList.remove('active');
    activeFrameWebsite = null;
  }
  
  // Toggle FloatHub visibility
  function toggleFloatHub(enabled) {
    isEnabled = enabled;
    
    if (isInitialized) {
      const container = document.getElementById('floathub-container');
      const frameContainer = document.getElementById('floathub-frame-container');
      
      container.style.display = isEnabled ? 'block' : 'none';
      frameContainer.style.display = isEnabled ? 'block' : 'none';
    }
  }
  
  // Load saved settings
  chrome.storage.sync.get(['enabled', 'websites'], function(result) {
    isEnabled = result.enabled !== false; // Default to enabled
    websites = result.websites || [];
    
    if (isEnabled) {
      initializeFloatHub();
    }
  });
})();