import { useState } from 'react';

const OrderPipeline = () => {
  const [orders, setOrders] = useState([
    { id: 'ORD-123', status: 'pending', amount: 4500, customer: 'Alice Doe' },
    { id: 'ORD-124', status: 'processing', amount: 12000, customer: 'Bob Smith' }
  ]);

  const statuses = ['pending', 'processing', 'shipped', 'delivered'];

  const moveOrder = (id, newStatus) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  return (
    <div>
      <h2 className="text-3xl font-bold uppercase tracking-tighter mb-10">Order Pipeline</h2>
      
      <div className="grid grid-cols-4 gap-6">
        {statuses.map(status => (
          <div key={status} className="border border-black p-4 min-h-[500px]">
            <h3 className="uppercase tracking-widest text-sm font-bold mb-6 border-b border-black pb-2">{status}</h3>
            <div className="space-y-4">
              {orders.filter(o => o.status === status).map(order => (
                <div key={order.id} className="border border-black p-4 bg-white hover:bg-black hover:text-white transition-colors group">
                  <div className="text-xs uppercase tracking-widest mb-2 opacity-50 group-hover:opacity-100">{order.id}</div>
                  <div className="font-medium mb-1">{order.customer}</div>
                  <div className="text-sm mb-4">${(order.amount / 100).toFixed(2)}</div>
                  <div className="flex gap-2">
                    {statuses.map(s => s !== status && (
                      <button 
                        key={s}
                        onClick={() => moveOrder(order.id, s)}
                        className="text-xs uppercase border border-current px-2 py-1 hover:opacity-50"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderPipeline;
