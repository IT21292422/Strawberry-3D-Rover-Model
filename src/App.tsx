import RoverScene from "./components/RoverScene/RoverScene";
import "./App.css";
import { useEffect, useState } from "react";
import InfoPanel from "./components/InfoPanel/InfoPanel";

declare global {
  interface Window {
    handleMobileData?: (data: any) => void;
    mobileData?: any;
  }
}

function App() {
  const [receivedData, setReceivedData] = useState(null);

  useEffect(() => {
    // Define global function to handle mobile data
    window.handleMobileData = (data) => {
      console.log("Received data via global function:", data);
      setReceivedData(data);
    };

    // Check if data was already injected
    if (window.mobileData) {
      console.log("Found existing mobile data:", window.mobileData);
      setReceivedData(window.mobileData);
    }

    // Cleanup
    return () => {
      delete window.handleMobileData;
    };
  }, []);

  return (
    <>
      <RoverScene roverId={receivedData?.roverId} />
    </>
  );
}

export default App;
