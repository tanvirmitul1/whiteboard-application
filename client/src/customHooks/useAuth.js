import { useMemo } from "react";

const useAuth = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const userId = user?._id || null;
  const userName = user?.username || null;
  const role = user?.role || null;

  const isAdmin = useMemo(() => role === "Admin", [role]);

  return {
    user,
    userId,
    userName,
    role,
    isAdmin,
    token,
  };
};

export default useAuth;
