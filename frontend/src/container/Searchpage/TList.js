//liu
import './List.css'
import { Modal, Row, Col, Button } from 'antd';
import { LightBrown, DarkBrown } from '../../constant/color';
import { SmileOutlined, FrownOutlined, StarOutlined, MessageOutlined, EllipsisOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { client, sendData } from '../../ws.js';
import TextArea from 'antd/lib/input/TextArea';
import 'antd/dist/antd.min.css'

const line = "solid"
const style = { padding: '8px 0', height: 250, width: "100%", borderRadius: 10, background: LightBrown };

//======= show list=========//
const datastyle = { width: "18%", height: 30, backgroundColor: DarkBrown, color: "white", textAlign: "center", borderRadius: 10, padding: 3 };

const UseTlist = () => {
    const [listData, setListData] = useState([]);
    /* for Modal */
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [Name, setName] = useState('');
    const [message, setMessage] = useState('');

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCanel = () => {
        setIsModalVisible(false);
    };


    const ModalMode = (
        <Modal title={"Send message to " + Name} visible={isModalVisible} onOk={handleOk} onCancel={handleCanel}>
            <TextArea
                style={{ height: "120px", fontSize: "15px" }}
                enterButton="Chat"
                value={message}
                onChange={(e) => { setMessage(e.target.value) }}
                // onSearch = { (msg) => {
                //   if(msg === ''){
                //     displayStatus({type : 'error', msg : 'Invalid username'});
                //   }
                //   else{
                //     let Found = false;
                //     for(let i = 0;i < panes.length;i++){
                //       if(panes[i].title === msg) Found = true;
                //     }
                //     if(!Found){
                //       add(msg);
                //       setMessage('');
                //       handleOk();
                //       displayStatus({type : 'success', msg : 'Successfully send!'});
                //     }
                //     else{
                //       displayStatus({type : 'error', msg : 'Send fail'});
                //     }
                //   }
                // }}
                placeholder="老師您好，我有家教需求..."
            ></TextArea>
        </Modal>
    )

    // getTeacherData();   // get the data first


    client.onmessage = async (byteString) => {
        const { data } = byteString;
        const [task, payload] = JSON.parse(data);
        switch (task) {
            // 對應後端
            case 'loadedTeacher': {  // load teacher data
                // listData = []; // init the data
                console.log("payload data is:", payload);
                var filterlistData = payload.filter((item) => {
                    return item.subject != null;       // 不是空的
                });
                setListData(filterlistData);
                console.log("listData is:", listData);
                break;
            }
            default: break;
        }
    }


    return (
        <Row gutter={16} style={{ padding: 20 }}>{
            listData.map((item) => {

                return (
                    <Col className="gutter-row" span={12} style={{ padding: 10 }} >
                        {ModalMode}
                        <Row style={style}>
                            <Col span={8} style={{ padding: 10, display: 'flex', alignItems: 'center' }}>
                                <img className='teacherPic' src={item.img} style={{ display: 'center', width: "100%", height: "100%" }}></img>
                            </Col>
                            <Col span={16}>
                                <div gutter={16} style={{ padding: 10, width: "100%", display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                                    <div span={4} style={datastyle}>{item.subject}</div>
                                    <div span={4} style={datastyle}>{item.teachyear}</div>
                                    <div span={4} style={datastyle}>{item.department}</div>
                                    <div span={4} style={{ width: "15%" }}></div>
                                    <Button span={4} style={{ width: "10%", height: 30, backgroundColor: DarkBrown, color: "white", textAlign: "center", borderRadius: 10, padding: 3, borderColor: LightBrown }} onClick={() => { sendData(["loadFullTeacher", item.id]) }}><Link to="/TeacherCard"><EllipsisOutlined /></Link></Button>
                                </div>
                                <div className='intro' style={{ padding: 10, height: '57%', width: "100%" }}>{item.content}</div>
                                <div gutter={16} style={{ padding: 10, width: "100%", display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                                    <Button span={4} style={{ width: "18%", height: 30, backgroundColor: DarkBrown, color: "white", textAlign: "center", borderRadius: 10, padding: 3 }} onClick={() => { sendData(["addTeacher", item.id]) }}>Like  <SmileOutlined /></Button>
                                    <Button span={4} style={{ width: "22%", height: 30, backgroundColor: DarkBrown, color: "white", textAlign: "center", borderRadius: 10, padding: 3 }}>DisLike  <FrownOutlined rotate={180} /></Button>
                                    <Button span={4} style={{ width: "20%", height: 30, backgroundColor: DarkBrown, color: "white", textAlign: "center", borderRadius: 10, padding: 3 }}>評分  <StarOutlined /></Button>
                                    <Button span={4} onClick={() => { setName(item.username); showModal(); }} style={{ width: "20%", height: 30, backgroundColor: DarkBrown, color: "white", textAlign: "center", borderRadius: 10, padding: 3 }}>聊聊  <MessageOutlined /></Button>
                                </div>
                            </Col>
                        </Row>
                    </Col>

                )
            }
            )}
        </Row>
    )
}

export default UseTlist;
