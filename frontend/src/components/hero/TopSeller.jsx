import { useEffect, useState } from "react";
import axios from "axios";
import { Caption, Container, Heading, ProfileCard, Title } from "../../components/common/Design";

export const TopSeller = () => {
  const [topSellers, setTopSellers] = useState([]);

  useEffect(() => {
    const fetchTopSellers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users/top");
        setTopSellers(response.data);
      } catch (error) {
        console.error("Error fetching top sellers", error);
      }
    };

    fetchTopSellers();
  }, []);

  return (
    <section className="process py-12">
      <Container>
        <Heading
          title="Top Seller"
          subtitle="Discover our highest-performing sellers on the platform."
        />

        <div className="content grid grid-cols-1 md:grid-cols-5 gap-5 mt-8">
          {topSellers.map((item, index) => (
            <div
              className="flex items-center justify-between border p-3 rounded-lg"
              key={item.id}
            >
              <div className="flex items-center gap-3">
                <ProfileCard className="w-16 h-16">
                  <img
                    src={item.profile}
                    alt={item.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </ProfileCard>
                <div>
                  <Title level={5} className="font-normal text-xl">
                    {item.name}
                  </Title>
                  <Caption>${item.totalSales}</Caption>
                </div>
              </div>
              <Title level={2} className="opacity-10">
                0{index + 1}
              </Title>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
