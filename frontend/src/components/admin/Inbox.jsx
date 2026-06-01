import { useState } from 'react';

const Inbox = () => {
  const [messages, setMessages] = useState([
    { id: 1, name: 'Jane Roe', email: 'jane@example.com', message: 'Do you restock the linen dress?', status: 'unread' },
    { id: 2, name: 'John Doe', email: 'john@example.com', message: 'My order is late.', status: 'read' }
  ]);

  const markAsRead = (id) => {
    setMessages(messages.map(m => m.id === id ? { ...m, status: 'read' } : m));
  };

  return (
    <div>
      <h2 className="text-3xl font-bold uppercase tracking-tighter mb-10">Inbox</h2>
      
      <div className="space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={`border border-black p-6 ${msg.status === 'unread' ? 'border-l-8' : ''}`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-bold">{msg.name}</h4>
                <p className="text-sm text-gray-500">{msg.email}</p>
              </div>
              {msg.status === 'unread' && (
                <button 
                  onClick={() => markAsRead(msg.id)}
                  className="text-xs uppercase tracking-widest border border-black px-3 py-1 hover:bg-black hover:text-white transition-colors"
                >
                  Mark Read
                </button>
              )}
            </div>
            <p className="text-lg">{msg.message}</p>
          </div>
        ))}
        {messages.length === 0 && <p className="uppercase tracking-widest text-gray-500">No messages.</p>}
      </div>
    </div>
  );
};

export default Inbox;
