import { formatNumberSpecialCase } from "commons/Utils";
import React, { ReactNode, useState } from "react";

interface IInputNumber {
  name?: string;
  value: number | string;
  onChange?: (value: string) => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean
}
function InputNumberComponent({
  name,
  value,
  onChange,
  className,
  placeholder,
  disabled = false
}: IInputNumber) {
  const handleInputChange = (value : string) => {
    let temp = value?.replace(/[^0-9]/g, '').replace(/^0+/, '');
    if(onChange)
        onChange(temp);
}

  return (
    <input
      type="text"
      placeholder={disabled ? '' : placeholder || ""}
      value={formatNumberSpecialCase(value)}
      onChange={(e) => handleInputChange(e?.target?.value || "")}
      className={className || ""}
      disabled={disabled}
      maxLength={13 + (formatNumberSpecialCase(value)?.split(" ").length - 1)}
    />
  );
}

export default InputNumberComponent;
