import { useParams } from 'react-router-dom';

import SearchAssets from '@/components/SearchAssets/SearchAssets';
import DefaultLayout from '@/layouts/Default';

const Home = () => {
  const params = useParams();

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10  align-center">
        <SearchAssets pair={params.pairs} />
      </section>
    </DefaultLayout>
  );
};

export default Home;
