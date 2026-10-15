// --- Configuration Data ---
const conversionData = {
    length: {
        base: 'meter',
        units: {
            meter: 1,
            kilometer: 1000,
            centimeter: 0.01,
            inch: 0.0254,
            foot: 0.3048,
            mile: 1609.34,
            yard: 0.9144
        }
    },
    weight: {
        base: 'kilogram',
        units: {
            kilogram: 1,
            gram: 0.001,
            pound: 0.453592,
            ounce: 0.0283495,
            ton: 1000
        }
    },
    temperature: {
        // Temperature requires custom formulas, not just multipliers
        base: 'celsius',
        units: ['celsius', 'fahrenheit', 'kelvin']
    }
};

// --- State ---
let currentCategory = 'length';
let history = [];

// --- DOM Elements ---
const fromValueInput = document.getElementById('from-value');
const toValueInput = document.getElementById('to-value');
const fromUnitSelect = document.getElementById('from-unit');
const toUnitSelect = document.getElementById('to-unit');
const tabs = document.querySelectorAll('.tab');
const swapBtn = document.getElementById('swap-btn');
const copyBtn = document.getElementById('copy-btn');
const clearBtn = document.getElementById('clear-btn');
const historyList = document.getElementById('history-list');
const themeToggle = document.getElementById('theme-toggle');

// --- Core Conversion Logic ---
function convertValue(value, fromUnit, toUnit, category) {
    if (isNaN(value) || value === '') return '';

    if (category === 'temperature') {
        return convertTemperature(value, fromUnit, toUnit);
    } else {
        const data = conversionData[category];
        // Convert from unit to base, then base to target unit
        const inBase = value * data.units[fromUnit];
        const result = inBase / data.units[toUnit];
        return result;
    }
}

// Special handling for Temperature
function convertTemperature(value, from, to) {
    let celsius;
    // Convert to Celsius first
    if (from === 'celsius') celsius = value;
    else if (from === 'fahrenheit') celsius = (value - 32) * (5/9);
    else if (from === 'kelvin') celsius = value - 273.15;

    // Convert from Celsius to target
    if (to === 'celsius') return celsius;
    if (to === 'fahrenheit') return (celsius * (9/5)) + 32;
    if (to === 'kelvin') return celsius + 273.15;
}

// --- UI Functions ---
function populateUnits() {
    const data = conversionData[currentCategory];
    const units = currentCategory === 'temperature' ? data.units : Object.keys(data.units);
    
    fromUnitSelect.innerHTML = '';
    toUnitSelect.innerHTML = '';

    units.forEach(unit => {
        const option1 = document.createElement('option');
        option1.value = unit;
        option1.textContent = unit.charAt(0).toUpperCase() + unit.slice(1);
        
        const option2 = option1.cloneNode(true);
        
        fromUnitSelect.appendChild(option1);
        toUnitSelect.appendChild(option2);
    });

    // Set defaults (e.g., meter to foot, celsius to fahrenheit)
    if (currentCategory === 'length') { fromUnitSelect.value = 'meter'; toUnitSelect.value = 'foot'; }
    if (currentCategory === 'weight') { fromUnitSelect.value = 'kilogram'; toUnitSelect.value = 'pound'; }
    if (currentCategory === 'temperature') { fromUnitSelect.value = 'celsius'; toUnitSelect.value = 'fahrenheit'; }
    
    performConversion();
}

function performConversion() {
    const val = parseFloat(fromValueInput.value);
    const fromUnit = fromUnitSelect.value;
    const toUnit = toUnitSelect.value;

    if (isNaN(val)) {
        toValueInput.value = '';
        return;
    }

    const result = convertValue(val, fromUnit, toUnit, currentCategory);
    
    // Advanced: Round to 6 decimal places to avoid floating point errors, then remove trailing zeros
    const roundedResult = Number(result.toFixed(6));
    toValueInput.value = roundedResult;

    addToHistory(val, fromUnit, roundedResult, toUnit);
}

// --- History Tracking ---
function addToHistory(fromVal, fromUnit, toVal, toUnit) {
    const text = `${fromVal} ${fromUnit} = ${toVal} ${toUnit}`;
    // Prevent duplicate consecutive entries
    if (history.length > 0 && history[0] === text) return;
    
    history.unshift(text);
    if (history.length > 5) history.pop(); // Keep only last 5

    renderHistory();
}

function renderHistory() {
    historyList.innerHTML = '';
    history.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        historyList.appendChild(li);
    });
}

// --- Event Listeners ---
tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
        tabs.forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        currentCategory = e.target.dataset.category;
        populateUnits();
    });
});

fromValueInput.addEventListener('input', performConversion);
fromUnitSelect.addEventListener('change', performConversion);
toUnitSelect.addEventListener('change', performConversion);

swapBtn.addEventListener('click', () => {
    const tempUnit = fromUnitSelect.value;
    fromUnitSelect.value = toUnitSelect.value;
    toUnitSelect.value = tempUnit;
    
    // Also swap values
    const tempVal = fromValueInput.value;
    fromValueInput.value = toValueInput.value;
    performConversion(); // Recalculate
});

clearBtn.addEventListener('click', () => {
    fromValueInput.value = '';
    toValueInput.value = '';
    fromValueInput.focus();
});

copyBtn.addEventListener('click', () => {
    if (!toValueInput.value) return;
    navigator.clipboard.writeText(toValueInput.value).then(() => {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        setTimeout(() => copyBtn.textContent = originalText, 1500);
    });
});

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    themeToggle.textContent = newTheme === 'light' ? '🌙' : '☀️';
});

// Initialize
populateUnits();