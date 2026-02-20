import { Toaster } from 'react-hot-toast';
import AuthWrapper from './components/AuthWrapper.jsx';
import Display from './components/Display.jsx';
import Player from './components/Player.jsx';
import Sidebar from './components/Sidebar.jsx';
import { PlayerContext } from './context/PlayerContext.jsx';
import { useContext } from 'react';

const App = () => {

  const {audioRef, track} = useContext(PlayerContext);

  return (
    <>
      <Toaster />
      <AuthWrapper>
        <div className="h-screen bg-black">
          <div className="h-[90%] flex">
            <Sidebar />
            <Display />
          </div>
          {/*Player component */}
          <Player />
          <audio 
              ref={audioRef} 
              src={track ? track.file : null}
              preload="auto">
          </audio>
        </div>
      </AuthWrapper>
    </>

  )
}

export default App;