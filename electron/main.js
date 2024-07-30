const path = require("path");

const { app, BrowserWindow, dialog } = require("electron");
const isDev = require("electron-is-dev");
const { ipcMain } = require("electron/main");
const { channel } = require("./constants");
const { default: mongoose } = require("mongoose");

// data base functions
const userDB = require("../DataBase/Functions/usersFun");
const inventoryDB = require("../DataBase/Functions/inventoryFun");
const categoryDB = require("../DataBase/Functions/categoryFun");
const historyFun = require("../DataBase/Functions/historyFun");
const expFun = require("../DataBase/Functions/experimentFun");

// window init
let win = null;

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    show: false,
  });

  // and load the index.html of the app.
  // win.loadFile("index.html");
  win.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
}

// add mongo db connection
mongoose.set("strictQuery", true);
mongoose.connect(
  isDev
    ? "mongodb://localhost:27017/dammy-test"
    : "mongodb://localhost:27017/dammy",
  async (err) => {
    if (err)
      return dialog.showErrorBox(
        `DB connexion probleme occured !`,
        err.message
      );

    // console log that the connexion to the DB is established
    console.log("mongoDB connected...");

    // add admin if no admin found
    await userDB.addAdmin();

    // Open the DevTools.
    if (isDev) {
      win.webContents.openDevTools({ mode: "detach" });
    }

    // set visible when it's finish loading
    win.webContents.on("did-finish-load", () => {
      win.show();
    });
  }
);

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

//* IPCMAIN FUNCTIONS
//? login function
ipcMain.handle(channel.LOGIN, async (e, args) => {
  return await userDB.verifyUser(args);
});

//? sign up function
ipcMain.handle(channel.SIGNUP, async (e, args) => {
  return await userDB.addUser(args);
});

//? add category function
ipcMain.handle(channel.ADD_CATEGORY, async (e, args) => {
  // check if user exists and return all his information
  const result = JSON.parse(await userDB.checkUser(args.userID));

  // return an error if the user was not authenticated
  if (result.err) return JSON.stringify(result);

  // return the result if everything goes well
  return await categoryDB.addCategory(args, result.result);
});

//? get categories
ipcMain.handle(channel.GET_CATEGORIES, async (e, args) => {
  const result = JSON.parse(await userDB.checkUser(args));
  if (result.err) return JSON.stringify(result);

  return await categoryDB.getCategories();
});

//? add item
ipcMain.handle(channel.ADD_ITEM, async (e, args) => {
  const result = JSON.parse(await userDB.checkUser(args.userID));
  if (result.err) return JSON.stringify(result);

  // add to history data base
  const item = JSON.parse(await inventoryDB.addItem(args));
  if (item.err) return JSON.stringify(item);
  const historyResult = JSON.parse(
    await historyFun.addToHistory(
      args.userID,
      item.result._id,
      `added ${args.quantity}`,
      "add",
      { after: item.result }
    )
  );
  if (historyResult.err) return JSON.stringify(historyResult);

  return JSON.stringify(item);
});

//? get items
ipcMain.handle(channel.GET_ITEMS, async (e, args) => {
  const result = JSON.parse(await userDB.checkUser(args));
  if (result.err) return JSON.stringify(result);

  return await inventoryDB.getItems();
});

//? edit item
ipcMain.handle(channel.EDIT_ITEM, async (e, args) => {
  // check user
  const user = JSON.parse(await userDB.checkUser(args.userID));
  if (user.err) return JSON.stringify(user);

  // edit item and get item before modification
  const itemBefore = JSON.parse(await inventoryDB.editItem(args.itemID, args));
  if (itemBefore.err) return JSON.stringify(itemBefore);

  // get item after modification
  const itemAfter = JSON.parse(await inventoryDB.getItem(args.itemID, true));
  if (itemAfter.err) return JSON.stringify(itemAfter);

  // add every thing to the history
  const history = JSON.parse(
    await historyFun.addToHistory(
      args.userID,
      args.itemID,
      "edited",
      "modification",
      {
        after: itemAfter.result,
        before: itemBefore.result,
      }
    )
  );
  if (history.err) return JSON.stringify(history);

  // get the item correctly
  const item = JSON.parse(await inventoryDB.getItem(args.itemID, false));
  if (item.err) return JSON.stringify(item);

  // return the result
  return JSON.stringify(item);
});

