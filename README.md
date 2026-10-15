# 🚀 Advanced Unit Converter Pro
A production-grade, highly scalable Unit Converter built with **Pure Vanilla JavaScript, HTML5, and CSS3**. This project goes beyond basic `if/else` conversions by implementing a **Base Unit Architecture**, dynamic UI generation, and modern UX features like Dark Mode and Live Conversion.

## 🔗 Project Links
*   **Live Demo:** [Insert your Live Demo Link here (e.g., GitHub Pages / Vercel)]
*   **GitHub Repository:** [Insert your GitHub Repo Link here]
*   **LinkedIn Post:** [Insert your LinkedIn Post Link here]

---

## ✨ Key Features

*   **Multiple Categories:** Supports Length, Weight, and Temperature conversions.
*   **Live Conversion:** Results update instantly as the user types (no submit button needed).
*   **Base Unit Architecture:** Built using a scalable mathematical strategy (converting to a base unit first, then to the target unit) making it easy to add new units without writing complex math.
*   **Custom Temperature Logic:** Handles temperature conversions (Celsius, Fahrenheit, Kelvin) using specific formulas instead of simple multipliers.
*   **Dark/Light Mode:** Built-in theme toggle that switches CSS variables for a seamless dark mode experience.
*   **Session History:** Tracks the last 5 conversions for quick reference.
*   **Utility Tools:** "Swap Units" button and "Copy to Clipboard" with visual feedback.
*   **Responsive UI:** Clean, modern, and fully responsive design using CSS Flexbox and Grid.

---

## 🧠 Architecture & Technical Decisions

This project was built with a focus on **Separation of Concerns** and **Scalability**:

1.  **Configuration Data Object:** All conversion factors are stored in a centralized `conversionData` object. 
    *   *Advantage:* Adding a new unit (e.g., "Yard" to Length) only requires adding one line to this object, without touching the core logic.
2.  **Base Unit Strategy:** To convert Unit A to Unit B, the logic converts Unit A to the Base Unit (e.g., Meter), and then from the Base Unit to Unit B. This reduces the complexity from O(n²) to O(1).
3.  **Custom Temperature Handling:** Temperature is an exception because it doesn't just use multipliers. The `convertTemperature()` function uses specific algebraic formulas to convert everything to Celsius first, then to the target unit.
4.  **Precision Math:** Uses `Number(result.toFixed(6))` to prevent JavaScript floating-point errors (like `0.1 + 0.2 = 0.30000000000000004`).
5.  **Dynamic DOM Manipulation:** Dropdowns are dynamically populated based on the selected category, preventing HTML clutter.

---

## 📁 Folder Structure

```text
unit-converter-pro/
│
├── index.html          # Main HTML structure and semantic layout
├── style.css           # Modern CSS with variables, Dark Mode, and animations
└── script.js           # Core logic, state management, and event listeners