import { useEffect, useState } from "react";
import { MainButton } from "../Button/mainButton";
import "./CoinsPage.css";
import { CoinCard } from "../Coins/CoinsCard"
import { FavoriteCoinsPopup } from "./FavoriteCoinsPopup";




export interface Coin {
  favorite: any;
  id: string;
  symbol: string;
  name: string;
  imageUrl: string;
  sortOrder: number;
}



export const CoinsPage = () => {

  const [coinsData, setCoinsData] = useState<Coin[]>([]);
  const [selectedCoinId, setSelectedCoinId] = useState<string | null>(null);
  const [favoriteCoins, setFavoriteCoins] = useState<Coin[]>([]); // Update the type here
  const [selectedCoinPrice, setSelectedCoinPrice] = useState<any | null>(null);
  const [showFavoriteCoins, setShowFavoriteCoins] = useState<boolean>(false);
  const [showReplaceFavoriteCoins, setShowReplaceFavoriteCoins] = useState<boolean>(false);
  const [selectedSixthCoin, setSelectedSixthCoin] = useState<Coin | null>(null);
  const [selectedReplacementCoinId, setSelectedReplacementCoinId] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showReplacementPopup, setShowReplacementPopup] = useState(false);
  const [showReplaceText, setShowReplaceText] = useState(false); // Add the missing state


  const [showReplaceFavoriteCoinsList, setShowReplaceFavoriteCoinsList] = useState<boolean>(false);
  const [selectedSixthCoinReplacementId, setSelectedSixthCoinReplacementId] = useState<string | null>(null);

  const [showFavoriteCoinsPopup, setShowFavoriteCoinsPopup] = useState(false);

















  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://min-api.cryptocompare.com/data/all/coinlist');
        const data = await response.json();
        const transformedData = Object.keys(data.Data).map((key: string) => {
          const coin = data.Data[key];
          return {
            id: key,
            symbol: coin.Symbol,
            name: coin.CoinName,
            imageUrl: `https://www.cryptocompare.com${coin.ImageUrl}`,
            sortOrder: coin.SortOrder,
            favorite: false,
          };
        });
        const sortedData = transformedData.sort((a, b) => a.sortOrder - b.sortOrder);
        const popularCoins = sortedData.slice(0, 100);
        setCoinsData(popularCoins);
      } catch (error) {
        console.error(' שגיאה:', error);
      }
    };

    fetchData();
  }, []);



  useEffect(() => {
    const favoriteCoins = JSON.parse(localStorage.getItem('favoriteCoins') || '[]');
    setFavoriteCoins(favoriteCoins);
  }, []);


  useEffect(() => {
    if (selectedSixthCoinReplacementId && selectedSixthCoin) {
      const sixthCoinIndex = favoriteCoins.findIndex((coin) => coin.id === selectedSixthCoin.id);
      const replacementCoinIndex = coinsData.findIndex(
        (coin) => coin.id === selectedSixthCoinReplacementId
      );

      if (sixthCoinIndex !== -1 && replacementCoinIndex !== -1) {
        const updatedFavoriteCoins = [...favoriteCoins];
        updatedFavoriteCoins[sixthCoinIndex] = coinsData[replacementCoinIndex];
        setFavoriteCoins(updatedFavoriteCoins);
        localStorage.setItem("favoriteCoins", JSON.stringify(updatedFavoriteCoins));
        setSelectedSixthCoinReplacementId(null);
      }
    }
  }, [selectedSixthCoinReplacementId]);





  const handleMoreInfoClick = async (id: string) => {
    try {
      if (selectedCoinId === id) {
        setSelectedCoinId(null);
      } else {
        const response = await fetch(
          `https://min-api.cryptocompare.com/data/price?fsym=${id}&tsyms=USD`
        );
        const coinPriceData = await response.json();
        setSelectedCoinPrice(coinPriceData); 
        setSelectedCoinId(id); 
      }
    } catch (error) {
      console.error("שגיאה:", error);
    }
  };


  const handleSelectSixthCoin = (coin: Coin) => {
    setSelectedSixthCoin(coin);
    setShowPopup(true);
    setShowReplaceFavoriteCoinsList(true);
  };




  const toggleFavoriteCoin = (id: string) => {
    const coinIndex = coinsData.findIndex((coin) => coin.id === id);

    if (coinIndex !== -1) {
      const updatedCoinsData = [...coinsData];
      updatedCoinsData[coinIndex].favorite = !updatedCoinsData[coinIndex].favorite;

      setCoinsData(updatedCoinsData);

      const updatedFavoriteCoins = updatedCoinsData.filter((coin) => coin.favorite);

      if (updatedFavoriteCoins.length <= 5) {
        localStorage.setItem("favoriteCoins", JSON.stringify(updatedFavoriteCoins));
        setFavoriteCoins(updatedFavoriteCoins);
        setShowFavoriteCoins(false); 
      } else {
        setShowFavoriteCoins(true); 
      }
    }
  };



  const isCoinFavorite = (id: string) => {
    return favoriteCoins.some((coin) => coin.id === id);
  };



  const handleAddReplaceClick = (id: string) => {
    if (favoriteCoins.length >= 5) {
      const selectedCoin = coinsData.find((coin) => coin.id === id);
      setSelectedSixthCoin(selectedCoin || null);

      const isAlreadyFavorite = isCoinFavorite(id);
      setShowReplaceText(!isAlreadyFavorite); 
      setShowPopup(true);

      if (isAlreadyFavorite) {
        setShowFavoriteCoins(true);
      } else {
        setShowFavoriteCoins(false);
        setShowReplacementPopup(true);
      }
    } else {
      const isAlreadyFavorite = isCoinFavorite(id);

      if (!isAlreadyFavorite) {
        toggleFavoriteCoin(id);
      } else {
        console.log("This coin is already in favorites!");
      }
    }
  };










  const onReplaceClick = () => {
    setShowReplaceText(true); 
    setShowReplaceFavoriteCoinsList(true); 
  };


  const convertCurrency = (amount: number, currency: string) => {
    const USD_TO_EURO = 0.85;
    const USD_TO_ILS = 3.28;

    switch (currency) {
      case "EURO":
        return (amount * USD_TO_EURO).toFixed(2);
      case "ILS":
        return (amount * USD_TO_ILS).toFixed(2);
      default:
        return amount.toFixed(2);
    }
  };

  const handleAddCoinClick = (id: string) => {
    if (favoriteCoins.length >= 5) {
      const selectedCoin = coinsData.find((coin) => coin.id === id);
      setSelectedSixthCoin(selectedCoin || null);

      setShowPopup(true);
      setShowReplacementPopup(true);
      setShowReplaceFavoriteCoinsList(true)
    } else {
      const isAlreadyFavorite = isCoinFavorite(id);

      if (!isAlreadyFavorite) {
        toggleFavoriteCoin(id);
      } else {
        console.log("This coin is already in favorites!");
      }
    }
  };




  const handleClosePopup = () => {
    setShowPopup(false);
  };


  const handleShowFavoriteCoinsClick = () => {
    setShowFavoriteCoinsPopup(true);
  };


  const handleHideFavoriteCoinsClick = () => {
    setShowFavoriteCoinsPopup(false);
  };




  const handleReplaceCancelClick = () => {
    setSelectedSixthCoin(null);
    setShowFavoriteCoins(false); 
    setShowReplacementPopup(false); 
  };


  const handleReplaceSixthCoin = (replacementCoinId: string) => {
    const replacementCoin = favoriteCoins.find((coin) => coin.id === replacementCoinId);
    if (selectedSixthCoin && replacementCoin) {
      const updatedFavoriteCoins = favoriteCoins.map((coin) => {
        if (coin.id === selectedSixthCoin.id) {
          return replacementCoin;
        }
        if (coin.id === replacementCoinId) {
          return selectedSixthCoin;
        }
        return coin;
      });

      setFavoriteCoins(updatedFavoriteCoins);
      localStorage.setItem("favoriteCoins", JSON.stringify(updatedFavoriteCoins));
      setSelectedSixthCoin(null);
      setShowReplaceFavoriteCoinsList(false);
    }
  };


  const handleReplaceFavoriteCoin = (favCoin: Coin) => {
    if (selectedSixthCoin && favoriteCoins.length >= 5) {
      const sixthCoinIndex = favoriteCoins.findIndex((coin) => coin.id === selectedSixthCoin.id);
      const replacementCoinIndex = favoriteCoins.findIndex((coin) => coin.id === favCoin.id);

      if (sixthCoinIndex !== -1 && replacementCoinIndex !== -1) {
        const updatedFavoriteCoins = [...favoriteCoins];
        updatedFavoriteCoins[sixthCoinIndex] = favCoin;
        updatedFavoriteCoins[replacementCoinIndex] = selectedSixthCoin;

        setFavoriteCoins(updatedFavoriteCoins);
        localStorage.setItem("favoriteCoins", JSON.stringify(updatedFavoriteCoins));

        setSelectedSixthCoin(null);
        setShowFavoriteCoins(false);
        setShowReplacementPopup(false);
      }
    }

    
  };
  return (
    <div>
      <div className="coins-container">
        {coinsData.map((coin) => (
          <CoinCard
            key={coin.symbol}
            coin={coin}
            selectedCoinId={selectedCoinId}
            selectedCoinPrice={selectedCoinPrice}
            handleMoreInfoClick={handleMoreInfoClick}
            toggleFavoriteCoin={toggleFavoriteCoin}
            convertCurrency={convertCurrency}
            isCoinFavorite={isCoinFavorite}
            onAddCoinClick={() => handleAddReplaceClick(coin.id)}
            showReplaceText={selectedSixthCoin !== null && showReplaceText}
            onReplaceClick={onReplaceClick}
            selectedSixthCoin={selectedSixthCoin}
            onSelectSixthCoin={handleSelectSixthCoin}
          />
        ))}
      </div>
      {showReplaceFavoriteCoinsList && (
        <div className="popup-container">
           <div className="popup-content">
          <h3>Your Report List:</h3>
          <ul>
            {favoriteCoins.map((favCoin) => (
              <li key={favCoin.id}>
                {favCoin.name} -{" "}
                <MainButton
                  title="Remove"
                  handleOnclick={() => handleReplaceSixthCoin(favCoin.id)}
                  />
              </li>
            ))}
          </ul>
        </div>
        </div>
      )}


      {showReplacementPopup && (
        <div>
        </div>
      )}









    </div>
  );
};

