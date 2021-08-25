import LabelImg from './components/LabelImg';
import './App.css';

function App() {
  return (
    <div className="App">
      <LabelImg
        labelTypes={['Dog', 'Cat']}
      />
    </div>
  );
}

export default App;
