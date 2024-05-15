import api from "./api";

const common = {
  getShortUrls: () => api.get("/getdata"),
  addShorlURls: (data) => api.post("/shortUrls", data),
};

export { common };
