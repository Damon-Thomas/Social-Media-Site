"use client";

export async function logout() {
  try {
    // Call the logout API route to delete the session
    const response = await fetch("/api/auth/logout", { method: "POST" });

    if (!response.ok) {
      console.error("Failed to logout on the server.");
      return;
    }

    // Redirect the user to the login page
    window.location.replace("/"); // Forces a full reload, ensuring cookies are sent
  } catch (error) {
    console.error("Failed to logout:", error);
  }
}
