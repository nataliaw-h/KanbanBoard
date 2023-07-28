import React, { useEffect, useRef, useState } from 'react';
import lottie from 'lottie-web';
import animationData from './animation.json';
import './styles/Home.css';
import { withTranslation } from 'react-i18next';

const Home = ({ t }) => {
  // Utworzenie referencji do kontenera animacji
  const animationContainerRef = useRef(null);

  // Inicjalizacja stanów
  const [showAnimation, setShowAnimation] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showDescription, setShowDescription] = useState(false);

  useEffect(() => {
    // Załadowanie animacji przy użyciu biblioteki lottie-web
    const anim = lottie.loadAnimation({
      container: animationContainerRef.current,
      renderer: 'svg',
      loop: false,
      autoplay: true,
      animationData: animationData
    });

    // Dodanie nasłuchiwacza na zdarzenie 'complete' animacji
    anim.addEventListener('complete', handleAnimationComplete);

    // Czyszczenie efektu ubocznego
    return () => {
      anim.removeEventListener('complete', handleAnimationComplete);
      anim.destroy();
    };
  }, []);

  // Obsługa zakończenia animacji
  const handleAnimationComplete = () => {
    setShowAnimation(false);
    setTimeout(() => {
      setShowWelcome(true);
    }, 1000); 
    setTimeout(() => {
      setShowDescription(true);
    }, 1000);
  };

  return (
    <div>
      {showAnimation && (
        <div ref={animationContainerRef} id="animationContainer"></div>
      )}
      {showWelcome && (
        <p className="text-after-animation">{t('home.welcome')}</p>
      )}
      {showDescription && (
        <p className="description">{t('home.description')}</p>
      )}
    </div>
  );
};

export default withTranslation()(Home);
