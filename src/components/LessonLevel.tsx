import React from "react";
import styled from "styled-components";
import Cards from "./TopicCard/Cards";

interface ILessonLevelProps {
  title: string;
  color: string;
  data: {
    word: string;
    speech: string;
    meaning: string;
  }[];
}

const LessonLevel: React.FC<ILessonLevelProps> = ({ title, data, color }) => {
  return (
    <Wrapper>
      <BackgroundColor style={{ backgroundColor: color }}></BackgroundColor>
      <div className="pad">
        <Heading>
          <h4>{title}</h4>
        </Heading>
        <Container>
          {data.slice(0, 4).map((f, index) => (
            <Cards key={index} title={f.word} description={f.meaning} />
          ))}
        </Container>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  height: calc(100vh - 136.8px);
  background: #fff;
  position: relative;

  .pad {
    position: relative;
    height: 100%;
    overflow-y: auto;
  }
`;

const BackgroundColor = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  max-width: 450px;
  width: 100%;
  clip-path: polygon(0 0, 100% 0%, 63% 100%, 0% 100%);

  // svg {
  //   width: 100%;
  //   height: 100%;
  // }
`;

const Heading = styled.div`
  padding: 20px 0;
  margin-bottom: 40px;

  h4 {
    font-size: 32px;
    color: #140837;
    letter-spacing: 0.84px;
    font-family: "Inter", sans-serif;
    @media (max-width: 425px) {
      font-size: 28px;
    }
  }
`;

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  padding-bottom: 50px;

  @media (max-width: 762px) {
    place-items: center;
  }
  @media (max-width: 600px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

export default LessonLevel;
