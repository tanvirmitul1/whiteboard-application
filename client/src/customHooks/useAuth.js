import { useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { setProfilePicture } from "../slices/authSlice";

const useAuth = () => {
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const imageUrl = localStorage.getItem("imageUrl");
  const userId = user?._id || null;
  const userName = user?.username || null;
  const role = user?.role || null;
  const image = user?.image || null;
  const isAdmin = useMemo(() => role === "Admin", [role]);
  useEffect(() => {
    dispatch(setProfilePicture(imageUrl));
  }, []);

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
