import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllProduct } from"../../redux/features/productSlice";
import { ProductCard } from "../../components/cards/ProductCard";
import { Container, Heading } from "../../components/common/Design";  

export const ProductsByCategory = () => {
  const { category } = useParams();
  const dispatch = useDispatch();

  const { products, isLoading } = useSelector((state) => state.product);

  useEffect(() => {
    if (products.length === 0) {
      dispatch(getAllProduct());
    }
  }, [dispatch, products.length]);

  const filteredProducts = products.filter(
    (item) =>
      item.category?.toLowerCase() === category?.toLowerCase() &&
      item.isExpired === false &&
      item.isVerify === true &&
      item.isSoldout === false
  );

  if (isLoading) return <p className="text-center p-10">Loading products...</p>;

  return (
    <section className="product-home h-screen pt-40">
      <Container>
        <Heading
          title={`Products in ${category}`}
          subtitle="Explore the latest products in this category."
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 my-8">
          {filteredProducts.length === 0 ? (
            <p className="col-span-full text-center">No products found in this category.</p>
          ) : (
            filteredProducts.map((item, index) => (
              <ProductCard item={item} key={item._id || index} />
            ))
          )}
        </div>
      </Container>
    </section>
  );
};
