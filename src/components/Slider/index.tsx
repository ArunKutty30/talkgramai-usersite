import React, { useEffect, useState } from "react";
import orangeColons from "../../assets/images/orangeColons.png";
import { interest } from "../../utils/topic";
import { Swiper, SwiperSlide } from "swiper/react";
import "./style.css";

import "swiper/css";
import "swiper/css/navigation";

import { Navigation } from "swiper/modules";
import { useParams } from "react-router-dom";

export default function QuestionSlider() {
  const { id } = useParams();
  const topicNumber = id ? Number(id) : 0;

  // Calculate the number of sets based on 5 questions per page
  // Sample data for questions and images
  const sampleQuestions = interest[topicNumber]?.pointers;
  const sampleVocabulary = interest[topicNumber].vocabulary || [];

  // Initialize numQuestionSets based on the screen width
  // const numQuestionSets = Math.ceil(sampleQuestions?.length / 5);

  const [numVocabularySets, setNumVocabularySets] = useState<number>(
    Math.ceil(sampleVocabulary?.length / 10)
  );
  // const [vocabularySlider, setVocabularySlider] = useState(5);

  const screenWidth = window.innerWidth;
  useEffect(() => {
    // Function to calculate numQuestionSets based on screen width
    const calculateNumVocabularySets = () => {
      // Define your logic to calculate no. of slides and no. of cards per slide based on screen width
      let numSets = 6;
      if (screenWidth >= 1000) {
        numSets = Math.ceil(sampleVocabulary?.length / 6); // Larger screens
        // setVocabularySlider(6);
      } else if (screenWidth < 1000 && screenWidth >= 700) {
        numSets = Math.ceil(sampleVocabulary?.length / 4); // medium screens
        // setVocabularySlider(4);
      } else if (screenWidth < 700 && screenWidth > 500) {
        numSets = Math.ceil(sampleVocabulary?.length / 2); // medium screens
        // setVocabularySlider(2);
      } else if (screenWidth < 500) {
        numSets = Math.ceil(sampleVocabulary?.length / 1); // Smaller screens
        // setVocabularySlider(1);
      }
      setNumVocabularySets(numSets);
    };

    // Calculate initial numQuestionSets
    calculateNumVocabularySets();

    // Listen for window resize events and recalculate numQuestionSets
    window.addEventListener("resize", calculateNumVocabularySets);

    // Cleanup the event listener on unmount
    return () => {
      window.removeEventListener("resize", calculateNumVocabularySets);
    };
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "4rem",
        }}
      >
        <Swiper
          navigation={true}
          modules={[Navigation]}
          className="mySwiper"
          style={{
            maxHeight: "40rem",
            minHeight: "35rem",
            margin: screenWidth < 500 ? "0.5rem" : "2rem",
            borderRadius: "1rem",
            background: "#F0F6F0",
            width: "100%",
          }}
        >
          {/* Slide 1: Image */}
          <SwiperSlide
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "40rem",
              minHeight: "35rem",
              padding: "2rem",
              textAlign: "center",
              background:
                "linear-gradient(90deg, rgba(255,93,0,0.7624299719887955) 0%, rgba(255,121,79,0.19940476190476186) 29%, rgba(255,93,0,0.20780812324929976) 72%, rgba(255,93,0,0.5999649859943977) 100%)",
            }}
          >
            <h5 style={{ color: "#ff794f" }}>Topic of the day</h5>
            <h2 style={{ padding: "1rem 2rem 2rem", color: "#364136" }}>
              {interest[topicNumber]?.title}
            </h2>
          </SwiperSlide>

          {/* Topics */}
          {/* {Array.from({ length: numQuestionSets }, (_, setIndex) => { */}
          {Array.from({ length: 1 }, (_, setIndex) => {
            // Determine the background color based on the setIndex
            return (
              <SwiperSlide
                key={`vocabulary_set${setIndex + 1}`}
                style={{
                  background: "#F0F6F0",
                  padding: "2rem",
                  textAlign: "left",
                }}
              >
                {setIndex === 0 && <h1 style={{ padding: "1rem 3rem" }}>Topic to be discussed</h1>}
                <div className="questions">
                  {sampleQuestions
                    // .slice(setIndex * 4, (setIndex + 1) * 4)
                    .slice(0, 4)
                    .map((questions, index) => (
                      <div
                        key={`vocabulary_set${setIndex + 1}_${index}`}
                        style={{
                          padding: "1rem",
                          borderRadius: "1rem",
                          background: "#364136",
                          fontWeight: "bold",
                          color: "white",
                          display: "flex",
                        }}
                        className="card-content"
                      >
                        <div>
                          <div
                            style={{
                              background: "#FF794F",
                              color: "#364136",
                              borderRadius: "50%",
                              marginRight: "1rem",
                              width: "32px",
                              height: "32px",
                              textAlign: "center",
                              lineHeight: "32px",
                            }}
                          >
                            {setIndex * 4 + index + 1}
                          </div>
                          <span style={{ color: "#FF794F" }}>{questions.pointer}</span>
                        </div>
                        <ul>
                          {questions.questions.map((m, index) => (
                            <li key={index.toString()}>{m}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                </div>
              </SwiperSlide>
            );
          })}

          {/* Basic vocabulary */}
          {Array.from({ length: numVocabularySets }, (_, setIndex) => (
            <SwiperSlide
              key={`vocabulary_set${setIndex + 1}`}
              style={{
                background: "#F0F6F0",
                padding: screenWidth < 350 ? "0rem" : "2rem",
                textAlign: "left",
              }}
            >
              <h1 style={{ padding: "1rem 3rem" }}>Basic</h1>
              <div className="vocabulary">
                {sampleVocabulary &&
                  sampleVocabulary[0].map((vocabulary, index) => (
                    <div
                      key={`vocabulary_set${setIndex + 1}_${index}`}
                      style={{
                        // padding: "1rem",
                        borderRadius: "1rem",
                        background: "#364136",
                        color: "#FF794F",
                        margin: screenWidth < 500 ? "0rem" : "1rem",
                        height: "100%",
                      }}
                    >
                      <h2
                        style={{
                          color: "#FF794F",
                          padding: "1rem",
                          borderBottom: "2px solid white",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          textTransform: "capitalize",
                          fontSize: "1.5rem",
                        }}
                      >
                        {vocabulary.word}

                        <img src={orangeColons} alt="" style={{ width: "2rem" }} />
                      </h2>
                      <div style={{ padding: "1rem", color: "#fff" }}>
                        {/* <p
                          style={{
                            color: index % 2 !== 0 ? "#FF794F" : "#364136",
                          }}
                        >
                          SPEECH: {vocabulary.speech}
                        </p> */}
                        <br />
                        {vocabulary.meaning}
                      </div>
                    </div>
                  ))}
              </div>
            </SwiperSlide>
          ))}

          {/* Intermediate vocabulary */}
          {Array.from({ length: numVocabularySets }, (_, setIndex) => (
            <SwiperSlide
              key={`vocabulary_set${setIndex + 1}`}
              style={{
                background: "#F0F6F0",
                padding: screenWidth < 350 ? "0rem" : "2rem",
                textAlign: "left",
              }}
            >
              <h1 style={{ padding: "1rem 3rem" }}>Intermediate</h1>
              <div className="vocabulary">
                {sampleVocabulary &&
                  sampleVocabulary[1].map((vocabulary, index) => (
                    <div
                      key={`vocabulary_set${setIndex + 1}_${index}`}
                      style={{
                        // padding: "1rem",
                        borderRadius: "1rem",
                        background: "#364136",
                        color: "#FF794F",
                        margin: screenWidth < 500 ? "0rem" : "1rem",
                        height: "100%",
                      }}
                    >
                      <h2
                        style={{
                          color: "#FF794F",
                          padding: "1rem",
                          borderBottom: "2px solid white",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          textTransform: "capitalize",
                          fontSize: "1.5rem",
                        }}
                      >
                        {vocabulary.word}

                        <img src={orangeColons} alt="" style={{ width: "2rem" }} />
                      </h2>
                      <div style={{ padding: "1rem", color: "#fff" }}>
                        {/* <p
                          style={{
                            color: index % 2 !== 0 ? "#FF794F" : "#364136",
                          }}
                        >
                          SPEECH: {vocabulary.speech}
                        </p> */}
                        <br />
                        {vocabulary.meaning}
                      </div>
                    </div>
                  ))}
              </div>
            </SwiperSlide>
          ))}

          {/* Hard vocabulary */}
          {Array.from({ length: numVocabularySets }, (_, setIndex) => (
            <SwiperSlide
              key={`vocabulary_set${setIndex + 1}`}
              style={{
                background: "#F0F6F0",
                padding: screenWidth < 350 ? "0rem" : "2rem",
                textAlign: "left",
              }}
            >
              <h1 style={{ padding: "1rem 3rem" }}>Advanced</h1>
              <div className="vocabulary">
                {sampleVocabulary &&
                  sampleVocabulary[2].map((vocabulary, index) => (
                    <div
                      key={`vocabulary_set${setIndex + 1}_${index}`}
                      style={{
                        // padding: "1rem",
                        borderRadius: "1rem",
                        background: "#364136",
                        color: "#FF794F",
                        margin: screenWidth < 500 ? "0rem" : "1rem",
                        height: "100%",
                      }}
                    >
                      <h2
                        style={{
                          color: "#FF794F",
                          padding: "1rem",
                          borderBottom: "2px solid white",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          textTransform: "capitalize",
                          fontSize: "1.5rem",
                        }}
                      >
                        {vocabulary.word}

                        <img src={orangeColons} alt="" style={{ width: "2rem" }} />
                      </h2>
                      <div style={{ padding: "1rem", color: "#fff" }}>
                        {/* <p
                          style={{
                            color: index % 2 !== 0 ? "#FF794F" : "#364136",
                          }}
                        >
                          SPEECH: {vocabulary.speech}
                        </p> */}
                        <br />
                        {vocabulary.meaning}
                      </div>
                    </div>
                  ))}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
}
