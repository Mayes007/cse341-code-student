import { useEffect, useState } from 'react';
import { pb } from './lib/pocketbase';
import AddMedia from './AddMedia';

function App() {
  const [mediaList, setMediaList] = useState([]);

  useEffect(() => {
    const fetchList = async () => {
      const records = await pb.collection('media').getFullList({ sort: '-created' });
      setMediaList(records);
    };
    fetchList();
  }, []);

  const handleAddNew = (newRecord) => {
    setMediaList([newRecord, ...mediaList]);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">My Watchlist</h1>
      <AddMedia onAdd={handleAddNew} />
      
      <div className="mt-8 grid gap-4">
        {mediaList.map((item) => (
          <div key={item.id} className="p-4 shadow border rounded flex justify-between">
            <span>{item.title} ({item.type})</span>
            <span className="text-gray-500 italic">{item.status.replace(/_/g, ' ')}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;