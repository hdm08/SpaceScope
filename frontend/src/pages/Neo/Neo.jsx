import React from 'react';

import Neobar from "../../components/Neobar";
import AsteroidExplorerDashboard from "./AsteroidExplorerDashboard";
import CloseApproachTimeline from "./CloseApproachTimeline";
import HazardousStats from "./HazardousStats";
import HistoricCloseApproaches from "./HistoricCloseApproaches";
import SizeVsDistancePlot from "./SizeVsDistancePlot";
import HazardousAsteroidsMap from './HazardousAsteroidsMap';

const { useState } = React;

const NeoApp = () => {
  const [activeView, setActiveView] = useState('timeline');

  const renderView = () => {
    switch (activeView) {
      case 'timeline':
        return <CloseApproachTimeline />;
      case 'map':
        return <HazardousAsteroidsMap />;
      case 'scatter':
        return <SizeVsDistancePlot />;
      case 'dashboard':
        return <AsteroidExplorerDashboard />;
      case 'stats':
        return <HazardousStats />;
      case 'historic':
        return <HistoricCloseApproaches />;
      default:
        return <CloseApproachTimeline />;
    }
  };

  return (
    <div className="min-h-screen flex bg-transparent">
      <Neobar setActiveView={setActiveView} activeView={activeView} />
      <main className="flex-1 p-8 overflow-auto">
        {renderView()}
      </main>
    </div>
  );
};

export default NeoApp;
