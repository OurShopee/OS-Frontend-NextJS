const InputBox1 = ({ handleChange, ...props }) => {
  return (
    <input
      type="text"
      onChange={handleChange}
      {...props}
      className="
        w-full
        mb-[15px] sm:mb-[30px]
        p-[10px] sm:pb-2
        text-sm sm:text-[#43494B]
        bg-white
        border rounded-[8px]
        sm:border-0 sm:border-b sm:border-[#CED2D4]
        focus:outline-none
        placeholder:text-sm
      "
    />
  );
};

export default InputBox1;
