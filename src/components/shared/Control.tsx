import * as React from "react";
import { controlContentStyle, controlStyle } from "../styles/Control.styles";
import { ControlProps } from "../typings/Control";
import { colors } from "../../theme";
import { cx } from "emotion";

const renderProps = props => <ControlView {...props} />;

const Control: React.SFC<ControlProps> = props => {
  const {
    checked,
    onChange,
    value,
    disabled,
    children = renderProps,
    type,
    className
  } = props;
  return (
    <div
      className={cx(controlStyle, className)}
      role={type}
      aria-disabled={disabled}
      aria-checked={checked}
      data-disabled={disabled}
      tabIndex={checked ? 0 : -1}
      onClick={
        !disabled
          ? (e: React.MouseEvent) =>
              onChange && onChange({ value, checked: !checked }, e)
          : undefined
      }
    >
      {children(props)}
    </div>
  );
};

export const ControlView: React.SFC<ControlProps> = ({
  checked,
  label,
  type
}) => {
  const isRadio = type === "radio";

  const iconClass = cx("pi", {
    "pi-radio": isRadio && !checked,
    "pi-radio-selected": isRadio && checked,
    "pi-checkbox-selected": !isRadio && checked,
    "pi-checkbox-unselected": !isRadio && !checked
  });

  return (
    <div className={controlContentStyle}>
      <i
        style={{
          color: checked ? colors.violet.base : colors.gray.light,
          paddingTop: 2
        }}
        className={iconClass}
      />{" "}
      {label}
    </div>
  );
};

export default Control;
