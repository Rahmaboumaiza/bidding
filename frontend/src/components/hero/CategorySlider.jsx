import { categorylists } from "../../utils/data";
import { CategoryCard } from "../../components/cards/CategoryCards";
import { Container, Heading } from "../../components/common/Design";

export const CategorySlider = () => {
  return (
    <>
      <section className="category-slider pb-16">
        <Container>
          <Heading title="Browse the categories" subtitle="Most viewed and all-time top-selling categories" />
          <div className="grid grid-cols-2 md:grid-cols-7 gap-5 my-8">
            {categorylists.map((item) => (
              <CategoryCard key={item.id} item={item} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
};


// export const CategorySlider =()=>{
//   return <div>CategorySlider</div>
// };