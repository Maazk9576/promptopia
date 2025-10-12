type ButtonProps = {
  type?: "button" | "submit" | "reset";
  className?: string;
  onClick?: () => void;
  name: string;
};
const Button = ({
  type = "button",
  className = "outline_btn",
  name,
  onClick,
}: ButtonProps) => {
  return (
    <button className={className} type={type} onClick={onClick}>
      {name}
    </button>
  );
};

export default Button;
