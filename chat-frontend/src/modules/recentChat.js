const RecentChat = ({ text, data, fetchMessages, activeUser }) => {
  return (
    <div className="m-4">
      <div className="text-primary text-lg">{text}</div>
      {data.length > 0 ? (
        data.map(({ conversationId, user }, index) => {
          const { email, fullName } = user;
          return (
            <div
              className={`flex items-center py-2 px-2 border-b border-b-gray-300 hover:bg-blue-100 cursor-pointer ${
                activeUser === email && "bg-blue-100"
              }`}
              key={index}
            >
              <div
                className="cursor-pointer flex items-center"
                onClick={() =>
                  fetchMessages(
                    conversationId !== undefined ? conversationId : "new",
                    user
                  )
                }
              >
                <div>
                  <img
                    src="https://th.bing.com/th/id/OIP._BXCcqxwmsduYNCJj2XDtgHaHa?pid=ImgDet&rs=1"
                    alt="profile"
                    className="w-[48px] h-[48px] rounded-full p-[2px]"
                  />
                </div>
                <div className="ml-6">
                  <h3 className="text-lg font-semibold capitalize ">
                    {fullName}
                  </h3>
                  <p className="text-sm font-light text-gray-600">{email}</p>
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
  );
};

export default RecentChat;
