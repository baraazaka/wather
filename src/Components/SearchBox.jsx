import { FaSearch } from "react-icons/fa";
import Style from "./Weather.module.css";

export default function SearchBox({
  searchQuery,
  setSearchQuery,
  searchResults,
  handleCitySelect,
  handleSearch,
}) {
  return (
    <div className={Style.SearchContainer}>
      <div className={Style.searchInput}>
        <FaSearch className={Style.searchicon} />
        <input
          type="text"
          placeholder="Search for a place..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      {searchResults.length > 0 && (
        <div className={Style.searchResultsList}>
          {searchResults.map((result) => (
            <div
              key={result.id}
              className={Style.searchResultItem}
              onClick={() => handleCitySelect(result)}
            >
              {result.name}, {result.country}
            </div>
          ))}
        </div>
      )}
      <button className={Style.searchButton} onClick={handleSearch}>
        Search
      </button>
    </div>
  );
}
