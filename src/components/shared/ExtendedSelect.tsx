import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { CgChevronDown } from "react-icons/cg";
import { FaBuilding, FaUser } from "react-icons/fa6";
import { ImLocation2 } from "react-icons/im";

interface ExtendedOption {
  id: string;
  name: string;
  type: "Organisation" | "Person" | "Department" | "Location";
  role?: string;
}

interface ExtendedSelectProps {
  label: string;
  options: ExtendedOption[];
  name: string;
  className?: string;
  placeholder?: string;
  iconSrc?: string;
  onChange?: (option: ExtendedOption) => void;
  isRequired?: boolean;
  defaultValue?: string;
}

const ExtendedSelect: React.FC<ExtendedSelectProps> = ({
  label,
  options,
  name,
  className,
  placeholder = "Select an option",
  iconSrc,
  onChange,
  isRequired = false,
  defaultValue,
}) => {
  const [selectedOption, setSelectedOption] = useState<ExtendedOption | null>(
    () => {
      if (defaultValue) {
        return options.find((opt) => opt.id === defaultValue) || null;
      }
      return null;
    }
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const getIconForType = (type: ExtendedOption["type"]) => {
    switch (type) {
      case "Organisation":
        return null;
      case "Person":
        return <FaUser className="size-4 text-gray-400" />;
      case "Department":
        return <FaBuilding className="size-4 text-gray-400" />;
      case "Location":
        return <ImLocation2 className="size-4 text-gray-400" />;
      default:
        return null;
    }
  };

  const handleSelect = (option: ExtendedOption) => {
    setSelectedOption(option);
    setDropdownOpen(false);
    if (onChange) onChange(option);
  };

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

  const handleToggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      setDropdownOpen((prev) => !prev);
    }
  };

  const groupedOptions = options.reduce(
    (acc, option) => {
      if (!acc[option.type]) {
        acc[option.type] = [];
      }
      acc[option.type].push(option);
      return acc;
    },
    {} as Record<ExtendedOption["type"], ExtendedOption[]>
  );

  return (
    <div className="mb-6 flex items-center gap-3">
      {iconSrc ? (
        <div className="mt-4">
          <Image src={iconSrc} alt="select-icon" width={22} height={22} />
        </div>
      ) : null}

      <div className="mr-1 w-full">
        <label
          className="font-mulish text-sm font-bold text-[#FFFFFF99]"
          htmlFor={name}
        >
          {label}
          {isRequired && "*"}
        </label>
        <div className="relative mt-[2px]">
          <div
            className={cn(
              "flex h-12 cursor-pointer items-center rounded-lg border border-[#b4b4b4] bg-[#292d38] px-3",
              className
            )}
            onClick={handleToggleDropdown}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="button"
            aria-expanded={dropdownOpen}
            aria-haspopup="listbox"
          >
            <div className="flex-1 font-mulish text-sm font-bold text-[#FFFFFF99]">
              {selectedOption ? selectedOption.name : placeholder}
            </div>
            <input
              type="hidden"
              name={name}
              value={selectedOption ? selectedOption.id : ""}
              autoComplete="off"
            />

            <div
              className="ml-1"
              onClick={(e) => {
                e.stopPropagation();
                handleToggleDropdown();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.stopPropagation();
                  handleToggleDropdown();
                }
              }}
              tabIndex={0}
              role="button"
              aria-label="Toggle dropdown"
            >
              <CgChevronDown size={16} color="white" />
            </div>
          </div>

          {dropdownOpen && (
            <div
              ref={dropdownRef}
              className="dropdown absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-[#b4b4b4] bg-[#20222E]"
              role="listbox"
              aria-activedescendant={selectedOption?.id || ""}
              tabIndex={-1}
            >
              {Object.entries(groupedOptions).map(([type, options]) => (
                <div key={type}>
                  {type ? (
                    <div
                      className="sticky top-0 bg-[#1a1c25] px-3 py-2 font-mulish text-sm font-extrabold uppercase text-gray-400"
                      role="group"
                      aria-label={type}
                    >
                      {type}
                    </div>
                  ) : null}

                  {options.map((option) => (
                    <div
                      key={option.id}
                      className="flex cursor-pointer items-center rounded-lg p-3 hover:bg-[#292d38]"
                      onClick={() => handleSelect(option)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          handleSelect(option);
                        }
                      }}
                      tabIndex={0}
                      role="option"
                      aria-selected={selectedOption?.id === option.id}
                    >
                      <span className="mr-2">
                        {getIconForType(option.type)}
                      </span>
                      <span className="font-mulish text-sm font-bold text-[#FFFFFF99]">
                        {option.name}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExtendedSelect;
