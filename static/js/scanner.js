// Web Port Scanner JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
    initializeIPButtons();
    initializeTheme();
});

function initializeForm() {
    const form = document.getElementById('scanForm');
    if (form) {
        form.addEventListener('submit', function() {
            showLoadingOverlay();
        });
    }
}

function initializeIPButtons() {
    const refreshButton = document.getElementById('refreshPublicIP');
    const localIPButton = document.getElementById('useLocalIP');
    const pasteButton = document.getElementById('pasteIP');
    const targetInput = document.getElementById('target');
    
    if (refreshButton && targetInput) {
        refreshButton.addEventListener('click', async function() {
            const originalContent = refreshButton.innerHTML;
            refreshButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Loading...';
            refreshButton.disabled = true;
            try {
                const response = await fetch('/api/public-ip');
                const data = await response.json();
                targetInput.value = data.ip;
            } catch (error) {
                console.error('Error fetching public IP:', error);
            }
            refreshButton.innerHTML = '<i class="fas fa-globe mr-2"></i>Public IP';
            refreshButton.disabled = false;
        });
    }
    
    if (localIPButton && targetInput) {
        localIPButton.addEventListener('click', async function() {
            const originalContent = localIPButton.innerHTML;
            localIPButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Loading...';
            localIPButton.disabled = true;
            try {
                const response = await fetch('/api/local-ip');
                const data = await response.json();
                targetInput.value = data.ip;
            } catch (error) {
                console.error('Error fetching local IP:', error);
            }
            localIPButton.innerHTML = '<i class="fas fa-home mr-2"></i>Local IP';
            localIPButton.disabled = false;
        });
    }
    
    if (pasteButton && targetInput) {
        pasteButton.addEventListener('click', async function() {
            const originalContent = pasteButton.innerHTML;
            try {
                const text = await navigator.clipboard.readText();
                targetInput.value = text.trim();
                pasteButton.innerHTML = '<i class="fas fa-check mr-2"></i>Pasted';
                setTimeout(() => {
                    pasteButton.innerHTML = '<i class="fas fa-paste mr-2"></i>Paste';
                }, 1500);
            } catch (error) {
                console.error('Error reading clipboard:', error);
                pasteButton.innerHTML = '<i class="fas fa-exclamation mr-2"></i>Error';
                setTimeout(() => {
                    pasteButton.innerHTML = '<i class="fas fa-paste mr-2"></i>Paste';
                }, 1500);
            }
        });
    }
}

function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const html = document.documentElement;
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.classList.toggle('dark', savedTheme === 'dark');
    updateThemeIcon(savedTheme);
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const isDark = html.classList.contains('dark');
            const newTheme = isDark ? 'light' : 'dark';
            
            html.classList.toggle('dark', newTheme === 'dark');
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }
    
    function updateThemeIcon(theme) {
        if (themeIcon) {
            themeIcon.className = theme === 'dark' ? 'fas fa-moon text-slate-700 dark:text-slate-300' : 'fas fa-sun text-slate-700 dark:text-slate-300';
        }
    }
}

function showLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.remove('hidden');
    }
}

function toggleAdvancedOptions() {
    const advancedOptions = document.getElementById('advancedOptions');
    const advancedChevron = document.getElementById('advancedChevron');
    
    if (advancedOptions && advancedChevron) {
        if (advancedOptions.classList.contains('hidden')) {
            advancedOptions.classList.remove('hidden');
            advancedChevron.classList.add('rotate-180');
        } else {
            advancedOptions.classList.add('hidden');
            advancedChevron.classList.remove('rotate-180');
        }
    }
}

function setQuickPort(ports) {
    const portField = document.getElementById('port_range');
    if (portField) {
        portField.value = ports;
    }
}