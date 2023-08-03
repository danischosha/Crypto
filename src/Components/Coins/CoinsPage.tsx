import { useEffect, useState } from "react";
import { MainButton } from "../Button/mainButton";
import { CoinCard } from "../Coins/CoinsCard"
import InputText from "../Input/inputText";
import "./CoinsPage.css";
import { LoadingPopup } from "../LoadingPopup/LoadingPopup";
import ListPopup from "../ListPopup/ListPopup";
import ReportsPage from "../Reports/ReportPage";
import SavedSearchIcon from "@mui/icons-material/SavedSearch"; // Add this line to import the SavedSearchIcon






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
  const [favoriteCoins, setFavoriteCoins] = useState<Coin[]>([]);
  const [selectedCoinPrice, setSelectedCoinPrice] = useState<any | null>(null);
  const [showFavoriteCoins, setShowFavoriteCoins] = useState<boolean>(false);
  const [selectedSixthCoin, setSelectedSixthCoin] = useState<Coin | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showReplacementPopup, setShowReplacementPopup] = useState(false);
  const [showReplaceText, setShowReplaceText] = useState(false);


  const [showReplaceFavoriteCoinsList, setShowReplaceFavoriteCoinsList] = useState<boolean>(false);

  const [searchValue, setSearchValue] = useState<string>('');
  const [filteredCoinsData, setFilteredCoinsData] = useState<Coin[]>([]);
  const [searchInput, setSearchInput] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false); // Add the loading state
  const [cachedData, setCachedData] = useState<any | null>(null);
  const [selectedPopupCoin, setSelectedPopupCoin] = useState<Coin | null>(null);














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
    const filteredCoins = coinsData.filter((coin) =>
      coin.symbol.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredCoinsData(filteredCoins);
  }, [searchValue, coinsData]);

  useEffect(() => {
    // Function to update the filteredCoinsData
    const updateFilteredCoinsData = () => {
      const filteredCoins = coinsData.filter((coin) =>
        coin.symbol.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredCoinsData(filteredCoins);
    };

    // Call the function initially and whenever coinsData or searchValue changes
    updateFilteredCoinsData();
  }, [coinsData, searchValue]);


  const handleMoreInfoClick = async (id: string) => {
    if (id === selectedCoinId) {
      // If the same coin is clicked again, close the information
      setSelectedCoinId(null);
      setSelectedCoinPrice(null);
    } else {
      try {
        const currentTime = Date.now();
        const cacheKey = `coin-${id}`;
        const cachedData = JSON.parse(localStorage.getItem(cacheKey) || 'null');

        if (cachedData && currentTime - cachedData.timestamp <= 120000) {
          // If the cached data is available and not older than 2 minutes
          setSelectedCoinPrice(cachedData.data);
          setSelectedCoinId(id);
        } else {
          const coinPriceData = await fetchCoinData(id); // Await for the fetched data
          setCachedData({
            timestamp: Date.now(),
            data: coinPriceData,
          }); // Update the cachedData state with the fetched data
          setSelectedCoinPrice(coinPriceData);
          setSelectedCoinId(id);
          localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data: coinPriceData })); // Save the fetched data in local cache
        }
      } catch (error) {
        console.error("שגיאה:", error);
      }
    }

    // Set the selectedPopupCoin for the "More Info" popup
    const selectedCoin = coinsData.find((coin) => coin.id === id);
    setSelectedPopupCoin(selectedCoin || null);
  };

  const fetchCoinData = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://min-api.cryptocompare.com/data/price?fsym=${id}&tsyms=USD`
      );
      const coinPriceData = await response.json();
      setLoading(false); // Set loading to false once the data is fetched
      return coinPriceData; // Return the fetched data
    } catch (error) {
      console.error("שגיאה:", error);
      setLoading(false); // Set loading to false in case of an error
      return null; // Return null to indicate an error
    }
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


  const handleSelectSixthCoin = (coin: Coin) => {
    setSelectedSixthCoin(coin);
    setShowPopup(true);
    setShowReplaceFavoriteCoinsList(true);
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

    const filteredCoinsData = coinsData.filter((coin) =>
      coin.symbol.toLowerCase().includes(searchValue.toLowerCase())
    );
  };



  const handleSearch = () => {
    const filteredCoins = coinsData.filter((coin) =>
      coin.symbol.toLowerCase().includes(searchInput.toLowerCase())
    );
    setFilteredCoinsData(filteredCoins);
  };


  const onReplaceClick = () => {
    setShowReplaceText(true);
    setShowReplaceFavoriteCoinsList(true);
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






  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleAllButtonClick = () => {
    setSearchInput('')
    setFilteredCoinsData(coinsData);
  };




  const handleClosePopup = () => {
    setShowReplaceFavoriteCoinsList(false); // Set the state to hide the popup
  };






  return (
    <div>
      <div className="search-container">
        <InputText
          type="text"
          placeholder="Enter coin symbol"
          value={searchInput}
          onChange={handleSearchInputChange}
        />
        <MainButton title="Search" handleOnclick={handleSearch} style={{
          width: "200px", // Increase the width to 200 pixels
          height: "400px",
        }} />
        <MainButton title="Display All" handleOnclick={handleAllButtonClick} />
      </div>

      <div className="coins-container">
        {filteredCoinsData.map((coin: Coin) => (
          // Show the LoadingPopup or the CoinCard based on the loading state
          loading ? (
            <LoadingPopup key={coin.symbol} />
          ) : (
            <CoinCard
              key={coin.symbol}
              coin={coin}
              selectedCoinId={selectedCoinId}
              selectedCoinPrice={selectedCoinPrice}
              handleMoreInfoClick={() => handleMoreInfoClick(coin.id)}
              toggleFavoriteCoin={toggleFavoriteCoin}
              convertCurrency={convertCurrency}
              isCoinFavorite={isCoinFavorite}
              onAddCoinClick={() => handleAddReplaceClick(coin.id)}
              showReplaceText={selectedSixthCoin !== null && showReplaceText}
              onReplaceClick={onReplaceClick}
              selectedSixthCoin={selectedSixthCoin}
              onSelectSixthCoin={handleSelectSixthCoin}
              loading={loading}
            />
          )
        ))}
      </div>

      {showReplaceFavoriteCoinsList && (
        <ListPopup
          favoriteCoins={favoriteCoins} // Pass the actual favoriteCoins array
          handleReplaceSixthCoin={handleReplaceSixthCoin}
          handleClosePopup={handleClosePopup}
        />

      )}








      {showReplacementPopup && (
        <div>
        </div>
      )}

    </div>
  );
};


