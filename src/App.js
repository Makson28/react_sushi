import React, { useCallback } from "react";
import { Route } from "react-router-dom";
import axios from "axios";
import Header from "./components/Header";
import Drawer from "./components/Drawer";
import AppContext from "./context";

import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import Orders from "./pages/Orders";

function App() {
  const [items, setItems] = React.useState([]);
  const [cartItems, setCartItems] = React.useState([]);
  const [searchValue, setSearchValue] = React.useState("");
  const [cartOpened, setCartOpened] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(
        "https://62fb6d06e4bcaf5351848bcc.mockapi.io/products"
      );

      setIsLoading(false);
      setItems(data);
    } catch (error) {
      alert("Помилка при запиті данних :(");
      console.error(error);
    }
  }, []);
  const fetchCart = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(
        "https://62fb6d06e4bcaf5351848bcc.mockapi.io/cart"
      );

      setIsLoading(false);
      setCartItems(data);
    } catch (error) {
      alert("Помилка при запиті данних :(");
      console.error(error);
    }
  }, [])

  React.useEffect(() => {
    fetchCart();
  }, []);

  const onAddToCart = async (obj) => {
    try {
      const findItem = cartItems.find(
        (item) => Number(item.parentId) === Number(obj.id)
      );
      if (findItem) {
        setCartItems((prev) =>
          prev.filter((item) => Number(item.parentId) !== Number(obj.id))
        );
        await axios.delete(
          `https://62fb6d06e4bcaf5351848bcc.mockapi.io/cart/${findItem.id}`
        );
      } else {
        setCartItems((prev) => [...prev, obj]);
        const { data } = await axios.post(
          "https://62fb6d06e4bcaf5351848bcc.mockapi.io/cart",
          obj
        );
        setCartItems((prev) =>
          prev.map((item) => {
            if (item.parentId === data.parentId) {
              return {
                ...item,
                id: data.id,
              };
            }
            return item;
          })
        );
      }
    } catch (error) {
      alert("Помилка при добавлені в кошик");
      console.error(error);
    }
  };

  const onRemoveItem = (id) => {
    try {
      axios.delete(`https://62fb6d06e4bcaf5351848bcc.mockapi.io/cart/${id}`);
      setCartItems((prev) =>
        prev.filter((item) => Number(item.id) !== Number(id))
      );
    } catch (error) {
      alert("Помилка при видаленні з корзини");
      console.error(error);
    }
  };

  const onAddToFavorite = async (obj) => {
    try {
      const item = items.find((favObj) => Number(favObj.id) === Number(obj.id));
      await axios.put(
        `https://62fb6d06e4bcaf5351848bcc.mockapi.io/products/${obj.id}`,
        { liked: !item.liked }
      );
      await fetchProducts();
    } catch (error) {
      alert("Не вдалось добавити до улюбленого");
      console.error(error);
    }
  };

  const onAddToOrders = async (obj) => {
    try {
      const response = await axios.post(
        `https://62fb6d06e4bcaf5351848bcc.mockapi.io/orders`, obj
      );
      return response;
    } catch (error) {
      alert("Не вдалось замовити");
      console.error(error);
    }
  };

  const onChangeSearchInput = (event) => {
    setSearchValue(event.target.value);
  };

  const isItemAdded = (id) => {
    return cartItems.some((obj) => Number(obj.parentId) === Number(id));
  };

  return (
    <AppContext.Provider
      value={{
        items,
        fetchProducts,
        onAddToOrders,
        cartItems,
        isItemAdded,
        onAddToFavorite,
        onAddToCart,
        setCartOpened,
        setCartItems,
      }}
    >
      <div className="wrapper clear">
        <Drawer
          items={cartItems}
          onClose={() => setCartOpened(false)}
          onRemove={onRemoveItem}
          opened={cartOpened}
        />

        <Header onClickCart={() => setCartOpened(true)} />

        <Route path="/" exact>
          <Home
            items={items}
            cartItems={cartItems}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            onChangeSearchInput={onChangeSearchInput}
            onAddToFavorite={onAddToFavorite}
            onAddToCart={onAddToCart}
            isLoading={isLoading}
          />
        </Route>

        <Route path="/favorites" exact>
          <Favorites />
        </Route>

        <Route path="/orders" exact>
          <Orders />
        </Route>
      </div>
    </AppContext.Provider>
  );
}

export default App;
