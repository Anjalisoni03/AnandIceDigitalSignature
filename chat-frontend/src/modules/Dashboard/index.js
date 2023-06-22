import { useEffect, useRef, useState } from "react";
import Input from "../../components/Input";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import Logout from "../../components/dropDown";
import Header from "../../components/header";
import RecentChat from "../recentChat";
import FileMessage from "../../components/fileMessage";

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user:detail"));
  const { id, fullName, email } = user;

  const [selectedImage, setSelectedImage] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({});
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const messageRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    setSocket(io("http://localhost:8080"));
  }, []);

  useEffect(() => {
    socket?.emit("addUser", id);
    socket?.on("getUsers", (users) => {
      //   console.log("activeUsers :>> ", users);
    });
    socket?.on("getMessage", (data) => {
      setMessages((prev) => ({
        ...prev,
        messages: [
          ...prev.messages,
          { user: data.user, message: data.message },
        ],
      }));
    });
  }, [socket, id]);

  useEffect(() => {
    messageRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages?.messages]);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user:detail"));
    const { id } = loggedInUser;
    const fetchConversations = async () => {
      const res = await fetch(`http://localhost:8000/api/conversations/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const resData = await res.json();
      setConversations(resData);
    };
    fetchConversations();
  }, [id]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch(`http://localhost:8000/api/users/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const resData = await res.json();
      setUsers(resData);
    };
    fetchUsers();
  }, [id]);

  const fetchMessages = async (conversationId, receiver) => {
    const res = await fetch(
      `http://localhost:8000/api/message/${conversationId}?senderId=${id}&&receiverId=${receiver?.receiverId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const resData = await res.json();
    // console.log(resData, "resData of message");
    setMessages({ messages: resData, receiver, conversationId });
  };

  const sendMessage = async ({ messageType }) => {
    // e.preventDefault();
    setMessage("");
    const data = {
      senderId: id,
      receiverId: messages?.receiver?.receiverId,
      message: message || selectedImage?.name,
      messageType,
      conversationId: messages?.conversationId,
    };
    console.log(data, "data");

    socket?.emit("sendMessage", data);

    await fetch(`http://localhost:8000/api/message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    window.location.reload();
  };

  const logoutHandler = () => {
    localStorage.clear();
    navigate("/users/sign_in");
  };

  console.log(messages, "messages");

  useEffect(() => {
    if (selectedImage) {
      sendMessage({ messageType: "file" });
    }
  }, [selectedImage]);

  return (
    <div className="w-screen flex">
      <div className="md:w-[25%] h-screen bg-secondary overflow-scroll">
        <div className="flex items-center my-4 justify-around ">
          <Header {...{ fullName, email }} />
          <Logout logoutHandler={logoutHandler} />
        </div>
        <hr />
        <RecentChat
          text={"Recent chats"}
          data={conversations}
          fetchMessages={fetchMessages}
          activeUser={messages?.receiver?.email}
        />
        <RecentChat
          text={"People"}
          data={users}
          fetchMessages={fetchMessages}
        />
      </div>
      <div className="w-[75%] h-screen bg-white flex flex-col items-center">
        {messages?.receiver?.fullName && (
          <div className="w-[100%] bg-white border-b-2 border-b-slate-200 h-[80px] flex items-center px-14 py-2 ">
            <div className="cursor-pointer">
              <img
                src="https://th.bing.com/th/id/OIP._BXCcqxwmsduYNCJj2XDtgHaHa?pid=ImgDet&rs=1"
                alt="profile"
                width={60}
                height={60}
                className="rounded-full"
              />
            </div>
            <div className="ml-6 mr-auto">
              <h3 className="text-lg">{messages?.receiver?.fullName}</h3>
              <p className="text-sm font-light text-gray-600">
                {messages?.receiver?.email}
              </p>
            </div>
            <div className="cursor-pointer">
              <img src="icons/call.svg" alt="call"></img>
            </div>
          </div>
        )}
        <div
          className={` ${
            messages?.messages && "h-[75%]"
          } w-full overflow-scroll`}
        >
          <div className="p-14">
            {messages?.messages?.length > 0 ? (
              <>
                {messages.messages.map(
                  ({ message, messageType, user: { id } = {} }, index) => {
                    const isActive = id === user?.id;
                    return (
                      <div key={index}>
                        {messageType === "text" ? (
                          <>
                            <div
                              className={`max-w-[70%] w-fit rounded-b-xl p-4 mb-2 ${
                                isActive
                                  ? "bg-primary text-white rounded-tl-xl ml-auto"
                                  : "bg-secondary rounded-tr-xl"
                              } `}
                            >
                              {message}
                            </div>
                            <div ref={messageRef}></div>
                          </>
                        ) : (
                          <FileMessage {...{ message, isActive }} />
                        )}
                      </div>
                    );
                  }
                )}
                {selectedImage && <FileMessage message={selectedImage?.name} />}
              </>
            ) : (
              <>
                {!messages?.receiver?.fullName && (
                  <>
                    <Header width={90} height={90} fullName={fullName} />
                    <div className="text-lg font-semibold grid justify-center">
                      <img
                        src="/images/InkedchatImage.jpg"
                        alt="start chat"
                        className="w-96 h-96"
                      ></img>
                      <div className="justify-center flex">
                        Share and verify documents
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
        {messages?.receiver?.fullName && (
          <div className="py-0 pt-4 pb-0 w-full flex items-center justify-center">
            <Input
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-[75%]"
              inputClassName="p-4 border-0 shadow-md rounded-full bg-light focus:ring-0 focus:border-0 outline-none"
            />
            <div
              className={`ml-4 p-2 cursor-pointer bg-light rounded-full ${
                !message && "pointer-events-none"
              }`}
              onClick={() => sendMessage({ messageType: "text" })}
            >
              <img src="/icons/send.svg" alt="send" />
            </div>
            <div className="ml-4 p-2 cursor-pointer bg-light rounded-full">
              <div class="image-upload">
                <label htmlFor="file-input">
                  <img
                    src="/icons/plus.svg"
                    alt="plus"
                    className="cursor-pointer"
                  />
                </label>
                <input
                  id="file-input"
                  type="file"
                  onChange={(event) => {
                    setSelectedImage(event.target.files[0]);
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
