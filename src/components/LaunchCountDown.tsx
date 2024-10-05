import React from 'react';
import { addPrefixZero } from '../utils/helpers';
import ReactCountdown, { CountdownRenderProps } from 'react-countdown';
import logo from '../assets/logo/logo.png';
import paperBg from '../assets/images/paper-bg.png';
import amount from '../assets/images/amount.png';
import './countdown/styles.css';

const renderer = ({ completed, hours, minutes, seconds, days }: CountdownRenderProps) => {
  if (completed) {
    return (
      <h1 style={{ display: 'inline-block', minWidth: '67px' }} className="countdown">
        {addPrefixZero(days)} day : {addPrefixZero(hours)} hrs : {addPrefixZero(minutes)} mins:
        {addPrefixZero(seconds)} secs
      </h1>
    );
  } else {
    return (
      <h1 style={{ display: 'inline-block', minWidth: '67px' }} className="countdown">
        {addPrefixZero(days)} day : {addPrefixZero(hours)} hrs : {addPrefixZero(minutes)} mins :
        {addPrefixZero(seconds)} secs
      </h1>
    );
  }
};

const LaunchCountDown = ({
  launchTime,
  isLaunchTimePassed,
  setShowConfetti,
}: {
  launchTime: number;
  isLaunchTimePassed: boolean | 'fetching';
  setShowConfetti: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div
      className="Launch-countdown-hold"
      style={{ background: `url(${paperBg})`, backgroundSize: 'cover' }}
    >
      <img src={logo} alt="Simple Trade" className="talkgram-logo" />
      <h5 className="heading1">Live, Personal English Tutoring Online. </h5>
      <p className="description">
        Welcome to Simple Trade, your key to mastering English. As we unveil our beta version, we
        invite you to be among the first to experience it.
      </p>

      {isLaunchTimePassed ? (
        <h1 className="title">We are live now</h1>
      ) : (
        <h1 className="beta-launch">Beta launch on</h1>
      )}

      {isLaunchTimePassed ? (
        <div className="launch-container">
          <button
            className="launch-btn"
            onClick={() => {
              localStorage.setItem('launched', JSON.stringify(true));
              setShowConfetti(true);
            }}
          >
            Launch Now
          </button>
        </div>
      ) : (
        <ReactCountdown date={launchTime} renderer={renderer} />
      )}
      <img src={amount} alt="amount" className="amountimg" />
    </div>
  );
};

export default LaunchCountDown;
