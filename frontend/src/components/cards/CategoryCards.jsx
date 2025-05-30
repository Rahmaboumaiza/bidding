import PropTypes from "prop-types";
import { Title } from "../common/Design";

import { Link } from "react-router-dom";

export const CategoryCard = ({ item }) => {
  const { title, image } = item;

  return (
    <Link to={`/products/${title.toLowerCase()}`} className="block">
      <div className="bg-blue-200 p-4 rounded-md text-center hover:shadow-lg transition-all duration-300">
        <img src={image} alt={title} className="mx-auto w-16 h-16 object-contain mb-2" />
        <p className="font-semibold uppercase">{title}</p>
      </div>
    </Link>
  );
};


CategoryCard.propTypes = {
  item: PropTypes.any,
};