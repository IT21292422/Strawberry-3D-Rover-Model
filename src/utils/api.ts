import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const getCurrentOperationStatus = async (roverId: string) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_ROVER_BACKEND}/rover/${roverId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error getting current rover operation status", error);
    throw error;
  }
};

export const useGetCurrentOperationStatus = (roverId: string) => {
  return useQuery({
    queryKey: ["rover-status", roverId],
    queryFn: () => getCurrentOperationStatus(roverId),
    refetchInterval: 2000,
  });
};
