import React, { useContext } from 'react';
import Card from '../components/Card';
import AppContext from '../context';

function Home({
  searchValue,
  setSearchValue,
  onChangeSearchInput,
  onAddToCart,
  isLoading,
}) {
  const renderItems = () => {
    const filtredItems = items.filter((item) =>
      item.title.toLowerCase().includes(searchValue.toLowerCase()),
    );
    return (isLoading ? [...Array(8)] : filtredItems).map((item, index) => (
      <Card
        key={index}
        onFavorite={(obj) => onAddToFavorite(obj)}
        onPlus={(obj) => onAddToCart(obj)}
        loading={isLoading}
        {...item}
      />
    ));
  };
  
  const {onAddToFavorite, items, fetchProducts} = useContext(AppContext);

  React.useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="content p-40">
      <div className="d-flex align-center justify-between mb-40">
        <h1>{searchValue ? `Пошук по запиту: "${searchValue}"` : 'Новинки'}</h1>
        <div className="search-block d-flex">
          <img src="img/search.svg" alt="Search" />
          {searchValue && (
            <img
              onClick={() => setSearchValue('')}
              className="clear cu-p"
              src="img/btn-remove.svg"
              alt="Clear"
            />
          )}
          <input onChange={onChangeSearchInput} value={searchValue} placeholder="Пошук..." />
        </div>
      </div>
      <div className="d-flex flex-wrap">{renderItems()}</div>
    </div>
  );
}

export default Home;
