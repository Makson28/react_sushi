import React, { useContext } from "react";
import Info from "../Info";
import { useCart } from "../../hooks/useCart";
import styles from "./Drawer.module.scss";
import AppContext from "../../context";

function Drawer({ onClose, onRemove, items = [], opened }) {
  const { onAddToOrders } = useContext(AppContext);
  const { cartItems, setCartItems, totalPrice } = useCart();
  const [orderId, setOrderId] = React.useState(null);
  const [isOrderComplete, setIsOrderComplete] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [phone, setPhone] = React.useState("");

  const onClickOrder = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const { data } = await onAddToOrders({
        items: cartItems,
        phone,
      });
      setOrderId(data.id);
      setIsOrderComplete(true);
      setCartItems([]);
    } catch (error) {
      alert("Помилка при створені замовленні :(");
    }
    setIsLoading(false);
  };

  return (
    <div className={`${styles.overlay} ${opened ? styles.overlayVisible : ""}`}>
      <div className={styles.drawer}>
        <h2 className="d-flex justify-between mb-30">
          Кошик{" "}
          <img
            onClick={onClose}
            className="cu-p"
            src="img/btn-remove.svg"
            alt="Close"
          />
        </h2>

        {items.length > 0 ? (
          <form
            className="d-flex flex-column flex"
            action="#"
            onSubmit={onClickOrder}
          >
            <div className="items flex">
              {items.map((obj) => (
                <div
                  key={obj.id}
                  className="cartItem d-flex align-center mb-20"
                >
                  <div
                    style={{ backgroundImage: `url(${obj.imageUrl})` }}
                    className="cartItemImg"
                  ></div>

                  <div className="mr-20 flex">
                    <p className="mb-5">{obj.title}</p>
                    <b>{obj.price} грн.</b>
                  </div>
                  <img
                    onClick={() => onRemove(obj.id)}
                    className="removeBtn"
                    src="img/btn-remove.svg"
                    alt="Remove"
                  />
                </div>
              ))}
            </div>
            <div className="cartTotalBlock">
              <ul>
                <li>
                  <span>Сума замовлення:</span>
                  <div></div>
                  <b>{totalPrice} грн. </b>
                </li>
              </ul>
              <span className="phoneNum">Введіть ваш номер телефону:</span>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="inputPhoneNum"
                required
                type="tell"
              />
              <button
                disabled={isLoading}
                className="greenButton"
                type="submit"
              >
                Оформити замовлення <img src="img/arrow.svg" alt="Arrow" />
              </button>
            </div>
          </form>
        ) : (
          <Info
            title={isOrderComplete ? "Замовлення оформлене!" : "Кошик пустий"}
            description={
              isOrderComplete
                ? `Ваше замовлення #${orderId} скоро буде передане оператору.`
                : "Добавте хоча б один товар, щоб зробити замовлення."
            }
            image={
              isOrderComplete ? "img/complete-order.jpg" : "img/empty-cart.jpg"
            }
          />
        )}
      </div>
    </div>
  );
}

export default Drawer;
