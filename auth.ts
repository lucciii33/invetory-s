export const getAuthToken = (): string => {
  const user = localStorage.getItem("user2");
  const token = user ? JSON.parse(user).token : null;

  if (!token) throw new Error("No auth token found");
  return token;
};

export const getAuthUser= (): string => {
  const user = localStorage.getItem("user2");
  const id = user ? JSON.parse(user)._id : null;

  if (!id) throw new Error("No auth user found");
  return id;
};