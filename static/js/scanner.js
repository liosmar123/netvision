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
                // Try clipboard API first
                const text = await navigator.clipboard.readText();
                targetInput.value = text.trim();
                pasteButton.innerHTML = '<i class="fas fa-check mr-2"></i>Pasted';
                setTimeout(() => {
                    pasteButton.innerHTML = '<i class="fas fa-paste mr-2"></i>Paste';
                }, 1500);
            } catch (error) {
                console.log('Clipboard not available, showing manual input modal');
                showManualInputModal(targetInput);
                pasteButton.innerHTML = '<i class="fas fa-keyboard mr-2"></i>Manual';
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

function showManualInputModal(targetInput) {
    // Create modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.id = 'manualInputModal';
    modalOverlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    
    // Create modal content
    modalOverlay.innerHTML = `
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    <i class="fas fa-keyboard mr-2 text-blue-500"></i>
                    Manual Input
                </h3>
                <button id="closeModal" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Clipboard access is not available in HTTP environments. Please paste your IP address manually:
            </p>
            <textarea 
                id="manualInput" 
                class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none" 
                rows="3" 
                placeholder="Paste your IP address here..."
                autofocus
            ></textarea>
            <div class="flex justify-end space-x-3 mt-4">
                <button id="cancelInput" class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
                    Cancel
                </button>
                <button id="confirmInput" class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">
                    <i class="fas fa-check mr-2"></i>Apply
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modalOverlay);
    
    // Focus on textarea
    const textarea = document.getElementById('manualInput');
    setTimeout(() => textarea.focus(), 100);
    
    // Close modal function
    function closeModal() {
        document.body.removeChild(modalOverlay);
    }
    
    // Event listeners
    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.getElementById('cancelInput').addEventListener('click', closeModal);
    
    document.getElementById('confirmInput').addEventListener('click', function() {
        const inputValue = textarea.value.trim();
        if (inputValue) {
            targetInput.value = inputValue;
        }
        closeModal();
    });
    
    // Close on Escape key
    document.addEventListener('keydown', function handleEscape(e) {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', handleEscape);
        }
    });
    
    // Close on click outside
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
}