import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllProduct } from "../../redux/features/productSlice";
import { ProductCard } from "../../components/cards/ProductCard";
import { Container, Heading } from "../../components/common/Design";

export const ProductSearchPage = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.product);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(getAllProduct());
  }, [dispatch]);

    const filteredProducts = products
    .filter((item) =>
      item?.title?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(
      (item) =>
        item.isExpired === false &&
        item.isVerify === true &&
        item.isSoldout === false
    );

  return (
    <section className="product-home pt-40 pb-10">
      <Container>
         <Heading
      title={searchTerm ? "Search Results" : "All Products"}
      subtitle={
        searchTerm
          ? "Find what you’re looking for"
          : "Browse all available products"
      }
    />

        <div className="my-4">
          <input
            type="text"
            placeholder="Search for products..."
            className="w-full px-4 py-2 border rounded-md shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-6">
          {filteredProducts.length === 0 ? (
            <p className="col-span-full text-center">No products found.</p>
          ) : (
            filteredProducts.map((item) => (
              <ProductCard key={item._id} item={item} />
            ))
          )}
        </div>
      </Container>
    </section>
  );
};
