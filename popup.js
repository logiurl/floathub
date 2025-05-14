document.addEventListener('DOMContentLoaded', function() {
    const enableFloatHub = document.getElementById('enable-floathub');
    const websitesList = document.getElementById('websites-list');
    const websiteUrl = document.getElementById('website-url');
    const addWebsiteBtn = document.getElementById('add-website-btn');
    const reportIssueBtn = document.getElementById('report-issue-btn');
    
    // Load saved settings
    chrome.storage.sync.get(['enabled', 'websites'], function(result) {
      enableFloatHub.checked = result.enabled !== false; // Default to enabled
      
      if (result.websites && Array.isArray(result.websites)) {
        renderWebsitesList(result.websites);
      } else {
        // Initialize with some default websites
        const defaultWebsites = [
          { url: 'https://google.com', title: 'Google', favicon: 'https://www.google.com/favicon.ico' },
          { url: 'https://youtube.com', title: 'YouTube', favicon: 'https://www.youtube.com/favicon.ico' }
        ];
        chrome.storage.sync.set({ websites: defaultWebsites });
        renderWebsitesList(defaultWebsites);
      }
    });
    
    // Toggle FloatHub
    enableFloatHub.addEventListener('change', function() {
      chrome.storage.sync.set({ enabled: this.checked });
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { 
          action: 'toggleFloatHub', 
          enabled: enableFloatHub.checked 
        });
      });
    });
    
    // Add website
    addWebsiteBtn.addEventListener('click', function() {
      const url = websiteUrl.value.trim();
      if (!url) return;
      
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        websiteUrl.value = 'https://' + url;
      }
      
      const finalUrl = websiteUrl.value.trim();
      
      fetchWebsiteInfo(finalUrl, function(websiteInfo) {
        chrome.storage.sync.get(['websites'], function(result) {
          const websites = result.websites || [];
          websites.push(websiteInfo);
          chrome.storage.sync.set({ websites });
          renderWebsitesList(websites);
          websiteUrl.value = '';
          
          // Update the floating bar
          chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { 
              action: 'updateWebsites', 
              websites 
            });
          });
        });
      });
    });
    
    // Report issue
    reportIssueBtn.addEventListener('click', function() {
      chrome.tabs.create({ url: 'https://github.com/yourUsername/FloatHub/issues/new' });
    });
    
    function renderWebsitesList(websites) {
      websitesList.innerHTML = '';
      
      if (websites.length === 0) {
        websitesList.innerHTML = '<p class="empty-list">No websites added yet.</p>';
        return;
      }
      
      websites.forEach((website, index) => {
        const websiteItem = document.createElement('div');
        websiteItem.className = 'website-item';
        
        websiteItem.innerHTML = `
          <div class="website-info" title="${website.title || website.url}">
            <img src="${website.favicon || 'images/default-favicon.png'}" alt="" class="website-favicon">
            <div class="website-title">${website.title || website.url}</div>
          </div>
          <div class="website-actions">
            <button class="edit-btn" data-index="${index}">✏️</button>
            <button class="delete-btn" data-index="${index}">🗑️</button>
          </div>
        `;
        
        websitesList.appendChild(websiteItem);
      });
      
      // Add event listeners for edit and delete buttons
      document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
          const index = parseInt(this.dataset.index);
          editWebsite(index);
        });
      });
      
      document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
          const index = parseInt(this.dataset.index);
          deleteWebsite(index);
        });
      });
    }
    
    function editWebsite(index) {
      chrome.storage.sync.get(['websites'], function(result) {
        const websites = result.websites || [];
        const website = websites[index];
        
        if (!website) return;
        
        const newUrl = prompt('Edit website URL:', website.url);
        if (!newUrl) return;
        
        fetchWebsiteInfo(newUrl, function(websiteInfo) {
          websites[index] = websiteInfo;
          chrome.storage.sync.set({ websites });
          renderWebsitesList(websites);
          
          // Update the floating bar
          chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { 
              action: 'updateWebsites', 
              websites 
            });
          });
        });
      });
    }
    
    function deleteWebsite(index) {
      if (!confirm('Are you sure you want to remove this website?')) return;
      
      chrome.storage.sync.get(['websites'], function(result) {
        const websites = result.websites || [];
        websites.splice(index, 1);
        chrome.storage.sync.set({ websites });
        renderWebsitesList(websites);
        
        // Update the floating bar
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, { 
            action: 'updateWebsites', 
            websites 
          });
        });
      });
    }
    
    function fetchWebsiteInfo(url, callback) {
      // In a real extension, you would fetch the website title and favicon
      // For this example, we'll just use placeholder data
      const domain = new URL(url).hostname.replace('www.', '');
      const websiteInfo = {
        url: url,
        title: domain,
        favicon: `https://www.google.com/s2/favicons?domain=${domain}`
      };
      
      callback(websiteInfo);
    }
  });