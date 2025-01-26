import React, { useState, useRef, useEffect } from 'react';
import './App.css';

const App = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [station, setStation] = useState('antyradio');
  const [volume, setVolume] = useState(0.5);
  const [location, setLocation] = useState(null);
  const [browserInfo, setBrowserInfo] = useState('');
  const audioRef = useRef(null);

  const stations = {
    antyradio: 'http://redir.atmcdn.pl/sc/o2/Eurozet/live/antyradio.livx',
    rmf: 'http://stream.rmf.fm/rmf_fm',
    eska: 'http://stream.eska.pl:80/eska',
  };

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(position.coords);
        },
        (error) => {
          console.error(error);
        }
      );
    }

    // Get browser information
    const userAgent = navigator.userAgent;
    setBrowserInfo(userAgent);

    // Set up the audio stream
    audioRef.current = new Audio(stations[station]);
    audioRef.current.volume = volume;
    audioRef.current.preload = 'none';

    // Update the date/time every second
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [station, volume]);

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleStationChange = (event) => {
    setStation(event.target.value);
    setIsPlaying(false);
  };

  const handleVolumeChange = (event) => {
    setVolume(event.target.value);
    audioRef.current.volume = event.target.value;
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Radio Internetowe</h1>
      </header>
      <main className="main-content">
        <div className="radio-player">
          <h2>Odtwarzacz Antyradio</h2>
          <select onChange={handleStationChange} value={station}>
            <option value="antyradio">Antyradio</option>
            <option value="rmf">RMF</option>
            <option value="eska">Eska</option>
          </select>
          <button onClick={togglePlayPause}>
            {isPlaying ? 'Pauza' : 'Odtwórz'}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
          />
          <div className="date-time">
            <p>Data: {currentDateTime.toLocaleDateString()}</p>
            <p>Godzina: {currentDateTime.toLocaleTimeString()}</p>
          </div>
        </div>

        <div className="location-browser-info">
          <p>Location: {location ? `${location.latitude}, ${location.longitude}` : 'Loading...'}</p>
          <p>Browser Info: {browserInfo}</p>
        </div>
      </main>
      <footer className="footer">
        <p>&copy; 2025 Radio Internetowe. Wszelkie prawa zastrzeżone.</p>
      </footer>

      {/* Cookie consent and privacy policy popup */}
      <div className="cookie-consent">
        <div className="cookie-content">
          <p>Nasza strona używa plików cookie w celu poprawy jakości usług. Kontynuując, zgadzasz się na ich użycie. <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">Polityka prywatności</a></p>
          <button className="cookie-button" onClick={() => document.querySelector('.cookie-consent').style.display = 'none'}>
            Zgadzam się
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
