import React, { useState } from "react";
import { MainButton } from "../Button/mainButton";
import { Coin } from "./CoinsPage";
import { LoadingPopup } from "../LoadingPopup/LoadingPopup";

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
  loading: boolean; 

}

export const CoinCard: React.FC<CoinCardProps> = (props) => {
  const {
    coin,
    selectedCoinId,
    selectedCoinPrice,
    handleMoreInfoClick,
    toggleFavoriteCoin,
    convertCurrency,
    onAddCoinClick,
    showReplaceText,
    onReplaceClick,
    selectedSixthCoin,
    loading,

  } = props;

  const isSixthCoin = selectedSixthCoin !== null && selectedSixthCoin.id === coin.id;
  const isShowingMoreInfo = coin.id === selectedCoinId && selectedCoinPrice;

  

  

  return (
    <div className="coin-card">
      {loading && selectedCoinId === coin.id ? (
        <LoadingPopup />
      ) : (
        <>
          {loading ? (
            <LoadingPopup />
          ) : (
            <>
          <img src={coin.imageUrl} alt={coin.name} className="coin-image" />
              <p>{coin.symbol}</p>
              <p>{coin.name}</p>
              {isShowingMoreInfo && selectedCoinPrice ? (
                <>
                  <p>USD: {selectedCoinPrice.USD} $</p>
                  <p>EUR: {convertCurrency(selectedCoinPrice.USD, "EURO")} €</p>
                  <p>ILS: {convertCurrency(selectedCoinPrice.USD, "ILS")} ₪</p>
                  <MainButton handleOnclick={() => handleMoreInfoClick(coin.id)} title="Close" />
                </>
              ) : (
                <>
                  {selectedCoinId === coin.id && (
                    <div className="coin-loading-indicator">Loading...</div>
                  )}
                  {!isShowingMoreInfo && (
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
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};