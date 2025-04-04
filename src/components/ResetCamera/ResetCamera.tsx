interface Props {
  onClick: () => void;
}

const ResetCamera = ({ onClick }: Props) => {
  return (
    <div
      className="fixed bottom-10 right-4 w-10 bg-yellow-500 rounded-full"
      style={{
        padding: "5px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      onClick={onClick}
    >
      <svg
        fill="#ffffff"
        viewBox="0 0 512 512"
        data-name="Layer 1"
        id="Layer_1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g
          id="SVGRepo_tracerCarrier"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></g>
        <g id="SVGRepo_iconCarrier">
          <path d="M64,256H34A222,222,0,0,1,430,118.15V85h30V190H355V160h67.27A192.21,192.21,0,0,0,256,64C150.13,64,64,150.13,64,256Zm384,0c0,105.87-86.13,192-192,192A192.21,192.21,0,0,1,89.73,352H157V322H52V427H82V393.85A222,222,0,0,0,478,256Z"></path>
        </g>
      </svg>
    </div>
  );
};

export default ResetCamera;
