import { formatNumberSpecialCase } from "commons/Utils";
import { SOCIAL_NUMBER_INPUT } from "containers/Welfare/InsuranceSocialContribute/SocialContributeData";
import { IDropdownValue } from "models/CommonModel";
import React, { ReactNode, useState } from "react";
import IconClear from "assets/img/icon/icon_x.svg";
import Select from "react-select";

interface IInputNumber {
  name?: string;
  value?: IDropdownValue;
  otherValueDefault?: string | number;
  onChange: (value: IDropdownValue | null, key: string) => void;
  handleInputChange?: (text: any) => string; // format data when user input text value
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  maxLeng?: number;
  isClearable?: boolean;
  options: IDropdownValue[];
}
function SelectInputComponent({
  name = "",
  value,
  onChange,
  handleInputChange,
  className,
  placeholder = "",
  options,
  otherValueDefault = SOCIAL_NUMBER_INPUT,
  disabled = false,
  maxLeng = 255,
  isClearable = false,
}: IInputNumber) {
  const onSelectChange = (e: IDropdownValue | null, name: string) => {
    let shouldReset = false;
    if (e?.value == otherValueDefault && value?.value != otherValueDefault) {
      shouldReset = true;
    }
    let label = e?.label || "";
    if (label && e?.value == otherValueDefault && handleInputChange) {
      label = handleInputChange(label);
    }
    let result =
      e != null ? { value: e.value, label: shouldReset ? "" : label } : null;
    onChange(result, name);
  };

  return value?.value == otherValueDefault ? (
    <label className="input-container">
      <input
        type="text"
        value={value.label}
        onChange={(e) =>
          onSelectChange({ ...value, label: e?.target?.value }, name)
        }
        className="form-control input mv-10 w-100"
        style={disabled ? {} : {paddingRight: '30px'}}
        name="inputName"
        autoComplete="off"
        placeholder={placeholder}
        maxLength={maxLeng}
        disabled={disabled}
      />
      {!disabled ? (
        <span className="input-group-addon input-img">
          <img
            src={IconClear}
            alt="Clear"
            className="remove-input cursor-pointer"
            title="Exit"
            onClick={() => onSelectChange(null, name)}
          />
        </span>
      ) : null}
    </label>
  ) : (
    <Select
      placeholder={placeholder}
      options={options}
      isClearable={isClearable}
      value={value}
      onChange={(e) => onSelectChange(e, name)}
      className="input mv-10"
      isDisabled={disabled}
      styles={{ menu: (provided) => ({ ...provided, zIndex: 2 }) }}
    />
  );
}

export default SelectInputComponent;
