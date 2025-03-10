import React, { useContext, useEffect, useState } from 'react';
import CardDataStats from '../../components/CardDataStats';
import RecentlyAddedItems from '../../components/Tables/TableSix';
import { AppContext } from '../../Context/appContext';
import axios from 'axios';
import { Link } from 'react-router-dom';

const SellerECommerce: React.FC = () => {
  const appContext = useContext(AppContext);
  if (!appContext) {
    throw new Error('Settings component must be used within an AppContextProvider');
  }
  const { backendUrl } = appContext;

  const [totalConnects, setTotalConnects] = useState<number | null>(null);

  useEffect(() => {
    const fetchTotalConnects = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/connections/connected-users-count`);
        setTotalConnects(response.data.count); 
      } catch (error) {
        console.error('Error fetching total connects:', error);
      }
    };

    fetchTotalConnects();
  }, [backendUrl]);

  const levelUp = totalConnects !== null && totalConnects > 500;  
  const levelDown = totalConnects !== null && totalConnects <= 500;  

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
      <Link to="/connected-users">
        <CardDataStats
          title="Total Connects"
          total={totalConnects != null ? totalConnects.toString() : 'Loading...'}
          rate="1.2%"  
          levelUp={levelUp}  
          levelDown={levelDown}  
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM7 9.00001C8.1 9.00001 9 9.90001 9 11C9 12.1 8.1 13 7 13C5.9 13 5 12.1 5 11C5 9.90001 5.9 9.00001 7 9.00001ZM17 9.00001C18.1 9.00001 19 9.90001 19 11C19 12.1 18.1 13 17 13C15.9 13 15 12.1 15 11C15 9.90001 15.9 9.00001 17 9.00001ZM12 15C14.76 15 17 16.24 17 18V19H7V18C7 16.24 9.24 15 12 15ZM12 13C9.33 13 4 14.34 4 17V20H20V17C20 14.34 14.67 13 12 13Z"
              fill="currentColor"
            />
          </svg>
        </CardDataStats>
        </Link>
        <CardDataStats title="Available products" total="40" rate="0" levelUp>
          <svg
            className="fill-primary dark:fill-white"
            width="20"
            height="22"
            viewBox="0 0 20 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.7531 16.4312C10.3781 16.4312 9.27808 17.5312 9.27808 18.9062C9.27808 20.2812 10.3781 21.3812 11.7531 21.3812C13.1281 21.3812 14.2281 20.2812 14.2281 18.9062C14.2281 17.5656 13.0937 16.4312 11.7531 16.4312ZM11.7531 19.8687C11.2375 19.8687 10.825 19.4562 10.825 18.9406C10.825 18.425 11.2375 18.0125 11.7531 18.0125C12.2687 18.0125 12.6812 18.425 12.6812 18.9406C12.6812 19.4219 12.2343 19.8687 11.7531 19.8687Z"
              fill=""
            />
            <path
              d="M5.22183 16.4312C3.84683 16.4312 2.74683 17.5312 2.74683 18.9062C2.74683 20.2812 3.84683 21.3812 5.22183 21.3812C6.59683 21.3812 7.69683 20.2812 7.69683 18.9062C7.69683 17.5656 6.56245 16.4312 5.22183 16.4312ZM5.22183 19.8687C4.7062 19.8687 4.2937 19.4562 4.2937 18.9406C4.2937 18.425 4.7062 18.0125 5.22183 18.0125C5.73745 18.0125 6.14995 18.425 6.14995 18.9406C6.14995 19.4219 5.73745 19.8687 5.22183 19.8687Z"
              fill=""
            />
            <path
              d="M19.0062 0.618744H17.15C16.325 0.618744 15.6031 1.23749 15.5 2.06249L14.95 6.01562H1.37185C1.0281 6.01562 0.684353 6.18749 0.443728 6.46249C0.237478 6.73749 0.134353 7.11562 0.237478 7.45937C0.237478 7.49374 0.237478 7.49374 0.237478 7.52812L2.36873 13.9562C2.50623 14.4375 2.9531 14.7812 3.46873 14.7812H12.9562C14.2281 14.7812 15.3281 13.8187 15.5 12.5469L16.9437 2.26874C16.9437 2.19999 17.0125 2.16562 17.0812 2.16562H18.9375C19.35 2.16562 19.7281 1.82187 19.7281 1.37499C19.7281 0.928119 19.4187 0.618744 19.0062 0.618744ZM14.0219 12.3062C13.9531 12.8219 13.5062 13.2 12.9906 13.2H3.7781L1.92185 7.56249H14.7094L14.0219 12.3062Z"
              fill=""
            />
          </svg>
        </CardDataStats>
        <CardDataStats title="Total Product" total="2.450" rate="2.59%" levelUp>
          <svg
            className="fill-primary dark:fill-white"
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21.1063 18.0469L19.3875 3.23126C19.2157 1.71876 17.9438 0.584381 16.3969 0.584381H5.56878C4.05628 0.584381 2.78441 1.71876 2.57816 3.23126L0.859406 18.0469C0.756281 18.9063 1.03128 19.7313 1.61566 20.3375C2.16566 20.9438 2.95941 21.2938 3.78753 21.2938H18.2125C19.0407 21.2938 19.8344 20.9438 20.3844 20.3375C20.9688 19.7313 21.2438 18.9063 21.1063 18.0469ZM12.5844 16.7094C12.5844 17.0594 12.2969 17.3469 11.9469 17.3469C11.5969 17.3469 11.3094 17.0594 11.3094 16.7094V10.4938C11.3094 10.1438 11.5969 9.85626 11.9469 9.85626C12.2969 9.85626 12.5844 10.1438 12.5844 10.4938V16.7094ZM11.9469 8.13438C11.3 8.13438 10.7781 7.61251 10.7781 6.96563C10.7781 6.31876 11.3 5.79688 11.9469 5.79688C12.5938 5.79688 13.1157 6.31876 13.1157 6.96563C13.1157 7.61251 12.5938 8.13438 11.9469 8.13438Z"
              fill=""
            />
          </svg>
        </CardDataStats>
        <CardDataStats title="New Orders" total="3.576" rate="0.99%" levelDown>
          <svg
            className="fill-[#C03221]"
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.9453 0.667969C5.87031 0.667969 0.945312 5.59397 0.945312 11.668C0.945312 17.743 5.87031 22.668 11.9453 22.668C18.0203 22.668 22.9453 17.743 22.9453 11.668C22.9453 5.59397 18.0203 0.667969 11.9453 0.667969ZM11.9453 21.2711C6.64844 21.2711 2.34219 16.9659 2.34219 11.668C2.34219 6.37009 6.64844 2.06497 11.9453 2.06497C17.2432 2.06497 21.5484 6.37009 21.5484 11.668C21.5484 16.9659 17.2432 21.2711 11.9453 21.2711Z"
              fill=""
            />
            <path
              d="M16.0772 13.3641L12.3119 9.59887C12.0212 9.30823 11.5453 9.30823 11.2547 9.59887L7.4894 13.3641C7.19875 13.6547 7.19875 14.1306 7.4894 14.4212C7.78004 14.7119 8.25591 14.7119 8.54656 14.4212L11.583 11.3848L14.6194 14.4212C14.9101 14.7119 15.3859 14.7119 15.6766 14.4212C15.9672 14.1306 15.9672 13.6547 16.0772 13.3641Z"
              fill=""
            />
          </svg>
        </CardDataStats>
      </div>
      <RecentlyAddedItems />
    </>
  );
};

export default SellerECommerce;
