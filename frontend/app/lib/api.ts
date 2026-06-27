"use client";

import axios from "axios";
import { clientAuth } from "./firebaseClient";

export const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    const currentUser = clientAuth?.currentUser;

    if (currentUser) {
      const token = await currentUser.getIdToken(true);
      config.headers.set("Authorization", `Bearer ${token}`);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

