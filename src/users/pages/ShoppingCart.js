import React, { useEffect, useState } from 'react';
import './ShoppingCart.css';
import Container from '@material-ui/core/Container';
import { useAuth } from '../../context/auth-context';
import { dbService } from '../../firebase';
import CartItem from './CartItem';

export default function ShoppingCart() {
  const [cartProducts, setCartProducts] = useState([]);
  const { currentUser } = useAuth();
  const [checkItems, setCheckItems] = useState([]);
  const [total, setTotal] = useState(0);

  const cartRef = dbService.collection('cart').doc(currentUser.uid);
  const buyRef = dbService.doc(`/buy/${currentUser.uid}`);

  useEffect(() => {
    console.log('g');
    const cartRef = dbService.collection('cart').doc(currentUser.uid);
    cartRef.onSnapshot((doc) => {
      if (doc.exists) {
        console.log(doc.data().products);
        setCartProducts(doc.data().products);
      }
    });
  }, [currentUser.uid]);

  const checkoutHandler = () => {
    cartRef
      .get()
      .then((doc) => {
        let newProducts = [];
        newProducts = doc.data().products.filter((el) => {
          return !checkItems.includes(el.productId);
        });

        cartRef.update({ products: newProducts });

        const items = doc.data().products.filter((el) => {
          return checkItems.includes(el.productId);
        }); //구매한 상품

        let itemsWithDate = [
          { products: [...items], date: new Date().toISOString() },
        ];
        return itemsWithDate;
        // setBuyItems({ ...items, date: new Date() });
      })
      .then((itemsWithDate) => {
        buyRef.get().then((doc) => {
          if (doc.exists) {
            let buyProducts = [];
            buyProducts = doc.data().itemsWithDate;
            itemsWithDate.forEach((el) => buyProducts.push(el));
            // buyProducts.push(itemsWithDate);
            buyRef.update({ itemsWithDate: buyProducts });
          } else {
            buyRef.set({
              itemsWithDate,
            });
          }
        });
      })
      .catch((err) => console.error(err));
  };

  const handleSingleCheck = (checked, id) => {
    if (checked) {
      setCheckItems([...checkItems, id]);

      cartRef.get().then((doc) => {
        let cartProducts = doc.data().products;
        const sameIndex = cartProducts.findIndex((el) => el.productId === id);
        cartProducts[sameIndex].isChecked = true;
        cartRef.update({ products: cartProducts });
        let total = 0;
        cartProducts.forEach((el, i) => {
          if (cartProducts[i].isChecked === true) {
            total += cartProducts[i].price * cartProducts[i].quantity;
          }
        });
        setTotal(total);
      });
    } else {
      // 체크 해제
      setCheckItems(checkItems.filter((el) => el !== id));
      cartRef.get().then((doc) => {
        let cartProducts = doc.data().products;
        const sameIndex = cartProducts.findIndex((el) => el.productId === id);
        cartProducts[sameIndex].isChecked = false;
        cartRef.update({ products: cartProducts });
        let total = 0;
        cartProducts.forEach((el, i) => {
          if (cartProducts[i].isChecked === true) {
            total += cartProducts[i].price * cartProducts[i].quantity;
          }
        });
        setTotal(total);
      });
    }
  };

  const checkAllHandler = (checked) => {
    if (checked) {
      const idArray = [];
      cartProducts.forEach((el, id) => {
        idArray.push(el.productId);
      });
      cartRef.get().then((doc) => {
        let cartProducts = doc.data().products;
        cartProducts.forEach((el) => (el.isChecked = true));
        cartRef.update({ products: cartProducts });
        let total = 0;
        cartProducts.forEach(
          (el, i) => (total += cartProducts[i].price * cartProducts[i].quantity)
        );
        setTotal(total);
      });

      setCheckItems(idArray);
    } else {
      setCheckItems([]);
      cartRef.get().then((doc) => {
        let cartProducts = doc.data().products;
        cartProducts.forEach((el) => (el.isChecked = false));
        cartRef.update({ products: cartProducts });
        let total = 0;
        cartProducts.forEach(
          (el, i) => (total += cartProducts[i].price * cartProducts[i].quantity)
        );
        setTotal(total);
      });
    }
  };

  return (
    <div>
      <Container maxWidth='lg'>
        <section className='shopping_cart'>
          <h2>Your Shopping Bag</h2>
          <table className='cart_table'>
            {/* table title */}
            <thead>
              <tr>
                <th className='checkboxAll'>
                  <input
                    type='checkbox'
                    name='checkboxAll'
                    id='checkAll'
                    onChange={(e) => checkAllHandler(e.target.checked)}
                    checked={
                      checkItems.length === cartProducts.length ? true : false
                    }
                  />
                  <label htmlFor='checkAll'>전체 선택</label>
                </th>
                <th>Item</th>
                <th></th>
                <th>Quantity</th>
                <th>Price</th>
                <th>선택 삭제</th>
              </tr>
            </thead>
            {/* table content */}
            <tbody>
              {cartProducts &&
                cartProducts.map((product, index) => (
                  <CartItem
                    key={product.productId}
                    id={product.productId}
                    name={product.productName}
                    price={product.price}
                    image={product.image}
                    quantity={product.quantity}
                    index={index}
                    checkItems={checkItems}
                    setCheckItems={setCheckItems}
                    handleSingleCheck={handleSingleCheck}
                  />
                ))}
            </tbody>
          </table>
          {/* total */}
          <div className='checkout'>
            <div className='total'>
              <div className='total_inner'>
                <p>Total :</p>
                <p>
                  ₩{' '}
                  {total
                    .toString()
                    .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')}
                </p>
              </div>
              <button className='total_btn' onClick={checkoutHandler}>
                <span>Secure Checkout</span>
              </button>
            </div>
          </div>
        </section>
      </Container>
    </div>
  );
}