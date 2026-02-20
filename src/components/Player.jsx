import { useContext } from 'react';
import { PlayerContext } from '../context/PlayerContext.jsx';
import { ListMusic, Maximize2, Mic, Minimize2, Pause, Play, Repeat, Shuffle, SkipBack, SkipForward, Speaker, Volume } from 'lucide-react';

export const Player = () => {

    const {track, seekBar, seekBg, playStatus, play, pause, time, previousTrack, nextTrack, seekSong} = useContext(PlayerContext);
    
    return track ? (
        <div className="h-[10%] bg-black flex justify-between items-center px-4 text-white">
            <div className="hidden lg:flex items-center gap-4">
                <img src={track.image} alt="" className="w-12" />
                <div>
                    <p>{track.name}</p>
                    <p>{track.desc.slice(0, 12)}</p>
                </div>
            </div>
            <div className="flex flex-col items-center gap-1 m-auto">
                <div className="flex gap-4">
                    <Shuffle 
                        className="w-4 h-4 text-white hover:text-green-500 cursor-pointer transition-colors"
                    />
                    <SkipBack 
                        onClick={previousTrack}
                        className="w-4 h-4 text-white hover:text-green-500 cursor-pointer transition-colors"
                    />
                    {playStatus ? (
                        <Pause 
                            onClick={pause}
                            className="w-4 h-4 text-white hover:text-green-500 cursor-pointer transition-colors"
                        />
                    ) : (
                        <Play
                            onClick={play}
                            className="w-4 h-4 text-white hover:text-green-500 cursor-pointer transition-colors"
                        />
                    )}
                    <SkipForward 
                        onClick={nextTrack}
                        className="w-4 h-4 text-white hover:text-green-500 cursor-pointer transition-colors"
                    />
                    <Repeat
                        className="w-4 h-4 text-white hover:text-green-500 cursor-pointer transition-colors"
                    />
                </div>
                <div className="flex items-center gap-5">
                    <p>
                        {time.currentTime.minutes}:{time.currentTime.seconds}
                    </p>
                    <div ref={seekBg} onClick={seekSong} className="w-[60vw] max-w-[500px] bg-gray-300 rounded-full cursor-pointer">
                        <hr
                            ref={seekBar}
                            className="bg-green-800 h-1 rounded-full border-none w-0"
                        />
                    </div>
                    <p>{track.duration}</p>
                </div>
            </div>
            <div className="hidden lg:flex items-center gap-2 opacity-75">
                <ListMusic className="w-4 h-4 text-white hover:text-green-500 cursor-pointer transition-colors" />
                <Mic className="w-4 h-4 text-white hover:text-green-500 cursor-pointer transition-colors" />
                <Speaker className="w-4 h-4 text-white hover:text-green-500 cursor-pointer transition-colors" />
                <Volume className="w-4 h-4 text-white hover:text-green-500 cursor-pointer transition-colors" />
                <Minimize2 className="w-4 h-4 text-white hover:text-green-500 cursor-pointer transition-colors" />
                <Maximize2 className="w-4 h-4 text-white hover:text-green-500 cursor-pointer transition-colors" />
            </div>
        </div>
    ) : null;
}

export default Player;