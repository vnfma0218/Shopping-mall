import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../context/auth-context";
import { dbService } from "../../firebase";
import Modal from "../../shared/UIElement/Modal";
import Rating from "@material-ui/lab/Rating";
import "./ProductItem.css";
import { addToCart } from "../../shared/util/addCart";
import CommentList from "../../users/pages/CommentList";
import { addComment } from "../../shared/util/rating";
import ShoppingBasketIcon from "@material-ui/icons/ShoppingBasket";

export default function ProductItem(props) {
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [value, setValue] = useState(0);
  const { currentUser } = useAuth();
  const history = useHistory();
  const [user, setUser] = useState();

  const openRatingModal = () => {
    if (!currentUser) {
      return setLoginModalOpen(true);
    }
    setRatingModalOpen(true);
  };

  const openLoginModal = () => {
    setLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setLoginModalOpen(false);
  };

  const closeRatingModal = () => {
    setRatingModalOpen(false);
  };

  const ratingSubmitHandler = (comment) => {
    addComment(
      props.id,
      props.name,
      user.nickName,
      value,
      comment,
      user.imageUrl
    );
    setRatingModalOpen(false);
  };

  const addCartHandler = () => {
    if (!currentUser) {
      openLoginModal();
    } else {
      addToCart(currentUser.uid, props);
    }
  };

  return (
    <>
      {ratingModalOpen && (
        <CommentList
          open={ratingModalOpen}
          handleClose={closeRatingModal}
          onReviewSubmit={ratingSubmitHandler}
          id={props.id}
        >
          <Rating
            name="simple-controlled"
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
          />
        </CommentList>
      )}

      <Modal
        open={loginModalOpen}
        close={closeLoginModal}
        header="Notice"
        footer={<button onClick={() => history.push("/auth")}>Log In</button>}
      >
        로그인이 필요합니다.
      </Modal>
      <li className="product_card">
        <div className="img_wrap">
          <img src={props.image} className="product_image" alt="product" />
        </div>
        <div className="product_content">
          <div className="product_content-header">
            <div className="span">
              <div className="rating">
                <Rating name="read-only" value={props.avgRating} readOnly />
              </div>
            </div>
            <p className="product_review" onClick={openRatingModal}>
              별점주기({props.reviewCount})
            </p>
          </div>
          <h3 className="product_name">{props.name}</h3>
          <p className="product_price">
            {props.price
              .toString()
              .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
            원
          </p>
          <button className="cart_btn" onClick={addCartHandler}>
            <span>ADD TO CART</span>
          </button>
          <div className="basket_icon_btn">
            <ShoppingBasketIcon
              className="basket_icon"
              onClick={addCartHandler}
              style={{ fontSize: "28px" }}
            />
          </div>
        </div>
      </li>
    </>
  );
}
