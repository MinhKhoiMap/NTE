const Button = ({
  label,
  onClickCallback,
  icon,
  reverseIcon = false,
  styleButtonOpts = {},
  styleLabelOpts = {},
  isCenter = false,
  rounded = "68px",
}) => {
  return (
    <button
      onClick={onClickCallback}
      className={`px-5 py-[10px] border border-[#000] 
            rounded-[${rounded}] flex items-center gap-[10px] bg-[#fff] text-center w-fit
            ${reverseIcon && "flex-row-reverse"}
            ${isCenter && "fixed left-1/2 -translate-x-1/2"}
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
