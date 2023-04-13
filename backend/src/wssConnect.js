// Buffett
// 對應前端
import { User, Case, Student } from './models/user.js';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken'
import cryptoJs from 'crypto-js';
import dotenv from "dotenv-defaults";
import {useState, useEffect} from 'react';

dotenv.config();
var NowUserID = "";

const sendData = (data, ws) => {
    ws.send(JSON.stringify(data));
}

const sendStatus = (payload, ws) => {
    sendData(["status", payload], ws);
}

const initUserData = async ({ me, password, email }, ws) => {
    let user = await User.findOne({ email })
    if (!user) {
        sendData(["createUser"], ws);
        var rePassword = cryptoJs.MD5(password);
        createUser(me, rePassword, email);
    } else {
        sendData(["emailExist"], ws);
    }
};

const initTeacherData = async (ws) => {
    sendData(["CreateTeacher"], ws);
    // create();
};

const initStudentData = async (ws) => {
    sendData(["CreateStudent"], ws);
    // create();
}

const initCaseData = async (ws) => {
    sendData(["CreateCase"], ws);
    // create();
}

const createCase = async () => {
    const newUser = new Case({
        id: uuidv4(),
        name: "羅小姐",
        date: Date.now(),
        phone: "0987654321",
        email: "philip@gmail.com",
        topic: "解題",
        way: "實體",
        teacherreq: "經濟系為佳",
        money: "500~600",
        content: "1、不要太虛榮 2、不要太強勢 3、不要太嬌蠻 4、不要太計較",
    });
    console.log("createCase")
    await newUser.save();
}

const createUser = async (name, password, email) => {
    const newUser = new User({
        id: uuidv4(),
        username: name,
        password: password,
        email: email,
        img: null,
        subject: null,
        place: null,
        department: null,
        teachyear: null,
        score: null,
        content: null
    });
    await newUser.save();
}

const createStudent = async () => {
    const newUser = new Student({
        id: uuidv4(),
        poster: "劉先生",
        subject: "數學",
        studentlevel: "大一",
        place: "台北市",
        postdate: Date.now(),
        money: "500~600",
        content: "1、不要太虛榮 2、不要太強勢 3、不要太嬌蠻 4、不要太計較",
        degree: "學習到微分",
        hopeContent: "微積分",
        long: "3Hr",
        frequency: "一週兩次",
    });
    console.log("createStudent")
    await newUser.save();
}

//登入後送token給前端
const sendToken = async (password, email, ws) => {
    var rePassword = cryptoJs.MD5(password);
    let user = await User.findOne({ email });
    // const {NowUserID, setNowUserID} = UseIDSave();

    if (!user) {
        sendData(["UserDoNotExist"], ws);
    } else {
        // setNowUserID(user.id);
        NowUserID = user.id;
        console.log("Now user id is:", NowUserID);
        if (user.password != rePassword) {
            sendData(["WrongPassword"], ws);
        } else {
            const token = jwt.sign(
                {
                    email: email,
                    username: user.username,
                    id: user.id
                }, process.env.SECRET, { expiresIn: '1 day' });
            sendData(["SignInSucuss", token], ws);
        }
    }
}

//檢查token是否授權
const isAuth = async (token, ws) => {
    if (!token) {
        sendData(["hasNoToken"], ws);
    } else {
        jwt.verify(token, process.env.SECRET, function (err, decoded) {
            if (err) {
                sendData(["WrongToken"], ws);
            } else {
                sendData(["correctToken"], ws);
            }
        })
    }
}

// use hook
const UseIDSave = () => {
    const [NowUserID, setNowUserID] = useState("");
    return [
      NowUserID,
      setNowUserID,
    ]
}
  
const addTeacher = async(payload, ws) => {
    // const { NowUserID, setNowUserID } = UseIDSave();
    const myteacherID = payload;
    console.log("addTeacher ID:", myteacherID);

    let user = await User.findOne({id: NowUserID});
    user.teacherID.push(myteacherID);
    user.save();
    console.log("users get from now user id", user); 
    sendData(["addedTeacher", myteacherID], ws);
}

const addStudent = async(payload, ws) => {
    const mystudentID = payload;
    console.log("addCase ID:", mystudentID);

    let user = await User.findOne({id: NowUserID});
    user.studentID.push(mystudentID);
    user.save();
    console.log("users get from now user id", user); 
    sendData(["addedStudent", mystudentID], ws);
}

const addCase = async(payload, ws) => {
    const mycaseID = payload;
    console.log("addCase ID:", mycaseID);

    let user = await User.findOne({id: NowUserID});
    user.caseID.push(mycaseID);
    user.save();
    console.log("users get from now user id", user); 
    sendData(["addedCase", mycaseID], ws);
}

export { isAuth, sendData, sendStatus, initUserData, initTeacherData, initStudentData, initCaseData, sendToken, UseIDSave, addTeacher, addStudent, addCase, createStudent };