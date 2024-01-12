const Button = ({
  label,
  onClick,
  icon,
  reverseIcon = false,
  styleButtonOpts = {},
  styleLabelOpts = {},
  isCenter = false,
}) => {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-[10px] border border-[#000] 
            rounded-[68px] absolute flex items-center gap-[10px] bg-[#fff]
            ${reverseIcon && "flex-row-reverse"}
            ${isCenter && "-translate-x-1/2"}
        `}
      style={{ ...styleButtonOpts }}
    >
      <span className="button-label" style={{ ...styleLabelOpts }}>
        {label}
      </span>
      {icon}
    </button>
  );
};

export default Button;
