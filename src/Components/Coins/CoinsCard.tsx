import React, { useEffect, useState } from "react";
import { MainButton } from "../Button/mainButton";
import { Coin } from "./CoinsPage";

const loadingImage = "/loading.gif";


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
    onAddCoinClick,
    showReplaceText,
    onReplaceClick,
    selectedSixthCoin,
    onSelectSixthCoin,
  } = props;
  const [loading, setLoading] = useState(false);
  const [loadingCoinId, setLoadingCoinId] = useState<string | null>(null);
  const [loadingMap, setLoadingMap] = useState<Map<string, { isLoading: boolean; timestamp: number }>>(new Map());
  const LOADING_TIME_RANGE_MS = 120000; // 2 minutes

  
  useEffect(() => {
    const handleLoadingTimeout = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(handleLoadingTimeout);
  }, [selectedCoinId]);

  const isSixthCoin = selectedSixthCoin !== null && selectedSixthCoin.id === coin.id;
  const isShowingMoreInfo = coin.id === selectedCoinId && selectedCoinPrice;



 const handleMoreInfoClickWithLoading = (id: string) => {
    if (id === selectedCoinId && selectedCoinPrice) {
      handleMoreInfoClick("");
    } else {
      const coinLoadingData = loadingMap.get(id);

      if (coinLoadingData) {
        const { isLoading, timestamp } = coinLoadingData;
        const currentTime = Date.now();

        // אם עברו פחות מ-2 דקות מהלחיצה האחרונה והלחיצה הנוכחית היא לחיצה על אותו מטבע - אל תציג את הטעינה
        if (isLoading && currentTime - timestamp < LOADING_TIME_RANGE_MS && loadingCoinId === id) {
          // במקרה של לחיצה נוספת תוך 2 דקות, תריץ רק את הפונקציה שמציגה את המידע בלי לעדכן את הסטייט של הטעינה
          handleMoreInfoClick(id);
          return;
        }
      }

      setLoading(true);
      setLoadingCoinId(id);

      handleMoreInfoClick(id);

      setLoadingMap((prevLoadingMap) => {
        const updatedLoadingMap = new Map(prevLoadingMap);
        updatedLoadingMap.set(id, { isLoading: true, timestamp: Date.now() });
        return updatedLoadingMap;
      });
    }
  }
  
  
  
  


  return (
    <div className="coin-card">
      {loading && selectedCoinId === coin.id ? (
        <img src={loadingImage} alt="" className="coin-image" />
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
              <MainButton handleOnclick={() => handleMoreInfoClickWithLoading(coin.id)} title="Close" />
            </>
          ) : (
            <>
              {selectedCoinId === coin.id && <div className="coin-loading-indicator">Loading...</div>}
              {!isShowingMoreInfo && (
                <MainButton handleOnclick={() => handleMoreInfoClickWithLoading(coin.id)} title="More Info" />
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
    </div>
  );
};
