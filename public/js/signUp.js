const signupFormHandler = async (event) => {
  event.preventDefault();

  const username = document.querySelector("#username-signup").value.trim();
  const password = document.querySelector("#password-signup").value.trim();

  console.log({ username, password }); // Log the data being sent

  if (username && password) {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        document.location.replace("/dashboard");
      } else {
        const errorData = await response.json();
        alert(`Error: ${response.statusText}, ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    }
  }
};

document
  .querySelector(".signup-form")
  .addEventListener("submit", signupFormHandler);
