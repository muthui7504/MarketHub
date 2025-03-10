import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ClickOutside from '../ClickOutside';
import { AppContext } from '../../Context/appContext';
import { FaUserCircle } from 'react-icons/fa';

interface UserData {
  name: string;
  userType: string;
  image?: string;
}

const DropdownUser = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  const appContext = useContext(AppContext);
  if (!appContext) {
    throw new Error('DropdownUser component must be used within an AppContextProvider');
  }
  const { backendUrl } = appContext;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/auth/get-user`, {
          withCredentials: true,
        });
        //console.log('User data:', response.data);
        setUserData(response.data);
      } catch (error) {
        //console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [backendUrl]);

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <Link
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
        to="#"
      >
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-medium text-black dark:text-white">
            {userData ? userData.name : 'Loading...'}
          </span>
          <span className="block text-xs">
            {userData ? userData.userType : 'Loading...'}
          </span>
        </span>

        <span className="h-12 w-12 rounded-full">
          {userData && userData.image ? (
            <img
              src={`${backendUrl}${userData.image}`}
              alt="User"
              className="rounded-full"
            />
          ) : (
            <FaUserCircle className="h-12 w-12 text-gray-500" />
          )}
        </span>

        <svg
          className="hidden fill-current sm:block"
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.410765 0.910734C0.736202 0.585297 1.26384 0.585297 1.58928 0.910734L6.00002 5.32148L10.4108 0.910734C10.7362 0.585297 11.2638 0.585297 11.5893 0.910734C11.9147 1.23617 11.9147 1.76381 11.5893 2.08924L6.58928 7.08924C6.26384 7.41468 5.7362 7.41468 5.41077 7.08924L0.410765 2.08924C0.0853277 1.76381 0.0853277 1.23617 0.410765 0.910734Z"
            fill=""
          />
        </svg>
      </Link>

      {/* Dropdown Content */}
      {dropdownOpen && (
        <div
          className={`absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark`}
        >
          <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-7.5 dark:border-strokedark">
            <li>
              <Link
                to={userData?.userType === 'supplier' ? '/profile' : '/seller-profile'}
                className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
              >
                <svg
                  className="fill-current"
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11 9.62499C8.42188 9.62499 6.35938 7.59687 6.35938 5.12187C6.35938 2.64687 8.42188 0.618744 11 0.618744C13.5781 0.618744 15.6406 2.64687 15.6406 5.12187C15.6406 7.59687 13.5781 9.62499 11 9.62499ZM11 2.16562C9.28125 2.16562 7.90625 3.50624 7.90625 5.12187C7.90625 6.73749 9.28125 8.07812 11 8.07812C12.7188 8.07812 14.0938 6.73749 14.0938 5.12187C14.0938 3.50624 12.7188 2.16562 11 2.16562Z"
                    fill=""
                  />
                  <path
                    d="M17.7719 21.4156H4.2281C3.5406 21.4156 2.9906 20.8656 2.9906 20.1781V17.0844C2.9906 13.7156 5.7406 10.9656 9.10935 10.9656H12.925C16.2937 10.9656 19.0437 13.7156 19.0437 17.0844V20.1781C19.0094 20.8312 18.4594 21.4156 17.7719 21.4156ZM4.53748 19.8687H17.4969V17.0844C17.4969 14.575 15.4344 12.5125 12.925 12.5125H9.07498C6.5656 12.5125 4.5031 14.575 4.5031 17.0844V19.8687H4.53748Z"
                    fill=""
                  />
                </svg>
                My Profile
              </Link>
            </li>
            <li>
              <Link
                to="/messages"
                className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
              >
                <svg
                  className="fill-current"
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.6687 1.44374C17.1187 0.893744 16.4312 0.618744 15.675 0.618744H7.42498C6.25623 0.618744 5.25935 1.58124 5.25935 2.78437V4.12499H4.29685C3.88435 4.12499 3.50623 4.46874 3.50623 4.91562C3.50623 5.36249 3.84998 5.70624 4.29685 5.70624H5.25935V10.2781H4.29685C3.88435 10.2781 3.50623 10.6219 3.50623 11.0687C3.50623 11.4812 3.84998 11.8594 4.29685 11.8594H5.25935V16.4312H4.29685C3.88435 16.4312 3.50623 16.775 3.50623 17.2219C3.50623 17.6687 3.84998 18.0125 4.29685 18.0125H5.25935V19.25C5.25935 20.4187 6.22185 21.4156 7.42498 21.4156H15.675C17.2218 21.4156 18.4937 20.1437 18.5281 18.5969V3.47187C18.5281 2.75001 18.2187 2.03124 17.6687 1.44374ZM7.09685 2.16562H15.675C15.994 2.16562 16.2781 2.29062 16.4594 2.50312L8.7656 5.83124L6.50623 4.84687V2.78437C6.50623 2.37187 6.88435 2.16562 7.09685 2.16562ZM16.5062 18.5969C16.5062 19.1094 16.0281 19.5875 15.5156 19.5875H7.42498C7.01248 19.5875 6.63435 19.2094 6.63435 18.7969V4.67812L8.4781 5.55937C8.63248 5.62812 8.82185 5.62812 8.97623 5.55937L16.5062 2.81249V18.5969Z"
                    fill=""
                  />
                </svg>
                Messages
              </Link>
            </li>
          </ul>
          <ul className="flex flex-col px-6 py-7.5">
            <li>
              <Link
                 to={userData?.userType === 'seller' ? '/seller-settings' : '/settings'}
                 className="flex items-center gap-3.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
               >
                <svg
                  className="fill-current"
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11 14.5C12.93 14.5 14.5 12.93 14.5 11C14.5 9.07 12.93 7.5 11 7.5C9.07 7.5 7.5 9.07 7.5 11C7.5 12.93 9.07 14.5 11 14.5ZM11 9C12.1 9 13 9.9 13 11C13 12.1 12.1 13 11 13C9.9 13 9 12.1 9 11C9 9.9 9.9 9 11 9Z"
                    fill=""
                  />
                  <path
                    d="M19.43 12.98C19.73 11.72 19.73 10.28 19.43 9.02L21.03 7.61C21.32 7.35 21.39 6.91 21.15 6.58L19.49 4.02C19.24 3.69 18.8 3.62 18.47 3.86L16.74 5.05C15.72 4.2 14.48 3.6 13.1 3.29L12.72 1.39C12.67 1.04 12.36 0.75 12 0.75H10C9.64 0.75 9.33 1.04 9.28 1.39L8.9 3.29C7.52 3.6 6.28 4.2 5.26 5.05L3.53 3.86C3.2 3.62 2.76 3.69 2.51 4.02L0.85 6.58C0.61 6.91 0.68 7.35 0.97 7.61L2.57 9.02C2.27 10.28 2.27 11.72 2.57 12.98L0.97 14.39C0.68 14.65 0.61 15.09 0.85 15.42L2.51 17.98C2.76 18.31 3.2 18.38 3.53 18.14L5.26 16.95C6.28 17.8 7.52 18.4 8.9 18.71L9.28 20.61C9.33 20.96 9.64 21.25 10 21.25H12C12.36 21.25 12.67 20.96 12.72 20.61L13.1 18.71C14.48 18.4 15.72 17.8 16.74 16.95L18.47 18.14C18.8 18.38 19.24 18.31 19.49 17.98L21.15 15.42C21.39 15.09 21.32 14.65 21.03 14.39L19.43 12.98ZM11 16.5C8.52 16.5 6.5 14.48 6.5 12C6.5 9.52 8.52 7.5 11 7.5C13.48 7.5 15.5 9.52 15.5 12C15.5 14.48 13.48 16.5 11 16.5Z"
                    fill=""
                  />
                </svg>
                Settings
              </Link>
            </li>
            <li>
              <Link
                to="/logout"
                className="flex items-center gap-3.5 text-sm font-medium text-meta-1 duration-300 ease-in-out hover:text-primary lg:text-base"
              >
                <svg
                  className="fill-current"
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14.6576 14.9623C14.3722 14.6769 14.3722 14.2231 14.6576 13.9376L16.5951 12H8.3334C7.92959 12 7.59998 11.6704 7.59998 11.2666C7.59998 10.8628 7.92959 10.5332 8.3334 10.5332H16.5951L14.6576 8.59575C14.3722 8.31027 14.3722 7.85649 14.6576 7.57101C14.9431 7.28553 15.3969 7.28553 15.6824 7.57101L18.5609 10.4495C18.8464 10.735 18.8464 11.1887 18.5609 11.4742L15.6824 14.3527C15.3969 14.6382 14.9431 14.6382 14.6576 14.9623ZM11.5132 21.4C10.3385 21.4 9.35649 20.8663 8.61317 19.8431C7.87001 18.8197 7.45478 17.2855 7.45478 15.4734C7.45478 15.0696 7.78439 14.7399 8.1882 14.7399C8.59202 14.7399 8.92162 15.0696 8.92162 15.4734C8.92162 17.0027 9.27358 18.1755 9.80969 18.9511C10.3456 19.7267 11.0554 20.1332 11.5132 20.1332C11.9707 20.1332 12.6807 19.7267 13.2167 18.9511C13.7528 18.1755 14.1048 17.0027 14.1048 15.4734C14.1048 15.0696 14.4345 14.7399 14.8383 14.7399C15.2421 14.7399 15.5717 15.0696 15.5717 15.4734C15.5717 17.2855 15.1565 18.8197 14.4133 19.8431C13.6699 20.8663 12.6882 21.4 11.5132 21.4Z"
                    fill=""
                  />
                </svg>
                Logout
              </Link>
            </li>
          </ul>
        </div>
      )}
    </ClickOutside>
  );
};

export default DropdownUser;
