import React from "react";
import styled from "styled-components";
import ToastMessage from "./Home/ToastMessage";

const Container = styled.div`
  padding: 40px 0 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .Toast-container{
    display: flex;
    justify-content: end;
    width: 100%;
    margin-bottom: 2rem;
  }

  @media (max-width: 800px){
    flex-direction: column-reverse;
    padding: 40px 0 15px 0;
    align-items: start;
  }
`;

interface ISectionHeader {
  title: string;
  description?: string;
  isPopupOpen?: any;
  handlePopup?: any;
}

const SectionHeader: React.FC<ISectionHeader> = ({
  title,
  description,
  isPopupOpen,
  handlePopup,
}) => {
  return (
    <Container>
      <div>
        <h5 className="section-title mb-8">{title}</h5>
        {description && <p className="s-14">{description}</p>}
      </div>
      {isPopupOpen && (
        <div className="Toast-container">
          <ToastMessage msg="Please ensure your mobile number is a valid 10-digit format" closePopup={handlePopup} />
        </div>
      )}
    </Container>
  );
};

export default SectionHeader;
