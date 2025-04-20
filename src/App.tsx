import RoverScene from "./components/RoverScene/RoverScene";
import "./App.css";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    handleMobileData?: (data: any) => void;
    mobileData?: any;
  }
}

function App() {
  const [roverId, setRoverId] = useState<string | null>(null);

  useEffect(() => {
    //Get roverId from query parameters
    const queryParams = new URLSearchParams(window.location.search);
    const queryRoverId = queryParams.get("roverId");

    if (queryRoverId) {
      console.log("Found roverId in query parameters: ", queryRoverId);
      setRoverId(queryRoverId);
    } else if (window.mobileData?.roverId) {
      console.log("Found roverId in window object: ", window.mobileData.rover);
      setRoverId(window.mobileData.roverId);
    }

    // Define global function to handle mobile data
    window.handleMobileData = (data) => {
      console.log("Received data via global function:", data);
      if (!roverId) {
        setRoverId(data.roverId);
      }
    };

    // Cleanup
    return () => {
      delete window.handleMobileData;
    };
  }, []);

  return (
    <>
      <RoverScene roverId={roverId as string} />
    </>
  );
}

export default App;
