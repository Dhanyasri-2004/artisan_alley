export const login = async (email, password) => {
  try {
    const response = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.error || "Invalid email or password");
    }

    return responseData;
  } catch (error) {
    throw new Error(error.message || "Something went wrong.");
  }
};

export const signup = async (formData) => {
  try {
    const response = await fetch("http://localhost:8080/api/user/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const responseData = await response.json(); // Get response body

    if (!response.ok) {
      throw new Error(responseData.error || "Signup failed. Please try again.");
    }

    return responseData; // Return successful response
  } catch (error) {
    throw new Error(error.message || "Something went wrong.");
  }
};
