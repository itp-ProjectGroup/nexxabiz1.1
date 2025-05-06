import Message from "../../components/Message";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useGetMyOrdersQuery } from "../../redux/api/orderApiSlice";

const UserOrder = () => {
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-semibold mb-4">My Orders</h2>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.error || error.error}</Message>
      ) : (
        <table className="w-full">
          <thead>
            <tr>
              <th className="py-2">ORDER ID</th>
              <th className="py-2">COMPANY</th>
              <th className="py-2">DATE</th>
              <th className="py-2">PAYMENT STATUS</th>
              <th className="py-2">ORDER STATUS</th>
              <th className="py-2"></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.od_Id}>
                <td className="py-2">{order.od_Id}</td>
                <td className="py-2">{order.company_name}</td>
                <td className="py-2">{new Date(order.od_date).toISOString().substring(0, 10)}</td>
                <td className="py-2">
                  {order.pay_status === "Paid" ? (
                    <p className="p-1 text-center bg-green-400 w-[6rem] rounded-full">
                      Completed
                    </p>
                  ) : (
                    <p className="p-1 text-center bg-red-400 w-[6rem] rounded-full">
                      {order.pay_status}
                    </p>
                  )}
                </td>
                <td className="py-2">
                  {order.od_status === "Delivered" ? (
                    <p className="p-1 text-center bg-green-400 w-[6rem] rounded-full">
                      Completed
                    </p>
                  ) : (
                    <p className="p-1 text-center bg-red-400 w-[6rem] rounded-full">
                      {order.od_status}
                    </p>
                  )}
                </td>
                <td className="px-2 py-2">
                  <Link to={`/order/${order.od_Id}`}>
                    <button className="bg-[#bd7df0] text-white py-2 px-3 rounded hover:bg-[#a86de0]">
                      View Details
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserOrder;