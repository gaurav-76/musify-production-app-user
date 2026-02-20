import { Routes, Route, useLocation } from 'react-router-dom';
import DisplayHome from './DisplayHome.jsx';
import DisplayAlbum from './DisplayAlbum.jsx';
import DisplaySearch from './DisplaySearch.jsx';
import Navbar from './Navbar.jsx';
import { PlayerContext } from '../context/PlayerContext.jsx';
import { useContext, useEffect, useRef } from 'react';

const Display = () => {

    const { albumsData } = useContext(PlayerContext);
    const displayRef = useRef();
    const location = useLocation();
    const isAlbumPage = location.pathname.includes("album");
    const albumId = isAlbumPage ? location.pathname.split("/").pop() : "";
    const album = isAlbumPage ? albumsData.find(x => x._id == albumId) : null;
    const bgColour = album?.bgColour || '#121212';

    useEffect(() => {
        if (isAlbumPage) {
            displayRef.current.style.background = `linear-gradient(${bgColour}, #121212)`;
        } else {
            displayRef.current.style.background = '#121212';
        }
    }, [isAlbumPage, bgColour]);

    return (
        <div ref={displayRef} className="w-[100%] m-2 bg-[#121212] text-white lg:w-[75%] lg:ml-0 flex flex-col">
            {/* Sticky navbar */}
            <div className="sticky top-0 x-10 bg-[#121212]/95 backdrop-blur-sm border-b border-gray-800/50 px-6 pt-4 pb-2">
                <Navbar />
            </div>
            {/*Scrollable content */}
            <div className="flex-1 px-6 pb-6 overflow-auto">
                <Routes>
                    <Route path="/" element={<DisplayHome />} />
                    <Route path="/album/:id" element={<DisplayAlbum album={albumsData.find(x => x._id == albumId)} />} />
                    <Route path="/search" element={<DisplaySearch />} />
                </Routes>
            </div>
        </div>

    )
}

export default Display;