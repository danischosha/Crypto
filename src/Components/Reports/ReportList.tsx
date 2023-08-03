import React from 'react';
import { MainButton } from '../Button/mainButton';
import { Coin } from '../Coins/CoinsPage'; // Import the Coin type if not already done

interface ReportListPopupProps {
  favoriteCoins: Coin[];
  handleReplaceSixthCoin: (coinId: string) => void;
  handleClosePopup: () => void;
}

const ListPopup: React.FC<ReportListPopupProps> = ({
  favoriteCoins,
  handleReplaceSixthCoin,
  handleClosePopup,
}) => {
  return (
    <div className="popup-container">
      <div className="popup-content">
        <h3>Your Report List:</h3>
        <ul>
          {favoriteCoins.map((favCoin) => (
            <li key={favCoin.id} className="favorite-coin-card">
              <div className="coin-info">
                <img src={favCoin.imageUrl} alt={favCoin.name} />
                <span>{favCoin.name}</span>
                <span>{favCoin.symbol}</span>
              </div>
        
            </li>
          ))}
        </ul>
        <MainButton title="Save & Close" handleOnclick={handleClosePopup} />
      </div>
    </div>
  );
};

export default ListPopup;
