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
    queryKey: ["rover-operation-status", roverId],
    queryFn: () => getCurrentOperationStatus(roverId),
    refetchInterval: 2000,
  });
};

const getCurrentStatus = async (roverId: string) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_ROVER_BACKEND}/rover/status/${roverId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error getting current rover operation status", error);
    throw error;
  }
};

export const useGetCurrentStatus = (roverId: string) => {
  return useQuery({
    queryKey: ["current-rover-status", roverId],
    queryFn: () => getCurrentStatus(roverId),
    refetchInterval: 2000,
  });
};

// export const useGetCurrentStatus = (roverId: string) => {
//   return useQuery({
//     queryKey: ["current-rover-status", roverId],
//     queryFn: () => {
//       const result = {
//         one: true,
//         two: true,
//         three: true,
//         four: true,
//         five: true,
//         six: true,
//         time: "1741537812",
//         error: "No result returned from database operation",
//         image: "Random Id : 0",
//         processed_image:
//           "iVBORw0KGgoAAAANSUhEUgAAAPAAAAFACAIAAAANimYEAAAgAElEQVR4AYzBaZNc93nm6d/9/M/",
//         coordinates:
//           '[{"x":0.5145,"y":0.944,"confidence":0.66},{"x":0.679,"y":0.9972,"confidence":0.64},{"x":0.595,"y":0.5454,"confidence":0.63},{"x":0.5999,"y":0.9842,"confidence":0.72},{"x":0.9136,"y":0.7998,"confidence":0.7}]',
//         temp: "12.3",
//         humidity: "12.3",
//       };
//       return result;
//     },
//     refetchInterval: 2000,
//   });
// };
