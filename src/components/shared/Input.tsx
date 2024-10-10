import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { CgChevronDown } from "react-icons/cg";

interface InputContextProps {
  id: string;
  name: string;
}

const InputContext = React.createContext<InputContextProps | undefined>(
  undefined
);

interface PrefixOption {
  value: string;
  label: string;
  iconSrc: string;
}

interface InputRootProps {
  children: React.ReactNode;
  name: string;
  id?: string;
}

interface DynamicInputIconProps {
  iconSrc: string;
}

interface InputContentProps {
  label: string;
  placeholder: string;
  isRequired?: boolean;
  prefixOptions?: PrefixOption[];
}

// Input Wrapper
function InputRoot({ children, name, id = name }: InputRootProps) {
  return (
    <InputContext.Provider value={{ id, name }}>
      <div className="mb-6 mr-1 flex items-center gap-3">{children}</div>
    </InputContext.Provider>
  );
}

// Input icon
function DynamicInputIcon({ iconSrc }: DynamicInputIconProps) {
  return (
    <Image
      src={iconSrc}
      alt="Input icon"
      width={20}
      height={20}
      className="mt-4"
    />
  );
}

// Input main content

function InputContent({
  label,
  placeholder,
  isRequired = false,
  prefixOptions,
}: InputContentProps) {
  const context = React.useContext(InputContext);
  if (!context) throw new Error("InputContent must be used within InputRoot");
  const { id, name } = context;

  const [selectedPrefix, setSelectedPrefix] = useState<
    PrefixOption | undefined
  >(prefixOptions ? prefixOptions[0] : undefined);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelect = (option: PrefixOption) => {
    setSelectedPrefix(option);
    setDropdownOpen(false);
  };

  //   Handle outside click

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex w-full flex-col">
      <label
        htmlFor={id}
        className="font-mulish text-sm font-bold text-[#FFFFFF99]"
      >
        {label}
        {isRequired && "*"}
      </label>
      <div className="relative mt-[2px] flex">
        {prefixOptions && (
          <div className="relative">
            {/* Selected prefix */}

            <div
              className="flex h-12 cursor-pointer items-center rounded-l-lg border border-r-0 border-[#b4b4b4] bg-[#20222E] px-3"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setDropdownOpen(!dropdownOpen);
                }
              }}
              tabIndex={0} // Makes the div focusable with keyboard
              role="button" // Indicates this div acts as a button
              aria-expanded={dropdownOpen} // For accessibility, indicates dropdown state
            >
              {selectedPrefix && (
                <div className="flex w-16 items-center">
                  <Image
                    src={selectedPrefix.iconSrc}
                    alt="selected-icon"
                    width={16}
                    height={16}
                    className="mr-2"
                  />
                  <span className="font-mulish text-sm font-bold text-[#FFFFFF99]">
                    {selectedPrefix.label}
                  </span>
                  <div className="ml-1">
                    <CgChevronDown size={16} color="white" />
                  </div>
                </div>
              )}
            </div>

            {/* Dropdown menu */}

            {dropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute z-10 mt-1 w-full rounded-lg border border-[#b4b4b4] bg-[#20222E]"
              >
                {prefixOptions.map((option) => (
                  <div
                    key={option.value}
                    className="flex cursor-pointer items-center rounded-lg px-3 py-2 hover:bg-[#292d38]"
                    onClick={() => handleSelect(option)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        handleSelect(option);
                      }
                    }}
                    tabIndex={0} // Makes the div focusable with keyboard
                    role="option" // Indicates this is an option in a list
                    aria-selected={selectedPrefix?.value === option.value}
                  >
                    <Image
                      src={option.iconSrc}
                      alt={option.label}
                      width={16}
                      height={16}
                      className="mr-2"
                    />
                    <span className="font-mulish text-sm font-bold text-[#FFFFFF99]">
                      {option.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Input */}
        <input
          placeholder={placeholder}
          id={id}
          name={name}
          className={`h-12 w-full ${
            prefixOptions ? "rounded-r-lg" : "rounded-lg"
          } border border-[#b4b4b4] bg-[#292d38] px-4 font-mulish text-sm font-bold text-[#FFFFFF99] outline-none placeholder:text-[#FFFFFF4D]`}
          style={{ letterSpacing: "0.036em" }}
        />
      </div>
    </div>
  );
}

const Input = {
  Root: InputRoot,
  Icon: DynamicInputIcon,
  Content: InputContent,
};

export default Input;
