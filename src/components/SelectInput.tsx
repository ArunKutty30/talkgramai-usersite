import React, { ReactNode, useState } from "react";
import styled from "styled-components";
import { TDropdownList } from "../constants/types";

interface ISelectInputProps {
  label: ReactNode;
  lists: TDropdownList[];
  setSelectedList: (value: string) => void;
}

const SelectInput: React.FC<ISelectInputProps> = ({ label, lists, setSelectedList }) => {
  const [open, setOpen] = useState(false);

  // const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const toggle = () => setOpen((o) => !o);

  return (
    <StyledSelect>
      <StyledSelectLabel onClick={toggle}>
        {typeof label === "string" ? <span>{label}</span> : label}
      </StyledSelectLabel>
      {open && (
        <StyledOption>
          <ul>
            {lists.map((list, index) => (
              <li
                key={index}
                onClick={() => {
                  setSelectedList(list.value);
                  handleClose();
                }}
              >
                {list.name}
              </li>
            ))}
          </ul>
        </StyledOption>
      )}
    </StyledSelect>
  );
};

const StyledSelect = styled.div`
  position: relative;
`;

const StyledSelectLabel = styled.div`
  display: flex;
  align-items: center;
  border-radius: 8px;
  border: 1px solid var(--text-primary);
  background: #fff;
  box-shadow: 0px 1px 3px 0px rgba(72, 72, 72, 0.15);
  color: var(--text-primary);
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  padding: 0 8px;
  height: 38px;
  cursor: pointer;
  white-space: nowrap;
`;

const StyledOption = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  max-height: 300px;
  overflow-y: auto;
  border-radius: 8px;
  border: 1px solid var(--gray-2, #62635e);
  background: #fff;
  overflow: hidden;
  z-index: 1;

  > ul {
    list-style: none;

    li {
      color: var(--gray-2, #62635e);
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: normal;
      padding: 15px;
      white-space: nowrap;
      cursor: pointer;

      &:not(:last-child) {
        border-bottom: 1px solid var(--gray-2, #62635e);
      }
    }
  }
`;

export default SelectInput;
