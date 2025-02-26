import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { setProfilePicture, setUser } from "../slices/authSlice";

const useAuth = () => {
  const dispatch = useDispatch();

  // Get data from localStorage
  const user = JSON.parse(localStorage.getItem("user")) || null;
  const token = localStorage.getItem("token") || null;
  const imageUrl = localStorage.getItem("imageUrl") || null;

  // Extract user details
  const userId = user?._id || null;
  const userName = user?.username || null;
  const role = user?.role || null;
  const image = user?.image || null;
  const isAdmin = useMemo(() => role === "Admin", [role]);

  // Dispatch to Redux **immediately**
  dispatch(setProfilePicture(imageUrl));
  dispatch(setUser(user));

  return {
    user,
    userId,
    userName,
    role,
    isAdmin,
    token,
    image,
  };
};

export default useAuth;
