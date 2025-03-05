import { RoverStatus } from "../../types/types";

interface Props {
  status: RoverStatus;
}

const StatusCard = ({ status }: Props) => {
  const selectRoverStatus = (status: number) => {
    switch (status) {
      case RoverStatus.START:
        return "Running";
      case RoverStatus.STOP:
        return "Stopped";
      case RoverStatus.PAUSE:
        return "Paused";
      case RoverStatus.SERVICE:
        return "Service";
      default:
        return "";
    }
  };

  return (
    <div className="fixed top-2 left-2 bg-yellow-500 w-40 h-12 rounded-full flex flex-row justify-center items-center gap-4">
      <div
        className={`w-3 h-3 ${
          status === RoverStatus.START ? "bg-green-500" : "bg-red-500"
        } rounded-full animate-pulse`}
      ></div>

      <p className="text-2xl text-white text-center">
        {selectRoverStatus(status ?? 0)}
      </p>
    </div>
  );
};

export default StatusCard;
