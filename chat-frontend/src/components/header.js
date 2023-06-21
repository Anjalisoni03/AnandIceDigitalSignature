const Header = ({ fullName, email, width, height }) => {
  return (
    <div className="flex">
      <img
        src="https://yt3.ggpht.com/a/AATXAJzs6duEIf3xTXYL20Ow0WA8RB2TSAFzP2mtTw=s900-c-k-c0xffffffff-no-rj-mo"
        alt="profile"
        width={width || "60"}
        height={height || "60"}
        className="p-[2px] rounded-full"
      />
      {email ? (
        <div className="ml-4">
          <h3 className="text-xl capitalize">{fullName}</h3>
          <p className="text-base font-extralight">{email}</p>
        </div>
      ) : (
        <div className="ml-4 capitalize">
          <h2 className="text-xl">Welcome!</h2>
          <h3 className="text-3xl ">{fullName}</h3>
        </div>
      )}
    </div>
  );
};

export default Header;
