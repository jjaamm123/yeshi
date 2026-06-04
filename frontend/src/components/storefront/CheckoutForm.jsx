import { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../../context/CartContext';

const CheckoutForm = () => {
  const { cartItems, cartTotal } = useCart();
  const [customer, setCustomer] = useState({ name: '', email: '', address: '' });
  const [paymentMethod, setPaymentMethod] = useState('eSewa');
  const [bankRef, setBankRef] = useState('');
  
  const [esewaParams, setEsewaParams] = useState(null);

  const openKhalti = () => {
    const config = {
        publicKey: "test_public_key_dc74e0fd57cb46cd93832aee0a390234",
        productIdentity: "yeshii_cart",
        productName: "Yeshii's Collection Cart",
        productUrl: "http://localhost:5173",
        eventHandler: {
            onSuccess (payload) {
                axios.post('https://yeshi-bg5i.onrender.com/api/payments/khalti/verify', {
                    token: payload.token,
                    amount: payload.amount
                }).then(res => {
                    if (res.data.success) {
                        createOrder('Khalti', res.data.transactionId, 'Verified');
                    }
                });
            },
            onError (error) {
                console.log(error);
            }
        }
    };
    const checkout = new window.KhaltiCheckout(config);
    checkout.show({ amount: cartTotal });
  };

  const createOrder = async (method, transactionId, status) => {
      const orderPayload = {
          items: cartItems.map(item => ({ name: item.name, priceAtPurchase: item.basePrice, size: item.size, color: item.color, quantity: item.quantity })),
          totalAmount: cartTotal,
          paymentMethod: method,
          paymentTransactionId: transactionId,
          paymentStatus: status,
          customerDetails: customer
      };
      
      try {
          await axios.post('https://yeshi-bg5i.onrender.com/api/payments/create-order', orderPayload);
          alert('Order Created Successfully!');
      } catch (e) {
          console.error(e);
      }
  };

  const handleEsewaSubmit = async (e) => {
      e.preventDefault();
      const transaction_uuid = Date.now().toString() + Math.random().toString(36).substring(7);
      
      try {
          const res = await axios.post('https://yeshi-bg5i.onrender.com/api/payments/esewa/sign', {
              amount: cartTotal / 100, 
              transaction_uuid
          });
          
          setEsewaParams({
              amount: cartTotal / 100,
              tax_amount: "0",
              total_amount: cartTotal / 100,
              transaction_uuid,
              product_code: res.data.product_code,
              product_service_charge: "0",
              product_delivery_charge: "0",
              success_url: "http://localhost:5173/success",
              failure_url: "http://localhost:5173/failure",
              signed_field_names: "total_amount,transaction_uuid,product_code",
              signature: res.data.signature
          });
      } catch (err) {
          console.error("eSewa sig error", err);
      }
  };
  
  useEffect(() => {
      if (esewaParams) {
          document.getElementById('esewa-form').submit();
      }
  }, [esewaParams]);

  const handleBankSubmit = async (e) => {
      e.preventDefault();
      await createOrder('Bank Transfer', bankRef, 'Pending');
  };

  return (
    <div className="border border-black p-8">
      <h2 className="text-2xl font-bold uppercase tracking-tighter mb-8">Payment Gateway</h2>
      
      <div className="space-y-4 mb-8">
        <div>
          <label className="block text-sm uppercase tracking-widest mb-1">Name</label>
          <input type="text" value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})} className="w-full border-b border-black p-2 focus:outline-none focus:border-b-2" required />
        </div>
        <div>
          <label className="block text-sm uppercase tracking-widest mb-1">Email</label>
          <input type="email" value={customer.email} onChange={e => setCustomer({...customer, email: e.target.value})} className="w-full border-b border-black p-2 focus:outline-none focus:border-b-2" required />
        </div>
        <div>
          <label className="block text-sm uppercase tracking-widest mb-1">Address</label>
          <input type="text" value={customer.address} onChange={e => setCustomer({...customer, address: e.target.value})} className="w-full border-b border-black p-2 focus:outline-none focus:border-b-2" required />
        </div>
      </div>

      <div className="mb-8 space-y-4">
        <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="payment" value="eSewa" checked={paymentMethod === 'eSewa'} onChange={() => setPaymentMethod('eSewa')} className="accent-black" />
            <span className="uppercase tracking-widest text-sm">eSewa Wallet</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="payment" value="Khalti" checked={paymentMethod === 'Khalti'} onChange={() => setPaymentMethod('Khalti')} className="accent-black" />
            <span className="uppercase tracking-widest text-sm">Khalti</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="payment" value="Bank Transfer" checked={paymentMethod === 'Bank Transfer'} onChange={() => setPaymentMethod('Bank Transfer')} className="accent-black" />
            <span className="uppercase tracking-widest text-sm">Manual Bank Transfer</span>
        </label>
      </div>

      {paymentMethod === 'Khalti' && (
          <button onClick={openKhalti} className="w-full bg-black text-white py-4 uppercase tracking-widest hover:bg-white hover:text-black border border-black transition-colors">
            Pay with Khalti
          </button>
      )}

      {paymentMethod === 'eSewa' && (
          <form id="esewa-form" action="https://rc-epay.esewa.com.np/api/epay/main/v2/form" method="POST" onSubmit={handleEsewaSubmit}>
            {esewaParams && Object.keys(esewaParams).map(key => (
                <input key={key} type="hidden" name={key} value={esewaParams[key]} />
            ))}
            <button type="submit" className="w-full bg-black text-white py-4 uppercase tracking-widest hover:bg-white hover:text-black border border-black transition-colors">
                Pay with eSewa
            </button>
          </form>
      )}

      {paymentMethod === 'Bank Transfer' && (
          <form onSubmit={handleBankSubmit} className="space-y-4 border border-black p-6 bg-gray-50">
              <div className="text-sm uppercase tracking-widest space-y-1 mb-4">
                  <p>Bank: Everest Bank</p>
                  <p>Account Name: Yeshii Collection</p>
                  <p>Account Number: 01234567890</p>
              </div>
              <div>
                  <label className="block text-sm uppercase tracking-widest mb-1">Transaction Ref ID</label>
                  <input type="text" value={bankRef} onChange={e => setBankRef(e.target.value)} className="w-full border-b border-black p-2 bg-transparent focus:outline-none focus:border-b-2" required />
              </div>
              <button type="submit" className="w-full bg-black text-white py-4 uppercase tracking-widest hover:bg-white hover:text-black border border-black transition-colors">
                  Submit Bank Transfer
              </button>
          </form>
      )}
    </div>
  );
};

export default CheckoutForm;
