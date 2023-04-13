// Buffett
// import WebSocket from "ws";
// import bcrypt from "bcryptjs";

import { WebSocketServer } from 'ws';
import express from "express";
import mongoose from "mongoose";
import http from "http";
import dotenv from "dotenv-defaults";
import { User, Case, Student } from "./models/user.js";
import { isAuth, sendToken, sendData, sendStatus, initUserData, initTeacherData, initStudentData, initCaseData, addTeacher, addStudent, addCase, createStudent } from './wssConnect.js';
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';

dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", (err) => console.log(err));



// write it here
db.once("open", async () => {
  console.log('MongoDB connected!');
  // wss -> server side, ws -> client side
  wss.on('connection', async (ws) => {
    if (ws.OPEN) console.log("ws open!");
    ws.onmessage = async (byteString) => {

      const { data } = byteString;
      const [task, payload] = JSON.parse(data);
      console.log("onmessage task:", task, "onmessage payload:", payload);

      switch (task) {
        case 'loadTeacher': {
          console.log("loading all the teachers' data");
          // initTeacherData(ws);
          let teacher = await User.find({});
          sendData(["loadedTeacher", teacher], ws);
          break;
        }
        case 'loadStudent': {
          // createStudent();
          // initStudentData(ws);
          console.log("loading all the students' data");
          let student = await Student.find({});
          sendData(["loadedStudent", student], ws);
          break;
        }
        case 'loadCase': {
          console.log("loading all the case data");
          let mycase = await Case.find({});
          sendData(["loadedCase", mycase], ws);
          break;
        }
        case 'loadFullTeacher': {
          let teacher = await User.findOne({ id: payload });
          console.log("loading full teacher data:", teacher);
          sendData(["loadedFullTeacher", teacher], ws);
          break;
        }
        case 'loadFullStudent': {
          let student = await Student.findOne({ id: payload });
          console.log("loading full student data:", student);
          sendData(["loadedFullStudent", student], ws);
          break;
        }
        case 'loadFullCase': {
          let mycase = await Case.findOne({ id: payload });
          console.log("loading full case data:", mycase);
          sendData(["loadedFullCase", mycase], ws);
          break;
        }
        case 'createUser': {
          const { me, password, email } = payload;
          console.log("create User:", payload);
          initUserData({ me, password, email }, ws);
          break;
        }
        case 'signIn': {
          const { password, email } = payload;
          console.log("signIn:", payload);
          sendToken(password, email, ws);
          break;
        }
        case 'isAuth': {
          isAuth(payload, ws);
          break;
        }
        case 'addTeacher':{
          addTeacher(payload, ws);
          break;
        }
        case 'addStudent':{
          addStudent(payload, ws);
          break;
        }
        case 'addCase': {
          addCase(payload, ws);
          break;
        }

        default: break;
      }

    }

  });


  const PORT = process.env.port || 4000;
  server.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
  });
})
