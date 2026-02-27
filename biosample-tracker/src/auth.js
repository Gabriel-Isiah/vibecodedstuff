export const USERS_KEY = "biosample_users";
export const CURRENT_USER_KEY = "biosample_currentUser";

// Seed some default users the first time if none exist
export function ensureSeedUsers() {
  try {
    const existing = localStorage.getItem(USERS_KEY);
    if (existing) return;

    const seed = [
      { email: "user@example.com", password: "password123", role: "user" },
      {
        email: "researcher@example.com",
        password: "password123",
        role: "researcher",
      },
      { email: "admin@example.com", password: "password123", role: "admin" },
    ];

    localStorage.setItem(USERS_KEY, JSON.stringify(seed));
  } catch (err) {
    console.error("Failed to seed users in localStorage", err);
  }
}

export function getUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to read users from localStorage", err);
    return [];
  }
}

export function saveUsers(users) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (err) {
    console.error("Failed to save users to localStorage", err);
  }
}

export function setCurrentUser(user) {
  try {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } catch (err) {
    console.error("Failed to set current user", err);
  }
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to read current user", err);
    return null;
  }
}

export function clearCurrentUser() {
  try {
    localStorage.removeItem(CURRENT_USER_KEY);
  } catch (err) {
    console.error("Failed to clear current user", err);
  }
}

