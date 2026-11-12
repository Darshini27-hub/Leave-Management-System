const colors = {
  green: "bg-green-600 hover:bg-green-700 text-white",
  red: "bg-red-600 hover:bg-red-700 text-white",
  gray: "bg-gray-200 hover:bg-gray-300 text-gray-800",
};

const Button = ({ children, onClick, type = "button", color = "green", disabled = false, className = "" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={"px-4 py-2 rounded text-sm font-medium disabled:opacity-50 " + colors[color] + " " + className}
    >
      {children}
    </button>
  );
};

export default Button;
