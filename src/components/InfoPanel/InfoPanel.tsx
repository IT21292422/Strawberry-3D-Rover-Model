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
        maxWidth: "300px",
        wordBreak: "break-all",
      }}
    >
      <h3>Debug Info</h3>
      <pre>
        {receivedData
          ? JSON.stringify(receivedData, null, 2)
          : "Waiting for data..."}
      </pre>
    </div>
  );
};

export default InfoPanel;
