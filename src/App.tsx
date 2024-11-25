import Navigation from './navigation/Navigation'
import './index.css'
import ErrorBoundary from './components/ErrorBoundary'

function App() {
  

  return (
    <ErrorBoundary>
      <Navigation />
    </ErrorBoundary>
  )
}

export default App
