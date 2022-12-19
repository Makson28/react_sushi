import React, { useContext } from 'react';
import Card from '../components/Card';
import AppContext from '../context';

function Favorites() {
  const {onAddToFavorite, items, fetchProducts} = useContext(AppContext);
  React.useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="content p-40">
      <div className="d-flex align-center justify-between mb-40">
        <h1>Мої закладки</h1>
      </div>

      <div className="d-flex flex-wrap">
        {items.filter(item => item.liked).map((item, index) => (
          <Card key={index} onFavorite={onAddToFavorite} {...item} />
        ))}
      </div>
    </div>
  );
}

export default Favorites;
