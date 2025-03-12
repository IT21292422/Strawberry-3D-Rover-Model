const ImageCard = ({ base64Image }: any) => {
  return (
    <div
      style={{
        position: "fixed",
        top: "80px",
        left: "10px",
      }}
    >
      <img
        src={`data:image/png;base64,${base64Image}`}
        alt="Processed"
        className="w-24 h-24 md:w-40 md:h-40"
      />
    </div>
  );
};

export default ImageCard;
