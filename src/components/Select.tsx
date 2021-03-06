import * as React from "react";
import { cx } from "emotion";
import { SelectProps } from "./typings/Select";
import {
  chevronStyle,
  dropDownClass,
  inputWrapper,
  selectInput,
  selectInputWrapper,
  selectWrapper,
  fullWidth,
  relativePosition
} from "./styles/Select.styles";
import DropDown from "./DropDown";
import Input from "./Input";
import OptionGroupCheckBox from "./OptionGroupCheckBox";
import OptionGroupRadio from "./OptionGroupRadio";

function noop() {}

const Select: React.SFC<SelectProps> = props => {
  const {
    className,
    placeholder,
    required,
    errorMessage,
    onChange,
    value,
    selected,
    children,
    multiSelect,
    onClear,
    onApply,
    dropdownClassName,
    inputProps,
    searchBox,
    searchBoxProps,
    fullWidthDropdown
  } = props;

  const OptionGroup: any = multiSelect ? OptionGroupCheckBox : OptionGroupRadio;

  return (
    <div
      className={cx(selectWrapper, className, {
        [relativePosition]: fullWidthDropdown
      })}
    >
      <DropDown
        dropDownClassName={cx(dropDownClass, dropdownClassName, {
          [fullWidth]: fullWidthDropdown
        })}
        labelComponent={({ toggleDropdown, isOpen }) => {
          const chevron = cx(chevronStyle, "pi", "pi-arrow-drop-down", {
            __pebble__select__open: isOpen
          });
          return (
            <div className={inputWrapper} onClick={toggleDropdown}>
              <Input
                className={selectInputWrapper}
                inputClassName={selectInput}
                placeholder={placeholder}
                value={value || ""}
                onChange={noop}
                required={required}
                message={isOpen ? " " : ""}
                errorMessage={errorMessage}
                readOnly
                {...inputProps}
              />
              <i className={chevron} />
            </div>
          );
        }}
      >
        {({ toggle }) => (
          <React.Fragment>
            <OptionGroup
              selected={selected}
              onChange={(_value, event) => {
                onChange(_value, event);
                if (!multiSelect) {
                  toggle();
                }
              }}
              onApply={
                onApply
                  ? _value => {
                      onApply(_value, props);
                      toggle();
                    }
                  : undefined
              }
              onClear={
                onClear
                  ? () => {
                      onClear();
                      toggle();
                    }
                  : undefined
              }
              searchBox={searchBox}
              searchBoxProps={searchBoxProps}
            >
              {children}
            </OptionGroup>
          </React.Fragment>
        )}
      </DropDown>
    </div>
  );
};

export default Select;
