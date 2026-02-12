type ToggleSwitchProps = {
  checked: boolean;
  onChange: () => void;
};

const ToggleSwitch = ({ checked, onChange }: ToggleSwitchProps) => {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`
        relative w-10 h-6 rounded-full
        transition-colors duration-300
        ${checked ? "bg-orange-500" : "bg-[#d1d1d1]"}
      `}
    >
      {/* KNOB */}
      <span
        className={`
          absolute top-1 left-1
          w-4 h-4 rounded-full bg-white
          transition-transform duration-300
          ${checked ? "translate-x-4" : "translate-x-0"}
        `}
      />
    </button>
  );
};

export default ToggleSwitch;
