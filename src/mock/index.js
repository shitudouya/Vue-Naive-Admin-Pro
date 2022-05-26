import { randomNumberInRange } from "@/utils";

const ms = randomNumberInRange(500, 1000);

export const mockTempToken = (info) => {
  const { username, password } = info;
  return new Promise((resolve) => {
    setTimeout(() => {
      if (username === "admin" && password === "123") {
        resolve({
          code: 200,
          msg: "success",
          data: "token_admin",
        });
      } else if (username === "user" && password === "123") {
        resolve({
          code: 200,
          msg: "success",
          data: "token_user",
        });
      } else {
        resolve({
          code: 400,
          msg: "用户名或者密码错误",
        });
      }
    }, ms);
  });
};

export const mockTempPermission = (token) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (token === "token_admin") {
        resolve({
          code: 200,
          msg: "success",
          data: {
            username: "R-Admin",
            permissions: ["Permission-Admin", "Permission-User"],
          },
        });
      } else if (token === "token_user") {
        resolve({
          code: 200,
          msg: "success",
          data: {
            username: "R-User",
            permissions: ["Permission-User"],
          },
        });
      } else {
        resolve({
          code: 401,
          msg: "token失效",
          data: null,
        });
      }
    }, ms);
  });
};
