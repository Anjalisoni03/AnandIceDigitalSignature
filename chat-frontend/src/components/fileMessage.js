import samplePdf from "./sample1.pdf";

const FileMessage = ({ message, isActive }) => {
  return (
    <div
      className={` ${
        isActive
          ? " bg-primary rounded-tl-xl  ml-auto"
          : "bg-secondary rounded-tr-xl"
      } mb-2 w-[25%] p-2 rounded-b-xl`}
    >
      <div
        className={`box-content font-normal  ${
          isActive ? " bg-blue-600 text-white" : "bg-gray-200 "
        }  flex justify-between items-center  p-4 `}
      >
        {isActive ? (
          <img src={"/icons/pdf.svg"} alt="Your SVG" className="h-8 " />
        ) : (
          <img src={"/icons/pdf-black.svg"} alt="Your SVG" className="h-8 " />
        )}

        <div className="pl-1 text-ellipsis overflow-hidden whitespace-nowrap w-32">
          {message}
        </div>
        <a href={samplePdf} download={message} target="_blank" rel="noreferrer">
          {isActive ? (
            <img
              src={"/icons/download.svg"}
              alt="download"
              className="h-6 w-6 "
            />
          ) : (
            <img
              src={"/icons/download-black.svg"}
              alt="download"
              className="h-6 w-6 "
            />
          )}
        </a>
      </div>
    </div>
  );
};

export default FileMessage;
