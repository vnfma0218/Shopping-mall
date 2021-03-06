import React, { useEffect } from 'react';
import { useState } from 'react';
import { dbService } from '../../firebase';
import ProductItem from '../components/ProductItem';
import Container from '@material-ui/core/Container';
import './ProductList.css';
import { FaAngleLeft } from 'react-icons/fa';
import { FaAngleRight } from 'react-icons/fa';
import Slider from '../../shared/UIElement/slider/Slider';
import { useAuth } from '../../context/auth-context';
import { addComment } from '../../shared/util/rating';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [latest, setLatest] = useState(0);
  const [popular, setPopular] = useState(0);
  const { currentUser } = useAuth();
  const [user, setUser] = useState();

  useEffect(() => {
    if (currentUser) {
      dbService
        .collection('users')
        .where('userId', '==', currentUser.uid)
        .limit(1)
        .get()
        .then((data) => {
          setUser(data.docs[0].data());
        })
        .catch((err) => console.log(err));
    }
  }, [currentUser]);

  useEffect(() => {
    console.log('useeffect productlist');
    dbService
      .collection('product')
      .orderBy('date', 'desc')
      .limit(10)
      .onSnapshot((snapshot) => {
        setProducts(
          snapshot.docs.map((doc) => {
            return { id: doc.id, ...doc.data() };
          })
        );
      });
  }, []);

  useEffect(() => {
    dbService
      .collection('product')
      .orderBy('avgRating', 'desc')
      .limit(10)
      .onSnapshot((snapshot) => {
        setPopularProducts(
          snapshot.docs.map((doc) => {
            return { id: doc.id, ...doc.data() };
          })
        );
      });
  }, []);

  const latestArr = products;
  const popularArr = popularProducts;

  const prevSlideLatest = () => {
    latest === 0 ? setLatest(0) : setLatest(latest + 10);
  };
  const nextSlideLatest = () => {
    latest === -10 * (latestArr.length - 4)
      ? setLatest(-10 * (latestArr.length - 4))
      : setLatest(latest - 10);
  };
  const prevSlidePopular = () => {
    popular === 0 ? setPopular(0) : setPopular(popular + 10);
  };
  const nextSlidePopular = () => {
    popular === -10 * (popularArr.length - 4)
      ? setPopular(-10 * (popularArr.length - 4))
      : setPopular(popular - 10);
  };

  const onSubmitComment = (productId, productName, value, comment) => {
    addComment(
      productId,
      productName,
      user.nickName,
      value,
      comment,
      user.imageUrl
    );
  };

  return (
    <div style={{ position: 'relative' }}>
      <Slider />

      <Container maxWidth='lg'>
        <section className='latest'>
          <h2 className='title'>Latest Products</h2>
          <div className='productlist_wrap'>
            <ul
              className='productlist'
              style={{ transform: `translateX(${latest}%)` }}
            >
              {products.map((product) => (
                <ProductItem
                  id={product.id}
                  key={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.imageUrl}
                  category={product.category}
                  avgRating={product.avgRating}
                  reviewCount={product.scoreCount}
                  addComment={onSubmitComment}
                />
              ))}
            </ul>
          </div>
          <button className='slide_left' onClick={prevSlideLatest}>
            <FaAngleLeft />
          </button>
          <button className='slide_right' onClick={nextSlideLatest}>
            <FaAngleRight />
          </button>
        </section>
      </Container>

      <Container maxWidth='lg'>
        <section className='popular'>
          <h2 className='title'>Popular Products</h2>
          <div className='productlist_wrap'>
            <ul
              className='productlist'
              style={{ transform: `translateX(${popular}%)` }}
            >
              {popularProducts.map((product) => (
                <ProductItem
                  id={product.id}
                  key={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.imageUrl}
                  category={product.category}
                  avgRating={product.avgRating}
                  reviewCount={product.scoreCount}
                  addComment={onSubmitComment}
                />
              ))}
            </ul>
          </div>
          <button className='slide_left' onClick={prevSlidePopular}>
            <FaAngleLeft />
          </button>
          <button className='slide_right' onClick={nextSlidePopular}>
            <FaAngleRight />
          </button>
        </section>
      </Container>
    </div>
  );
}
