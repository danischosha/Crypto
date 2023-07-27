import React from "react";
import { MainButton } from "../Button/mainButton";
import { Coin } from "./CoinsPage";

interface CoinCardProps {
  coin: Coin;
  selectedCoinId: string | null;
  selectedCoinPrice: any | null;
  handleMoreInfoClick: (id: string) => void;
  toggleFavoriteCoin: (id: string) => void;
  convertCurrency: (amount: number, currency: string) => string;
  isCoinFavorite: (id: string) => boolean;
  onAddCoinClick: (id: string) => void;
  showReplaceText: boolean;
  onReplaceClick: () => void;
  selectedSixthCoin: Coin | null;
  onSelectSixthCoin: (coin: Coin) => void;
}

export const CoinCard: React.FC<CoinCardProps> = (props) => {
  const {
    coin,
    selectedCoinId,
    selectedCoinPrice,
    handleMoreInfoClick,
    toggleFavoriteCoin,
    convertCurrency,
    isCoinFavorite,
    onAddCoinClick,
    showReplaceText,
    onReplaceClick,
    selectedSixthCoin,
    onSelectSixthCoin,
  } = props;

  const isSixthCoin = selectedSixthCoin !== null && selectedSixthCoin.id === coin.id;

  const handleSelectSixthCoin = () => {
    onSelectSixthCoin(coin);
  };

  return (
    <div className="coin-card">
      <img src={coin.imageUrl} alt={coin.name} className="coin-image" />
      <p>{coin.symbol}</p>
      <p>{coin.name}</p>

      {coin.id === selectedCoinId && selectedCoinPrice && (
        <>
          <p>USD: {selectedCoinPrice.USD} $</p>
          <p>EUR: {convertCurrency(selectedCoinPrice.USD, "EURO")} €</p>
          <p>ILS: {convertCurrency(selectedCoinPrice.USD, "ILS")} ₪</p>
          <MainButton handleOnclick={() => handleMoreInfoClick(coin.id)} title="Close" />
        </>
      )}

      {coin.id !== selectedCoinId && (
        <MainButton handleOnclick={() => handleMoreInfoClick(coin.id)} title="More Info" />
      )}

      {coin.favorite ? (
        <MainButton handleOnclick={() => toggleFavoriteCoin(coin.id)} title="Remove Coin" />
      ) : (
        <MainButton
          handleOnclick={() => (isSixthCoin ? onReplaceClick() : onAddCoinClick(coin.id))}
          title={isSixthCoin && showReplaceText ? "Replace" : "Add Coin"} 
        />
      )}
    </div>
  );
};
