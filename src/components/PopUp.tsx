import * as React from "react";
import { css, cx } from "emotion";
import Modal from "./Modal";
import Button from "./Button";
import { mixins } from "../theme";
import {
  modalContainer,
  iconClose,
  buttonsContainer,
  headingTextStyle
} from "./styles/PopUp.styles";
import { PopUpProps } from "./typings/PopUp";

const PopUp: React.SFC<PopUpProps> = props => {
  let {
    onClose,
    headingText,
    onApprove,
    visible,
    approveButtonText,
    closeButtonText
  } = props;
  return (
    <Modal visible={visible}>
      <div className={modalContainer}>
        <div className={css({ ...mixins.flexSpaceBetween })}>
          <div className={headingTextStyle}>{headingText}</div>
          <i className={cx("pi", "pi-close", iconClose)} onClick={onClose} />
        </div>
        {(onClose || onApprove) && (
          <div className={buttonsContainer}>
            {onClose && (
              <Button size="large" type="secondary" onClick={onClose}>
                {closeButtonText || "No"}
              </Button>
            )}
            {onApprove && (
              <Button size="large" type="primary" onClick={onApprove}>
                {approveButtonText || "Yes"}
              </Button>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default PopUp;