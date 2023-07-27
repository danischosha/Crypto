import React from "react";
import { Coin } from "./CoinsPage";

interface FavoriteCoinsPopupProps {
  favoriteCoins: Coin[];
  selectedCoinPrice: any;
  convertCurrency: (amount: number, currency: string) => string;
  onSave: () => void;
  onSelectReplacement: (coinId: string) => void;
  onClose: () => void;
  showReplaceButton: boolean;

  
}

export const FavoriteCoinsPopup: React.FC<FavoriteCoinsPopupProps> = ({
  favoriteCoins,
  selectedCoinPrice,
  convertCurrency,
  onSave,
  onSelectReplacement,
  onClose,
}) => {
  return (
    <div className="favorite-coins-popup">
      <h2>Select a Replacement Coin</h2>
      <ul>
        {favoriteCoins.map((coin) => (
          <li key={coin.id}>
            <button onClick={() => onSelectReplacement(coin.id)}>
              {coin.name} ({coin.symbol})
              <br />
              {selectedCoinPrice && (
                <span>Current Price: ${convertCurrency(selectedCoinPrice.USD, "USD")}</span>
              )}
            </button>
          </li>
        ))}
      </ul>
      <div className="popup-actions">
        <button onClick={onSave}>Save</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};