//? delete item
ipcMain.handle(channel.DELETE_ITEM, async (e, args) => {
  // check if user exists
  const result = JSON.parse(await userDB.checkUser(args.userID));
  if (result.err) return JSON.stringify(result);

  // delete the item
  const item = JSON.parse(
    await inventoryDB.deleteItem(args._id, result.result.role)
  );
  if (item.err) return JSON.stringify(item);

  // add the event to history document
  const history = JSON.parse(
    await historyFun.addToHistory(
      result.result._id,
      item.result._id,
      `deleted`,
      "archive",
      { before: item.result }
    )
  );
  if (history.err) return JSON.stringify(history);

  // return the result if no error found
  return JSON.stringify(item);
});

//? get archives
ipcMain.handle(channel.GET_ARCHIVES, async (e, userID) => {
  const user = JSON.parse(await userDB.checkUser(userID));
  if (user.err) return JSON.stringify(user);

  return await inventoryDB.getArchives(user.result.role);
});

//? get history
ipcMain.handle(channel.GET_HISTORY, async (e, args) => {
  const user = JSON.parse(await userDB.checkUser(args.userID));
  if (user.err) return JSON.stringify(user);

  const history = JSON.parse(
    await historyFun.getHistory(user.result.role, args.match)
  );
  if (history.err) return JSON.stringify(history);

  return JSON.stringify(history);
});

//? get Info
ipcMain.handle(channel.GET_INFO, async (e, args) => {
  const user = JSON.parse(await userDB.checkUser(args));
  if (user.err) return JSON.stringify(user);

  return await inventoryDB.getInformation();
});

//? get users
ipcMain.handle(channel.GET_USERS, async (e, args) => {
  const user = JSON.parse(await userDB.checkUser(args));
  if (user.err) return JSON.stringify(user);
  return await userDB.getUsers(user.result.role, user.result._id);
});

//? delete users
ipcMain.handle(channel.DELETE_USER, async (e, args) => {
  const user = JSON.parse(await userDB.checkUser(args.admin));
  if (user.err) return JSON.stringify(user);

  return await userDB.deleteUser(user.result.role, args.user);
});

//? verify user by admin
ipcMain.handle(channel.VERIFY_USER, async (e, args) => {
  const user = JSON.parse(await userDB.checkUser(args.admin));
  if (user.err) return JSON.stringify(user);

  return await userDB.editUser(user.result.role, args.user);
});

//? add experiment
ipcMain.handle(channel.ADD_EXP, async (e, args) => {
  const user = JSON.parse(await userDB.checkUser(args.userID));
  if (user.err) return JSON.stringify(user);

  return await expFun.addExperiment(args.data);
});

//? get experiment
ipcMain.handle(channel.GET_EXP, async (e, args) => {
  const user = JSON.parse(await userDB.checkUser(args));
  if (user.err) return JSON.stringify(user);

  return await expFun.getExperiment();
});

//? add student
ipcMain.handle(channel.ADD_STUDENT, async (e, args) => {
  const user = JSON.parse(await userDB.checkUser(args.userID));
  if (user.err) return JSON.stringify(user);

  return await expFun.addStudent(args.data);
});

//? edit student
ipcMain.handle(channel.EDIT_STUDENT, async (e, args) => {
  const user = JSON.parse(await userDB.checkUser(args.userID));
  if (user.err) return JSON.stringify(user);

  return await expFun.editStudent(args.data, args.studentID);
});

//? delete student
ipcMain.handle(channel.DELETE_STUDENT, async (e, args) => {
  const user = JSON.parse(await userDB.checkUser(args.userID));
  if (user.err) return JSON.stringify(user);

  return await expFun.deleteStudent(args.studentID);
});
