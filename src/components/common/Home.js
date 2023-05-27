import React, { useEffect, useRef, useState } from 'react';
import lottie from 'lottie-web';
import animationData from './animation.json';
import './styles/Home.css';

const Home = () => {
  const animationContainerRef = useRef(null);
  const [showAnimation, setShowAnimation] = useState(true);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const anim = lottie.loadAnimation({
      container: animationContainerRef.current,
      renderer: 'svg',
      loop: false,
      autoplay: true,
      animationData: animationData
    });

    anim.addEventListener('complete', handleAnimationComplete);

    return () => {
      anim.removeEventListener('complete', handleAnimationComplete);
      anim.destroy();
    };
  }, []);

  const handleAnimationComplete = () => {
    setShowAnimation(false);
    setShowText(true);
  };

  return (
    <div>
      {showAnimation && (
        <div ref={animationContainerRef} id="animationContainer"></div>
      )}
      {showText && (
        <p className="text-after-animation">
          Welcome on KanBoard!
        </p>
      )}
    </div>
  );
};

export default Home;
