const Neobar = ({ setActiveView, activeView }) => {
  const views = [
    { id: 'timeline', label: 'Close Approach Timeline' },
    { id: 'map', label: 'Hazardous Asteroids Map' },
    { id: 'scatter', label: 'Size vs Distance Plot' },
   
    { id: 'stats', label: 'Hazardous Stats' },
    { id: 'historic', label: 'Historic Close Approaches' },
    { id: 'dashboard', label: 'Asteroid Explorer Dashboard' },
  ];

  return (
    <aside className="w-64 bg-transparent text-white p-4 min-h-screen">
      <ul className="space-y-2">
        {views.map(view => (
          <li key={view.id}>
            <button
              onClick={() => setActiveView(view.id)}
              className={`w-full text-left px-3 py-2 rounded-md ${activeView === view.id ? 'bg-indigo-800' : 'hover:bg-indigo-500'}`}
            >
              {view.label}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Neobar;
