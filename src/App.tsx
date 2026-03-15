import './styles/App.scss';
import PrioritizationGrid from './components/PrioritizationGrid';
import { getMaxItemsFromSearchParams } from './utils/utils';

function App() {
  const maxItems = getMaxItemsFromSearchParams();
  return (
    <div className="App">
      <PrioritizationGrid maxItems={maxItems} />
    </div>
  );
}

export default App;
