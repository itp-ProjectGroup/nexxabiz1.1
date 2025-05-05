import { useSelector } from "react-redux";
import { selectFavoriteProduct } from "../../redux/features/favorites/favoriteSlice";
import Product from "./Product";
import Header2 from "../../components/Header2"; // Double-check this path

const Favorites = () => {
  const favorites = useSelector(selectFavoriteProduct);

  return (
    <div>
      <Header2 />
      <div className="ml-[10rem]">
        <h1 className="text-lg font-bold ml-[3rem] mt-[3rem]">
          FAVORITE PRODUCTS
        </h1>
        <div className="flex flex-wrap">
          {favorites.map((product) => (
            <Product key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Favorites;