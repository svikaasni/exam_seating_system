const BASE_URL = "http://localhost:8080";

// ================= 🔐 AUTH =================
export const getAuthHeader = () => {
  const token = localStorage.getItem("auth");

  if (!token) {
    throw new Error("No auth token found ❌");
  }

  return {
    Authorization: "Basic " + token,
  };
};

// ================= 🔥 COMMON RESPONSE HANDLER =================
const handleResponse = async (res) => {

  if (res.status === 401) {
    localStorage.clear();
    alert("Session expired ❌ Please login again");
    window.location.reload();
    throw new Error("Unauthorized");
  }

  if (res.status === 409) {
    const msg = await res.text();
    throw new Error(msg || "Duplicate data ❌");
  }

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || "Something went wrong ❌");
  }

  return res;
};

// ================= 🎓 STUDENTS =================
export const uploadStudents = async (students) => {
  const res = await fetch(`${BASE_URL}/student/upload`, {
    method: "POST",
    headers: {
      ...getAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(students),
  });

  await handleResponse(res);
  return res.text();
};

// ================= 🪑 ALLOCATION =================
export const runAllocation = async (data) => {
  const res = await fetch(`${BASE_URL}/allocation/run`, {
    method: "POST",
    headers: {
      ...getAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  await handleResponse(res);

  const text = await res.text();

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

export const getAllAllocations = async () => {
  const res = await fetch(`${BASE_URL}/allocation/list`, {
    method: "GET",
    headers: getAuthHeader(),
  });

  await handleResponse(res);

  const text = await res.text();

  if (!text || text.trim() === "") return [];

  try {
    return JSON.parse(text);
  } catch {
    return [];
  }
};


// ================= 🔔 NOTIFICATIONS =================
export const getAllNotifications = async () => {
  const res = await fetch(`${BASE_URL}/notifications/all`, {
    method: "GET",
    headers: getAuthHeader(),
  });

  await handleResponse(res);
  return res.json();
};

export const getMyNotifications = async () => {
  const email = localStorage.getItem("username");

  if (!email) {
    throw new Error("User email not found ❌");
  }

  const res = await fetch(`${BASE_URL}/notifications/${email}`, {
    method: "GET",
    headers: getAuthHeader(),
  });

  await handleResponse(res);
  return res.json();
};

// ================= 📄 PDF =================
export const downloadPDF = async (examName) => {

  if (!examName) {
    throw new Error("Select exam ❌");
  }

  const res = await fetch(
    `${BASE_URL}/pdf/allocation?exam=${encodeURIComponent(examName)}`,
    {
      method: "GET",
      headers: getAuthHeader(),
    }
  );

  if (res.status === 404) {
    throw new Error("No allocations found ❌");
  }

  await handleResponse(res);

  const blob = await res.blob();

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = `${examName.replace(/\s+/g, "_")}.pdf`;

  document.body.appendChild(a);
  a.click();
  a.remove();
};

// ================= 📊 DASHBOARD =================
export const getDashboardStats = async () => {
  const res = await fetch(`${BASE_URL}/dashboard/stats`, {
    method: "GET",
    headers: getAuthHeader(),
  });

  await handleResponse(res);
  return res.json();
};

export default BASE_URL;