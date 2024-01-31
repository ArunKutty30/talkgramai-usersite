import React, { useMemo, useRef } from "react";
import Slider from "react-slick";
import { useSearchParams } from "react-router-dom";
import styled from "styled-components";

import { ReactComponent as VectorIcon } from "../../assets/icons/Vector.svg";
import LeftIcon from "../../assets/icons/left-arrow.svg";
import RightIcon from "../../assets/icons/right-arrow.svg";
import { topicsData } from "../../utils/updatedtopic";
import LessonLevel from "../../components/LessonLevel";
import TopicToDiscuss from "../../components/TopicToDiscuss";

const LessonPlan: React.FC = () => {
  const sliderRef = useRef<Slider | null>(null);
  const [searchParams] = useSearchParams();
  const category = searchParams.get("category");
  const title = searchParams.get("title");

  const lessonData = useMemo(() => {
    if (!category || !title) return;

    return topicsData.find((f) => f.category === category && f.title === title);
  }, [category, title]);

  const settings = {
    dots: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const handlePrev = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  };

  const handleNext = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };

  const renderArrow = (
    <Arrows>
      <div onClick={handlePrev}>
        <img src={LeftIcon} alt="" />
      </div>
      <div onClick={handleNext}>
        <img src={RightIcon} alt="" />
      </div>
    </Arrows>
  );

  return (
    <LessonPlanWrapper>
      {!lessonData ? null : (
        <Slider {...settings} ref={(slider) => (sliderRef.current = slider)}>
          <Content className="slide-one">
            <VectorArrow>
              <VectorIcon />
            </VectorArrow>
            <LessonPlanContainer style={{ height: "calc(100vh - 137px)" }}>
              <Heading>
                <h3>TOPIC OF THE DAY</h3>
                <h1>{lessonData.title}</h1>
              </Heading>
              <Vector>
                <VectorIcon />
              </Vector>
            </LessonPlanContainer>
            {renderArrow}
          </Content>
          <Content>
            <TopicToDiscuss pointers={lessonData.pointers.slice(0, 4)} />
            {renderArrow}
          </Content>
          {/* <div>
            <TopicToDiscuss pointers={lessonData.pointers.slice(4, 8)} />
          </div> */}
          <Content>
            <LessonLevel title="BASIC" color="#FFD600" data={lessonData.vocabulary[0]} />
            {renderArrow}
          </Content>
          <Content>
            <LessonLevel title="INTERMEDIATE" color="#F7941F" data={lessonData.vocabulary[1]} />
            {renderArrow}
          </Content>
          <Content>
            <LessonLevel title="ADVANCE" color="#F91E35" data={lessonData.vocabulary[2]} />
            {renderArrow}
          </Content>
        </Slider>
      )}
    </LessonPlanWrapper>
  );
};

const LessonPlanWrapper = styled.div`
  height: calc(100vh - 136.8px);
  background: #f7941f;
  position: relative;
`;

const Content = styled.div`
  position: relative;
  overflow: hidden;
`;

const Heading = styled.div`
  max-width: 620px;

  h3 {
    color: #140837;
    font-size: 30px;
    letter-spacing: 0.606px;
    margin-bottom: 20px;
    font-family: "Inter", sans-serif;
    @media (max-width: 1020px) {
      font-size: 26px;
    }
    @media (max-width: 768px) {
      font-size: 24px;
      text-align: center;
    }
  }
  h1 {
    color: #fff;
    font-size: 82px;
    text-shadow: 0px 5px 0px #c56b00;
    @media (max-width: 1020px) {
      font-size: 62px;
    }
    @media (max-width: 768px) {
      font-size: 48px;
      text-align: center;
    }
  }
`;

const VectorArrow = styled.div`
  position: absolute;
  top: -240px;
  left: -180px;
  z-index: 1000;
  @media (max-width: 600px) {
    top: -280px;
    left: -230px;
  }
  @media (max-width: 425px) {
    top: -304px;
    left: -230px;
  }

  svg {
    max-width: 400px;
    width: 100%;
    max-height: 500px;
    height: 100%;
  }
`;

const Arrows = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 42px;
  position: absolute;
  top: 24px;
  right: 80px;

  @media (max-width: 768px) {
    right: 24px;
  }

  img {
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
`;

const LessonPlanContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 120px;
  @media (max-width: 600px) {
    padding-left: 0px;
  }
`;

const Vector = styled.div`
  position: absolute;
  top: 50%;
  right: 20px;
  transform: translate(-50%, -50%);
  aspect-ratio: 0.62637362637;
  max-width: 180px;
  width: 100%;

  svg {
    width: 100%;
    height: 100%;
    // max-height: 460px;
    // height: 100%;
    // @media (max-width: 1020px) {
    //   max-width: 260px;
    //   max-height: 300px;
    // }
    // @media (max-width: 600px) {
    //   display: none;
    // }
  }
`;

export default LessonPlan;
