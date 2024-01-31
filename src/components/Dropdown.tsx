import React, { useState } from "react";
import styled from "styled-components";
import { ArrowIosDownward } from "@styled-icons/evaicons-solid";

import { TDropdownList } from "../constants/types";

interface IDropdownProps {
  list: TDropdownList[];
  placeholder: string;
  selectedList?: TDropdownList;
  setSelectedList?: React.Dispatch<React.SetStateAction<TDropdownList | undefined>>;
  dropdownListClassName?: string;
  disable?: boolean;
  style?: React.CSSProperties;
  hideArrow?: boolean;
}

const Dropdown: React.FC<IDropdownProps> = ({
  list,
  placeholder,
  setSelectedList,
  selectedList,
  dropdownListClassName,
  disable,
  style,
  hideArrow,
}) => {
  const [openDropdown, setOpenDropdown] = useState(false);

  return (
    <StyledDropdownWrapper>
      <StyledDropdownHeader
        role="button"
        onClick={() => {
          if (disable === true) return;
          setOpenDropdown((d) => !d);
        }}
        className={openDropdown ? "active" : ""}
        style={style}
      >
        <p>{selectedList ? selectedList.name : placeholder}</p>
        {!hideArrow && (
          <span className="icon">
            <ArrowIosDownward />
          </span>
        )}
      </StyledDropdownHeader>
      {openDropdown && (
        <StyledDropdownList className={dropdownListClassName}>
          {list.map((data, index) => (
            <div
              key={index.toString()}
              className={selectedList && selectedList.value === data.value ? "active" : ""}
              onClick={() => {
                if (setSelectedList) setSelectedList(data);
                setOpenDropdown(false);
              }}
            >
              <p>{data.name}</p>
            </div>
          ))}
        </StyledDropdownList>
      )}
    </StyledDropdownWrapper>
  );
};

export const StyledDropdownWrapper = styled.div`
  margin: 10px 0 5px;
  position: relative;
  font-size: 14px;
`;

export const StyledDropdownHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  background: #ffffff;
  border: 1px solid #eae8e5;
  box-shadow: 0px 1px 8px rgba(31, 103, 251, 0.05);
  cursor: pointer;
  border-radius: 8px;

  &.active {
    border-radius: 8px 8px 0 0;
    border-bottom: none;

    .icon {
      transform: rotate(180deg);
    }
  }

  .icon {
    width: 24px;
    height: 24px;
    transition: all 200ms linear;
  }
`;

export const StyledDropdownList = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  padding: 0 0 7px;
  background-color: var(--dropdown-bg);
  border: 1px solid #eae8e5;
  border-top: none;
  box-shadow: 0px 1px 8px rgba(31, 103, 251, 0.05);
  z-index: 10;
  border-radius: 0 0 8px 8px;
  max-height: 300px;
  overflow-y: auto;
  border-top: 0.7px solid #d2d2d2;

  > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 7px 20px;
    border-bottom: 0.7px solid #d2d2d2;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 200ms linear;
    font-weight: 400;

    &:hover {
      background-color: #f5f5f5;
    }

    &.active {
      color: var(--text-primary);
      font-weight: 500;
    }

    &:last-child {
      border-bottom: none;
    }

    > p {
      width: 100%;
    }

    svg {
      width: 16px;
      height: 16px;
    }
  }
`;

export default Dropdown;
