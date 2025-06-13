import React, { useRef, useState, useEffect, useCallback } from 'react';
import '../styles/IntroSequence.css';

const videos = [
  { src: '/videos/intro1.mp4', autoNext: true, showAller: true, muted: true },
  { src: '/videos/intro1loop.mp4', loop: true, showAller: true, muted: true },
  { src: '/videos/intro13.mp4', showArrowAfterEnd: true },
  { src: '/videos/intro14.mp4', showArrowAfterEnd: true },
  { src: '/videos/intro15.mp4', showArrowAfterEnd: true }
];

const cardPositions = [
  { top: '158px', left: '-43px' },
  { top: '158px', left: '186px' },
  { top: '158px', left: '415px' },
  { top: '390px', left: '-43px' },
  { top: '390px', left: '186px' },
  { top: '390px', left: '415px' },
];

const IntroSequence = ({ onFinish, audioRef }) => {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [skipToThird, setSkipToThird] = useState(false);
  const [shouldPlay, setShouldPlay] = useState(true);
  const videoRef = useRef();
  const current = videos[currentVideo];
  const [showCharacterSelection, setShowCharacterSelection] = useState(false);

  // Play audio once on first user interaction
  useEffect(() => {
    const handleAudioPlayOnce = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().catch(error => {
          console.log('Audio play after interaction failed:', error);
        });
      }
    };

    document.addEventListener('click', handleAudioPlayOnce, { once: true });

    return () => {
      document.removeEventListener('click', handleAudioPlayOnce);
    };
  }, [audioRef]);

  // Pause music and trigger onFinish
  const handleCharacterSelect = (characterIndex) => {
  
    onFinish(characterIndex);
  };

  const handleIntroEnd = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    onFinish();
  };

  // Show character selection after last video
  useEffect(() => {
    if (currentVideo === 4) {
      const timeout = setTimeout(() => {
        setShowCharacterSelection(true);
      }, 2500);
      return () => clearTimeout(timeout);
    } else {
      setShowCharacterSelection(false);
    }
  }, [currentVideo]);

  const playVideoSafely = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      const promise = video.play();
      if (promise !== undefined) {
        promise.catch((err) => {
          console.warn('Autoplay blocked:', err);
        });
      }
    }
  }, []);

  useEffect(() => {
    if (shouldPlay) {
      playVideoSafely();
    }
  }, [currentVideo, shouldPlay, playVideoSafely]);

  const handleVideoEnd = () => {
    if (currentVideo === 0 && !skipToThird) {
      setCurrentVideo(1);
      setShouldPlay(true);
    } else if (current.showArrowAfterEnd) {
      videoRef.current.pause();
    }
  };

  const handleLoadedData = () => {
    if (shouldPlay) {
      playVideoSafely();
    }

   
  };

  const handleAllerClick = () => {
    if (currentVideo === 0) {
      setSkipToThird(true);
      setCurrentVideo(2);
    } else if (currentVideo === 1) {
      setCurrentVideo(2);
    }
    setShouldPlay(true);
  };

  const handleArrowClick = () => {
    if (currentVideo < videos.length - 1) {
      setCurrentVideo(currentVideo + 1);
      setShouldPlay(true);
    } else {
      handleIntroEnd();
    }
  };

  return (
    <div className="intro-sequence">
      <video
        key={currentVideo}
        ref={videoRef}
        src={current.src}
        autoPlay={false}
        loop={current.loop}
        muted={current.muted}
        onEnded={handleVideoEnd}
        onLoadedData={handleLoadedData}
        className="video-player"
        playsInline
      />

      {(currentVideo === 0 || currentVideo === 1) && (
        <button className="aller-btn visible-btn" onClick={handleAllerClick}>
          Aller
        </button>
      )}

      {current.showArrowAfterEnd && currentVideo !== 4 && (
        <button className="arrow-btn" onClick={handleArrowClick}>
          ➤
        </button>
      )}

      {currentVideo === 4 && showCharacterSelection && (
        <div className="intro-character-selection">
          <h2>Sélectionner votre personnage</h2>
          {cardPositions.map((pos, index) => (
            <div
              key={index}
              className="intro-character-card"
              style={{
                position: 'absolute',
                top: pos.top,
                left: pos.left,
              }}
              onClick={() => handleCharacterSelect(index + 1)}
            >
              <img
                src={`/characters/char${index + 1}.jpg`}
                alt={`Character ${index + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IntroSequence;
