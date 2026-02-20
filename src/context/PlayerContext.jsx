import { createContext, use, useContext, useEffect, useRef } from "react";
import { AuthContext, useAuth } from "./AuthContext";
import { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "./AuthContext";

export const PlayerContext = createContext();

export const PlayerContextProvider = ({ children }) => {

    const [songsData, setSongsData] = useState([]);
    const [albumsData, setAlbumsData] = useState([]);
    const [track, setTrack] = useState(songsData[0] || null);
    const [playStatus, setPlayStatus] = useState(false);
    const [time, setTime] = useState({
        currentTime: {
            seconds: 0,
            minutes: 0
        },
        totalTime: {
            seconds: 0,
            minutes: 0
        }
    });
    const { user, token, getAuthHeaders } = useAuth();
    const audioRef = useRef();
    const seekBg = useRef();
    const seekBar = useRef();

    const play = () => {
        audioRef.current.play();
        setPlayStatus(true);    
    }

    const pause = () => {
        audioRef.current.pause();
        setPlayStatus(false);
    }

    const playWithId = async (id) => {
        const selectedSong = songsData.find(item => item._id === id); // Define selectedSong
        if (selectedSong) {
            setTrack(selectedSong);
            if (audioRef.current) {
                audioRef.current.currentTime = 0; // Reset the current time to 0
                setTime({
                    currentTime: {
                        seconds: 0,
                        minutes: 0
                    },
                    totalTime: {
                        seconds: 0,
                        minutes: 0
                    }
                });
                audioRef.current.src = selectedSong.audioUrl; // Set the audio source to the selected song's URL

                // Wait for the audio to load before playing
                const handleLoadedMetadata = async () => {
                    try {
                        await audioRef.current.play(); // Play the audio
                        setPlayStatus(true);
                    } catch (error) {
                        console.error("Error playing audio:", error);
                    }
                };

                audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata, { once: true });
            } else {
                console.error("audioRef is not initialized");
            }
        } else {
            console.error("Selected song not found");
        }
    }

    const previousTrack = async () => {
        songsData.map(async(item, index) => {
            if(item._id === track._id && index > 0){
                await setTrack(songsData[index - 1]);
                await audioRef.current.play();
                setPlayStatus(true);
            }
        })
    }

    const nextTrack = async () => {
        songsData.map(async(item, index) => {
            if(item._id === track._id && index < songsData.length-1){
                await setTrack(songsData[index + 1]);
                await audioRef.current.play();
                setPlayStatus(true);
            }
        })
    }

    const seekSong = async(event) => {
        audioRef.current.currentTime = (event.nativeEvent.offsetX / seekBg.current.offsetWidth) * audioRef.current.duration;
    }


    const getSongsData = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/songs`, {
                headers: getAuthHeaders()
            });

            const songs = response.data.songs || [];
            setSongsData(songs);
            if(songs.length > 0){
                setTrack(songs[0]);
            }
        } catch (error) {
            setSongsData([]);
        }
    }

    const getAlbumsData = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/albums`, {
                headers: getAuthHeaders()
            });

            const albums = response.data.albums || [];
            setAlbumsData(albums);
        } catch (error) {
            setAlbumsData([]);
        }
    }

    const contextValue = {
        getSongsData,
        getAlbumsData,
        songsData,
        albumsData,
        track, setTrack,
        playStatus, setPlayStatus,
        time, setTime,
        audioRef, seekBg, seekBar,
        play, pause, playWithId,
        previousTrack,
        nextTrack,
        seekSong
    }

    useEffect(() => {
        if (user && token) {
            getAlbumsData();
            getSongsData();
        }
    }, [user, token]);

    //Setup audio event listeners
    useEffect(() => {
        const audio = audioRef.current;
        if(!audio) return;

        const updateSeekBar = () => {
            if(seekBar.current && audio.duration) {
                const progress = (audio.currentTime / audio.duration) * 100;
                seekBar.current.style.width = Math.floor(progress) + '%';
                setTime({
                    currentTime:{
                        seconds: Math.floor(audio.currentTime % 60),
                        minutes: Math.floor(audio.currentTime / 60)
                    },
                    totalTime: {
                        seconds: Math.floor(audio.duration % 60),
                        minutes: Math.floor(audio.duration / 60)
                    }
                });
            }
        };
        const handleLoadedMetaData = () => {
            if(seekBar.current){
                seekBar.current.style.width = '0%';
            }   
        };

        // add event listners
        audio.addEventListener('timeupdate', updateSeekBar);
        audio.addEventListener('loadedmetadata', handleLoadedMetaData);

        // cleanup function
        return () => {
            audio.removeEventListener('timeupdate', updateSeekBar);
            audio.removeEventListener('loadedmetadata', handleLoadedMetaData);
        }   

    }, [track]);

    return (
        <PlayerContext.Provider value={contextValue}>
            {children}
        </PlayerContext.Provider>
    )
}
