import React, { useEffect, useRef, useState } from "react";
import autoAnimate from "@formkit/auto-animate";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDropDown";

interface IFaqCardProps {
  question: string;
  answer: string;
}

const FaqCard: React.FC<IFaqCardProps> = ({ question, answer }) => {
  const [show, setShow] = useState(false);
  const parent = useRef(null);

  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  const reveal = () => setShow(!show);

  return (
    <div ref={parent} className="faq-card">
      <div className="faq-card-title" onClick={reveal}>
        <h5>{question}</h5>
        <ArrowDownwardIcon />
      </div>
      {show && <p style={{ paddingBottom: "20px", fontSize: 16 }}>{answer}</p>}
    </div>
  );
};

export default FaqCard;
