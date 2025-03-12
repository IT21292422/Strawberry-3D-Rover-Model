interface Props {
  receivedData: any;
}

const InfoPanel = ({ receivedData }: Props) => {
  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        padding: "10px",
        backgroundColor: "rgba(240, 64, 64, 0.8)",
        color: "white",
        zIndex: 9999,
        borderRadius: "4px",
        maxWidth: "150px",
        wordBreak: "break-all",
      }}
    >
      <p>Temperature: {receivedData?.temp}</p>
      <p>Humidity: {receivedData?.humidity}</p>
      {receivedData?.error !== "No result returned from database operation" && (
        <p>Error: {receivedData?.error}</p>
      )}
    </div>
  );
};

export default InfoPanel;
