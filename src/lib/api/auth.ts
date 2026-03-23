import axiosSecure from "../axiosSecure";

export const registerUser = async (data: unknown) => {
  const res = await axiosSecure.post("/users/register", data);
  return res.data;
};

export const loginUser = async (data: unknown) => {
  const res = await axiosSecure.post("/users/login", data);
  return res.data;
};