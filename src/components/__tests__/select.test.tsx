import * as React from "react";
import renderer from "react-test-renderer";
import Option from "../Option";
import Select from "../Select";
import { mount } from "enzyme";
import sinon from "sinon";
import { SelectProps } from "../typings/Select";
import Button from "../Button";
import Input from "../Input";
import Search from "../Search";

function getComponent(spy = () => {}, props: Partial<SelectProps> = {}) {
  return (
    <Select
      onChange={spy}
      placeholder="Choose Option"
      selected={"option-2"}
      {...props}
    >
      {new Array(5).fill(1).map((_x, i) => (
        <Option key={i + 1} value={`option-${i + 1}`} label="I am an option" />
      ))}
    </Select>
  );
}

describe("Component: Select", () => {
  test("single-select: snapshot", () => {
    const select = renderer.create(getComponent());
    const tree = select.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("multi-select: snapshot", () => {
    const select = renderer.create(
      getComponent(undefined, {
        multiSelect: true,
        selected: []
      })
    );
    const tree = select.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("sinle-select with searchbox: snapshot", () => {
    const select = renderer.create(
      getComponent(undefined, {
        searchBox: true,
        searchBoxProps: {
          placeholder: "Search"
        }
      })
    );
    const tree = select.toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("should open when input is clicked", () => {
    const spy = sinon.spy();
    const select = mount(getComponent(spy));

    expect(select.find(Option)).toHaveLength(0);

    select.find(Input).simulate("click");
    expect(select.find(Option)).toHaveLength(5);
  });

  test("single select: should trigger onChange with correct onChange", () => {
    const spy = sinon.spy();
    const select = mount(getComponent(spy));
    select.find(Input).simulate("click");
    select
      .find(Option)
      .at(2)
      .simulate("click");

    expect(spy.calledWith("option-3")).toBeTruthy();
    expect(select.find(Option)).toHaveLength(0);
  });

  test("multi select: should trigger onChange with correct onChange", () => {
    const spy = sinon.spy();
    const applySpy = sinon.spy();
    const clearSpy = sinon.spy();
    const select = mount(
      getComponent(spy, {
        multiSelect: true,
        onApply: applySpy,
        onClear: clearSpy,
        selected: []
      })
    );
    select.find(Input).simulate("click");
    select
      .find(Option)
      .at(2)
      .simulate("click");

    expect(spy.calledWith(["option-3"])).toBeTruthy();

    select.setProps({
      selected: ["option-3"]
    });

    select
      .find(Option)
      .at(3)
      .simulate("click");

    expect(spy.calledWith(["option-3", "option-4"])).toBeTruthy();

    select.setProps({
      selected: ["option-3", "option-4"]
    });

    select
      .find(Option)
      .at(2)
      .simulate("click");

    expect(spy.calledWith(["option-4"])).toBeTruthy();

    expect(select.find(Button)).toHaveLength(2);

    // test onClear
    select
      .find(Button)
      .at(0)
      .simulate("click");
    expect(clearSpy.calledOnce).toBeTruthy();

    // Reopen dropdown and test onApply
    select.find(Input).simulate("click");
    select.setProps({
      selected: ["option-3"]
    });

    select
      .find(Button)
      .at(1)
      .simulate("click");
    expect(applySpy.calledWith(["option-3"])).toBeTruthy();

    // ensure the dropdown is closed
    expect(select.find(Option)).toHaveLength(0);
  });

  test("single select: should trigger onChange with correct onChange", () => {
    const spy = sinon.spy();
    const queryChangeSpy = sinon.spy();
    const select = mount(
      getComponent(spy, {
        searchBox: true,
        searchBoxProps: {
          placeholder: "Search",
          onChange: queryChangeSpy
        }
      })
    );
    select.find(Input).simulate("click");
    select
      .find(Search)
      .find("input")
      .simulate("change", {
        target: {
          value: "hello"
        }
      });

    expect(queryChangeSpy.calledWith("hello")).toBeTruthy();
  });
});
