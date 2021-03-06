import * as React from "react";
import debounce from "just-debounce-it";
import { TypeaheadProps, TypeaheadState } from "./typings/Typeahead";
import { cx } from "emotion";
import Input from "./Input";
import { optionsWrapper, wrapper } from "./styles/TypeAhead.styles";
import OutsideClick from "./OutsideClick";
import OptionGroupRadio from "./OptionGroupRadio";

class TypeAhead extends React.PureComponent<TypeaheadProps, TypeaheadState> {
  typeaheadInputRef: React.RefObject<HTMLInputElement> = React.createRef();
  debouncedChange: () => void;

  static defaultProps: Partial<TypeaheadProps> = {
    debounceTime: 500,
    onClear: () => {},
    searchBox: (
      { registerChange, onFocus, value, typeaheadInputRef, onBlur },
      props
    ) => (
      <Input
        onChange={registerChange}
        placeholder={props.placeholder}
        inputProps={{
          onFocus,
          onKeyDown: e => {
            if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
            if (e.keyCode === 8 && props.selected) {
              // keyCode for delete
              registerChange("");
              props.onClear();
            }
          },
          //@ts-ignore
          ref: typeaheadInputRef,
          onBlur
        }}
        value={value}
        errorMessage={props.errorMessage}
        loading={props.loading}
        required={props.required}
        disabled={props.disabled}
      />
    )
  };

  constructor(props) {
    super(props);

    this.debouncedChange = debounce(this.onChange, props.debounceTime);
  }

  state: TypeaheadState = {
    value: this.props.initialValue || "",
    showSuggestions: false,
    focussedElement: undefined
  };

  onChange = () => {
    this.props.onChange(this.state.value, this.props);
  };

  private registerChange = (value: string) => {
    this.setState(
      {
        value
      },
      this.debouncedChange
    );
  };

  private onFocus = () => {
    this.setState({
      showSuggestions: true,
      focussedElement: document.activeElement
    });
  };

  private onBlur = () => {
    this.setState({ focussedElement: document.activeElement });
  };

  private onSelect = _value => {
    this.props.onSelect(_value, this.props);

    this.setState({
      showSuggestions: false,
      value: this.props.valueExtractor(_value)
    });
  };

  render() {
    const { className, searchBox, dropdownClassName, children } = this.props;

    const { showSuggestions, value, focussedElement } = this.state;

    return (
      <OutsideClick
        onOutsideClick={() =>
          this.setState({
            showSuggestions: false
          })
        }
        disabled={!showSuggestions}
        className={cx(wrapper, className)}
      >
        {searchBox(
          {
            registerChange: this.registerChange,
            onFocus: this.onFocus,
            onBlur: this.onBlur,
            value,
            typeaheadInputRef: this.typeaheadInputRef
          },
          this.props
        )}

        {(focussedElement === this.typeaheadInputRef.current ||
          showSuggestions) && (
          <div className={cx(optionsWrapper, dropdownClassName)}>
            <OptionGroupRadio onChange={this.onSelect}>
              {children}
            </OptionGroupRadio>
          </div>
        )}
      </OutsideClick>
    );
  }
}

export default TypeAhead;
