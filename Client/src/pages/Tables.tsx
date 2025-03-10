import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import TableFour from '../components/Tables/TableFour';
import TableFive from '../components/Tables/receivedRequests';
//import ConnectedUsers from '../components/Tables/connectionList';
import ProductDetails from '../components/Tables/productOrderCard';

const Tables = () => {
  return (
    <>
      <Breadcrumb pageName="connections" />

      <div className="flex flex-col gap-10">
      <TableFive />
        <TableFour/>
        <ProductDetails />
      </div>
    </>
  );
};

export default Tables;
