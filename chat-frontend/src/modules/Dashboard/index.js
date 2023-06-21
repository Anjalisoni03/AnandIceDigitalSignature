import { useEffect, useRef, useState } from "react";
import Input from "../../components/Input";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import Logout from "../../components/dropDown";
import Header from "../../components/header";

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
    console.log(resData,"resData of message");
    setMessages({ messages: resData, receiver, conversationId });
  };

  const sendMessage = async ({ messageType }) => {
    // e.preventDefault();
    setMessage("");
    const data = {
      senderId: id,
      receiverId: messages?.receiver?.receiverId,
      message,
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
    // window.location.reload();
  };

  const logoutHandler = () => {
    localStorage.clear();
    navigate("/users/sign_in");
  };

  console.log(messages, "messages");

  // useEffect(() => {
  //   if (selectedImage) {
  //     sendMessage({ messageType: "file" });
  //   }
  // }, [selectedImage]);

  return (
    <div className="w-screen flex">
      <div className="w-[25%] h-screen bg-secondary overflow-scroll">
        <div className="flex items-center my-4 justify-around ">
          <Header {...{ fullName, email }} />
          <Logout logoutHandler={logoutHandler} />
        </div>
        <hr />
        <div className="m-4">
          <div className="text-primary text-lg">Chats</div>
          <div>
            {users.length > 0 ? (
              users.map(({ user }) => {
                const { email, fullName } = user;
                return (
                  <div
                    key={email}
                    className="flex items-center py-2 border-b border-b-gray-300"
                  >
                    <div
                      className="cursor-pointer flex items-center"
                      onClick={() => fetchMessages("new", user)}
                    >
                      <div>
                        <img
                          src="https://th.bing.com/th/id/OIP._BXCcqxwmsduYNCJj2XDtgHaHa?pid=ImgDet&rs=1"
                          alt="profile"
                          className="w-[48px] h-[48px] rounded-full p-[2px]"
                        />
                      </div>
                      <div className="ml-6">
                        <h3 className="text-lg font-semibold capitalize">
                          {fullName}
                        </h3>
                        <p className="text-sm font-light text-gray-600">
                          {email}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-lg font-semibold mt-24">
                No Conversations
              </div>
            )}
          </div>
        </div>
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-phone-outgoing"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="black"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2" />
                <line x1="15" y1="9" x2="20" y2="4" />
                <polyline points="16 4 20 4 20 8" />
              </svg>
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
                {/* {console.log(messages, "messages")} */}
                {messages.messages.map(
                  ({ message, user: { id } = {} }, index) => {
                    return (
                      <div key={index}>
                        <div
                          className={`max-w-[70%] w-fit rounded-b-xl p-4 mb-6 ${
                            id === user?.id
                              ? "bg-primary text-white rounded-tl-xl ml-auto"
                              : "bg-secondary rounded-tr-xl"
                          } `}
                        >
                          {message}
                        </div>
                        <div ref={messageRef}></div>
                      </div>
                    );
                  }
                )}
                {selectedImage && (
                  <div
                    className={`box-content font-normal w-48 p-4 border-4 flex bg-primary text-white rounded-tl-xl ml-auto `}
                  >
                    <img
                      src={"/icons/pdf.svg"}
                      alt="Your SVG"
                      className="h-10"
                    />
                    <div className="m-auto"> {selectedImage?.name}</div>
                  </div>
                )}
              </>
            ) : (
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-send"
                width="30"
                height="30"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#2c3e50"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <line x1="10" y1="14" x2="21" y2="3" />
                <path d="M21 3l-6.5 18a0.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a0.55 .55 0 0 1 0 -1l18 -6.5" />
              </svg>
            </div>
            <div className={`ml-4 p-2 cursor-pointer bg-light rounded-full `}>
              <div class="image-upload">
                <label for="file-input">
                  <img src="/icons/plus.svg" />
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
