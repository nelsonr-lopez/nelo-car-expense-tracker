// Theme toggle functionality
document.addEventListener("DOMContentLoaded", () => {
  // Get the theme toggle button
  const themeToggle = document.getElementById("theme-toggle");

  // Function to set the theme
  function setTheme(theme) {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);

    // Update the button icon
    const sunIcon = document.getElementById("sun-icon");
    const moonIcon = document.getElementById("moon-icon");

    if (theme === "dark") {
      sunIcon.classList.add("hidden");
      moonIcon.classList.remove("hidden");
    } else {
      sunIcon.classList.remove("hidden");
      moonIcon.classList.add("hidden");
    }
  }

  // Initialize theme from localStorage or system preference
  const storedTheme = localStorage.getItem("theme");
  const systemPrefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;
  const initialTheme = storedTheme || (systemPrefersDark ? "dark" : "light");
  setTheme(initialTheme);

  // Add click event listener to the toggle button
  themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";
    setTheme(currentTheme === "dark" ? "light" : "dark");
  });
});
