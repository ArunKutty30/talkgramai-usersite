import React from "react";
import styled from "styled-components";
import { TDropdownList } from "../constants/types";

interface IButtonGroup {
  list: TDropdownList[];
  activeList: TDropdownList;
  setActiveList: React.Dispatch<React.SetStateAction<TDropdownList>>;
}

const ButtonGroup: React.FC<IButtonGroup> = ({ list, setActiveList, activeList }) => {
  return (
    <StyledButtonGroup>
      {list.map((l, index) => (
        <button
          className={activeList.value === l.value ? "active" : ""}
          onClick={() => setActiveList(l)}
          key={index.toString()}
        >
          {l.name}
        </button>
      ))}
    </StyledButtonGroup>
  );
};

const StyledButtonGroup = styled.div`
  display: flex;
  padding: 5.5px 6px;
  align-items: flex-start;
  gap: 8px;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  background: var(--gray-1, #ecf0ef);
  width: fit-content;

  button {
    all: unset;
    padding: 10.5px 20px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 200ms linear;

    &.active {
      background: #fff;
      box-shadow: 0px 1px 3px 0px rgba(72, 72, 72, 0.15);
    }
  }
`;

export default ButtonGroup;
