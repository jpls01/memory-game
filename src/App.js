import React, { useState, useEffect } from 'react';
import './App.css';

const images = [{ id: 1, url: 'https://picsum.photos/id/237/150/150' }, { id: 2, url: 'https://picsum.photos/id/238/150/150' }, { id: 3, url: 'https://picsum.photos/id/239/150/150' }, { id: 4, url: 'https://picsum.photos/id/240/150/150' }, { id: 5, url: 'https://picsum.photos/id/241/150/150' }, { id: 6, url: 'https://picsum.photos/id/242/150/150' }, { id: 7, url: 'https://picsum.photos/id/243/150/150' }, { id: 8, url: 'https://picsum.photos/id/244/150/150' },];

function shuffle(array) {
  const shuffled = array.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function App() {
  const [cards, setCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [showCards, setShowCards] = useState(false);
  const [flipAll, setFlipAll] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [showLeaderboard, setShowLeaderboard] = useState(false);


  //init game
  useEffect(() => {
    const shuffledCards = shuffle([...images, ...images]);
    setCards(shuffledCards);
    setMatchedCards([]);
    setSelectedCards([]);
    setTimer(0);
    clearInterval(intervalId);
    setShowCards(true);
    setTimeout(() => {
      setFlipAll(true);
    }, 2000);
// eslint-disable-next-line
  }, []);

  useEffect(() => {
    // eslint-disable-next-line
    if (selectedCards.length === 2) {
      if (cards[selectedCards[0]].id === cards[selectedCards[1]].id) {
        setMatchedCards([...matchedCards, ...selectedCards]);
      }
      setTimeout(() => {
        setSelectedCards([]);
      }, 1000);
    }// eslint-disable-next-line
  }, [selectedCards]);


  //#region handleCardClick
  const handleCardClick = (index) => {
    if (selectedCards.length === 2 || matchedCards.includes(index) || selectedCards.includes(index) || !showCards) {
      return;
    }
    const newSelectedCards = [...selectedCards, index];
    setSelectedCards(newSelectedCards);
    if (newSelectedCards.length === 2) {
      if (cards[newSelectedCards[0]].id === cards[newSelectedCards[1]].id) {
        setMatchedCards([...matchedCards, ...newSelectedCards]);
      }
      setTimeout(() => {
        setSelectedCards([]);
      }, 1000);
    }
    //Start timer
    if (selectedCards.length === 0 && matchedCards.length < 2 && timer === 0) {
      setIntervalId(setInterval(() => {
        setTimer(timer => timer + 1);
      }, 1000));
    }
  };
  //#endregion
  //#region Score and win message
  useEffect(() => {
    if (matchedCards.length === cards.length * 2 && timer > 0) {
      clearInterval(intervalId);
      const score = {
        playerName,
        time: timer,
        date: new Date().toISOString(),
      };
      const scores = JSON.parse(localStorage.getItem('scores') || '[]');
      localStorage.setItem('scores', JSON.stringify([...scores, score]));
      setTimeout(() => { alert(`Congratulations! You won in ${timer} seconds!`); }, 50);
    }// eslint-disable-next-line
  }, [matchedCards]);
  //#endregion
  //#region handleRestartClick
  const handleRestartClick = () => {
    const shuffledCards = shuffle([...images, ...images]);
    setCards(shuffledCards);
    setSelectedCards([]);
    setMatchedCards([]);
    setTimer(0);
    clearInterval(intervalId);
    setFlipAll(false);
    setTimeout(() => {
      setFlipAll(true);
    }, 2000);
    setTimeout(() => {
      setFlipAll(false);
    }, 1000);
  };
  //#endregion
  //#region handleLeaderboardClick
  const handleLeaderboardClick = () => {
    setShowLeaderboard(true);
  };

  const handleHideLeaderboardClick = () => {
    setShowLeaderboard(false);
  };
  //#endregion

  const scores = JSON.parse(localStorage.getItem('scores') || '[]');

  //#region Clear Local storage aka clear scores and restart the game

  const clearLocalStorage = () => {
    localStorage.clear();
    setShowLeaderboard(false);
    handleRestartClick();
  };
  //#endregion

  //#region if player name is empty set to 'Player 1'
  useEffect(() => {
    if (!playerName) {
      setPlayerName('Player 1');
    }// eslint-disable-next-line
  }, []);
  //#endregion

  return (
    <div className="App">
      <h1>Memory Card Game</h1>
      <h3>Match all the cards in the shortest time possible!</h3>
      <p className="timer">Time: {timer}</p>
      <div className="cards-container">
        <button className="btn" onClick={handleRestartClick}>
          Restart
        </button>
        <button className="btn" onClick={handleLeaderboardClick}>
          View Leaderboard
        </button>
      </div>
      <div className="cards-container">
        <label htmlFor="playerName">Player Name:</label>
        <input
          id="playerName"
          type="text"
          value={playerName}
          placeholder='Player 1'
          onChange={(e) => setPlayerName(e.target.value)}
        />
      </div>



      <div className="cards-container">
        {cards.map((image, index) => (
          <div
            key={index}
            className={`card ${selectedCards.includes(index) ? 'selected' : ''
              } ${matchedCards.includes(index) ? 'matched' : ''
              } ${flipAll ? 'flipped' : 'notflipped'}`}
            onClick={() => handleCardClick(index)}
          >
            <img
              src={image.url}
              alt={`card ${image.id}`}
            />
          </div>
        ))}
      </div>
      {showLeaderboard && (
        <div className="leaderboard-modal">
          <div className="leaderboard-content">
            <button className='btn' onClick={handleHideLeaderboardClick}>Hide Leaderboard</button>
            <button className='btn' onClick={clearLocalStorage}>Clear Scores</button>

            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Player Name</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {scores
                  .sort((a, b) => a.time - b.time)
                  .map((score, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{score.playerName}</td>
                      <td>{score.time}s</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

      )}

    </div>
  );
}

export default App;
