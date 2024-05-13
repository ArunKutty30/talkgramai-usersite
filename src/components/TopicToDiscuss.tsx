import React from 'react';
import styled from 'styled-components';
import Card from './TopicCard';

interface ITopicToDiscussProps {
  pointers: {
    pointer: string;
    questions: string[];
  }[];
}

const TopicToDiscuss: React.FC<ITopicToDiscussProps> = ({ pointers }) => {
  return (
    <TopicDiscussedWrapper>
      <div className="mx pad">
        <CardHeading>
          <h4>TOPIC TO BE DISCUSSED</h4>
        </CardHeading>
        <Container>
          {pointers.map((topic, index) => (
            <Card key={index} title={topic.pointer} questions={topic.questions} />
          ))}
        </Container>
      </div>
    </TopicDiscussedWrapper>
  );
};

const TopicDiscussedWrapper = styled.div`
  height: calc(100vh - 70px);
  background: #fff;
  overflow-y: auto;
  padding-bottom: 22px;
`;

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  flex-wrap: wrap;
  gap: 40px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const CardHeading = styled.div`
  padding: 20px 0;
  margin-bottom: 40px;

  h4 {
    font-size: 32px;
    color: #140837;
    letter-spacing: 0.84px;
    font-family: 'Inter', sans-serif;
    @media (max-width: 600px) {
      font-size: 18px;
    }
  }
`;

export default TopicToDiscuss;
