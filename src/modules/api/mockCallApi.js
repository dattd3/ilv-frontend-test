export const demoCallApi = (...params) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(`demo api ${params.join(" - ")}`), 200);
  });
};

export const getPermissions = () => {
  return new Promise((resolve, reject) => {
    setTimeout(
      () =>
        resolve({
          BaseAction: true,
          ExtraAction: true
        }),
      200
    );
  });
};

export const signinApi = (username, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username === "1" && password === "1") {
        return resolve("hi, 1");
      }
      reject("wrong username or password");
    }, 200);
  });
};
