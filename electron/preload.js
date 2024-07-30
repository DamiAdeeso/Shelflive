const { contextBridge, ipcRenderer } = require("electron");
const channel = {
  LOGIN: "login",
  SIGNUP: "signup",
  ADD_CATEGORY: "add:category",
  GET_CATEGORIES: "get:categories",
  ADD_ITEM: "add:item",
  GET_ITEMS: "get:items",
  DELETE_ITEM: "delete:item",
  GET_ARCHIVES: "get:archives",
  EDIT_ITEM: "edit:item",
  GET_HISTORY: "get:history",
  GET_INFO: "get:info",
  GET_USERS: "get:users",
  DELETE_USER: "delete:user",
  VERIFY_USER: "verify:user",
  GET_EXP: "get:exp",
  ADD_EXP: "add:exp",
  ADD_STUDENT: "add:student",
  EDIT_STUDENT: "edit:student",
  DELETE_STUDENT: "delete:student",
};

contextBridge.exposeInMainWorld("api", {
  auth: {
    login: function (data) {
      return ipcRenderer.invoke(channel.LOGIN, data);
    },
    signup: function (data) {
      return ipcRenderer.invoke(channel.SIGNUP, data);
    },
  },
  category: {
    add: function (data) {
      return ipcRenderer.invoke(channel.ADD_CATEGORY, data);
    },
    get: function (data) {
      return ipcRenderer.invoke(channel.GET_CATEGORIES, data);
    },
  },
  inventory: {
    add: function (data) {
      return ipcRenderer.invoke(channel.ADD_ITEM, data);
    },
    getAll: function (data) {
      return ipcRenderer.invoke(channel.GET_ITEMS, data);
    },
    editItem: function (data) {
      return ipcRenderer.invoke(channel.EDIT_ITEM, data);
    },
    delete: function (data) {
      return ipcRenderer.invoke(channel.DELETE_ITEM, data);
    },
    getArchives: function (data) {
      return ipcRenderer.invoke(channel.GET_ARCHIVES, data);
    },
    getInfo: function (data) {
      return ipcRenderer.invoke(channel.GET_INFO, data);
    },
  },
  history: {
    getAll: function (data) {
      return ipcRenderer.invoke(channel.GET_HISTORY, data);
    },
  },
  users: {
    getUsers: function (data) {
      return ipcRenderer.invoke(channel.GET_USERS, data);
    },
    deleteUser: function (data) {
      return ipcRenderer.invoke(channel.DELETE_USER, data);
    },
    editUser: function (data) {
      return ipcRenderer.invoke(channel.VERIFY_USER, data);
    },
  },
  exp: {
    getExp: function (data) {
      return ipcRenderer.invoke(channel.GET_EXP, data);
    },
    addExp: function (data) {
      return ipcRenderer.invoke(channel.ADD_EXP, data);
    },
    addStudent: function (data) {
      return ipcRenderer.invoke(channel.ADD_STUDENT, data);
    },
    editStudent: function (data) {
      return ipcRenderer.invoke(channel.EDIT_STUDENT, data);
    },
    deleteStudent: function (data) {
      return ipcRenderer.invoke(channel.DELETE_STUDENT, data);
    },
  },
});
