// A mini-component that handles its own styling and errors!
const FormInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  wrapperClass = "",
}) => {
  return (
    <div className={`flex flex-col gap-2 w-full ${wrapperClass}`}>
      <div className="flex justify-between items-center">
        <label
          className={`text-sm ${error ? "text-red-500" : "text-gray-500 dark:text-gray-400"}`}
        >
          {label}
        </label>
        {error && (
          <span className="text-red-500 text-xs font-bold">can't be empty</span>
        )}
      </div>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full bg-white dark:bg-[#1E2139] border rounded-md p-4 text-gray-900 dark:text-white font-bold focus:outline-none transition-colors ${
          error
            ? "border-red-500 focus:border-red-500"
            : "border-gray-300 dark:border-[#252945] focus:border-blue-500"
        }`}
      />
    </div>
  );
};

export default FormInput;
