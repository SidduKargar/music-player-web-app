import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col } from 'react-bootstrap';
import { Play, Pause, SkipForward, SkipBack, Volume2, Search, Home, Library, Heart, Plus, Clock, Music } from 'lucide-react';

function App() {
  const [tracks, setTracks] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [audio] = useState(new Audio());
  const [activeMenu, setActiveMenu] = useState('home');
  const [currentView, setCurrentView] = useState('home');
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [userPlaylists, setUserPlaylists] = useState([
    "My Favorite Songs",
    "Party Playlist",
    "Workout Mix",
    "Chill Vibes"
  ]);

  const playlists = {
    'bollywood-hits': {
      title: 'Bollywood Hits',
      search: 'latest bollywood hits 2024'
    },
    'arijit-mix': {
      title: 'Arijit Singh Mix',
      search: 'arijit singh best songs'
    },
    'sonu-classics': {
      title: 'Sonu Nigam Classics',
      search: 'sonu nigam classic songs'
    },
    'party-mix': {
      title: 'Party Mix',
      search: 'bollywood party songs dance'
    },
    'romantic-hits': {
      title: 'Romantic Hits',
      search: 'bollywood romantic songs'
    },
    'kumar-sanu': {
      title: 'Kumar Sanu Hits',
      search: 'kumar sanu hits'
    },
    'lata-hits': {
      title: 'Lata Mangeshkar Classics',
      search: 'lata mangeshkar songs'
    },
    'kishore-hits': {
      title: 'Kishore Kumar Legends',
      search: 'kishore kumar songs'
    },
    'rafi-collection': {
      title: 'Mohammed Rafi Collection',
      search: 'mohammed rafi songs'
    },
    'neha-kakkar': {
      title: 'Neha Kakkar Hits',
      search: 'neha kakkar songs'
    },
    'shreya-ghoshal': {
      title: 'Shreya Ghoshal Collection',
      search: 'shreya ghoshal songs'
    },
    'atif-aslam': {
      title: 'Atif Aslam Hits',
      search: 'atif aslam songs'
    },
    'ar-rahman': {
      title: 'A.R. Rahman Collection',
      search: 'ar rahman songs'
    },
    'pritam-hits': {
      title: 'Pritam Hits',
      search: 'pritam songs'
    },
    'vishal-shekar': {
      title: 'Vishal-Shekhar Hits',
      search: 'vishal shekhar songs'
    },
    'amit-trivedi': {
      title: 'Amit Trivedi Collection',
      search: 'amit trivedi songs'
    },
    'mithoon-hits': {
      title: 'Mithoon Hits',
      search: 'mithoon songs'
    },
    'sachet-parampara': {
      title: 'Sachet-Parampara Hits',
      search: 'sachet parampara songs'
    },
    'jubin-nautiyal': {
      title: 'Jubin Nautiyal Collection',
      search: 'jubin nautiyal songs'
    },
    'darshan-raval': {
      title: 'Darshan Raval Hits',
      search: 'darshan raval songs'
    }
  };

const fetchTracks = async (searchTerm = '') => {
  try {
    const response = await axios.get('https://api.jamendo.com/v3.0/tracks/', {
      params: {
        client_id: 'bf0a685e',
        format: 'json',
        limit: 50,
        search: searchTerm || 'indian',
        tags: '',
        boost: 'popularity_total',
      }
    });
    setTracks(response.data.results.map(track => ({
      id: track.id,
      name: track.name,
      artist_name: track.artist_name,
      album_name: track.album_name,
      duration: track.duration,
      image: track.album_image,
      audio: track.audio
    })));
  } catch (error) {
    console.error('Error fetching tracks:', error);
  }
};

  useEffect(() => {
    fetchTracks();
  }, []);

useEffect(() => {
  if (currentView === 'search' && searchQuery.length >= 2) {
    const delayDebounceFn = setTimeout(() => {
      fetchTracks(searchQuery);
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }
}, [searchQuery, currentView]);

  useEffect(() => {
    if (selectedPlaylist) {
      fetchTracks(playlists[selectedPlaylist].search);
    }
  }, [selectedPlaylist]);

  const handleCreatePlaylist = () => {
    const playlistName = prompt('Enter playlist name:');
    if (playlistName) {
      setUserPlaylists(prev => [...prev, playlistName]);
    }
  };

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
    setCurrentView(menu);
    setSelectedPlaylist(null);
    if (menu === 'home') {
      fetchTracks();
    }
  };

  const handlePlaylistClick = (playlistId) => {
    setSelectedPlaylist(playlistId);
    setCurrentView('playlist');
    setActiveMenu('');
  };

  const handlePlayPause = (track) => {
    if (currentTrack?.id === track.id) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    } else {
      if (currentTrack) {
        audio.pause();
      }
      audio.src = track.audio;
      audio.play();
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const renderMainContent = () => {
    let title = 'Popular Tracks';
    if (currentView === 'search') {
      title = 'Search Results';
    } else if (currentView === 'playlist' && selectedPlaylist) {
      title = playlists[selectedPlaylist].title;
    } else if (currentView === 'library') {
      title = 'Your Library';
    }

    return (
      <>
        <div className="mb-4">
          {currentView === 'search' && (
            <input
              type="text"
              className="search-input"
              placeholder="Search Bollywood songs, artists, or albums..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          )}
        </div>
        
        <h2 className="mb-4">{title}</h2>
        
        <Row>
          {tracks.map((track) => (
            <Col md={4} className="mb-4" key={track.id}>
              <div className="track-card">
                <img
                  src={track.image || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400'}
                  alt={track.name}
                  className="w-100 mb-3 rounded"
                />
                <h5 className="mb-1">{track.name}</h5>
                <p className="text-secondary mb-2">{track.artist_name}</p>
                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-secondary">{formatDuration(track.duration)}</small>
                  <button
                    className="play-button"
                    onClick={() => handlePlayPause(track)}
                  >
                    {currentTrack?.id === track.id && isPlaying ? (
                      <Pause size={20} color="white" />
                    ) : (
                      <Play size={20} color="white" />
                    )}
                  </button>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </>
    );
  };

  return (
    <Container fluid className="p-0">
      <Row className="m-0">
        <Col md={3} className="sidebar">
          <div className="d-flex align-items-center mb-4">
            <Music size={32} className="me-2" color="white" />
            <h3 className="mb-0">SK Music</h3>
          </div>
          
          <div className={`nav-item ${activeMenu === 'home' ? 'active' : ''}`} onClick={() => handleMenuClick('home')}>
            <Home className="me-3" />
            <span>Home</span>
          </div>
          <div className={`nav-item ${activeMenu === 'search' ? 'active' : ''}`} onClick={() => handleMenuClick('search')}>
            <Search className="me-3" />
            <span>Search</span>
          </div>
          <div className={`nav-item ${activeMenu === 'library' ? 'active' : ''}`} onClick={() => handleMenuClick('library')}>
            <Library className="me-3" />
            <span>Your Library</span>
          </div>

          <div className="mt-4">
            <div className="nav-item" onClick={handleCreatePlaylist}>
              <Plus className="me-3" />
              <span>Create Playlist</span>
            </div>
            <div className="nav-item">
              <Heart className="me-3" />
              <span>Liked Songs</span>
            </div>
          </div>

          <div className="playlist-section">
            <div className="playlist-category">Your Playlists</div>
            {userPlaylists.map((playlist, index) => (
              <div key={index} className="playlist-item">
                {playlist}
              </div>
            ))}
            
            <div className="playlist-category mt-4">Featured Playlists</div>
            {Object.entries(playlists).map(([id, playlist]) => (
              <div
                key={id}
                className={`playlist-item ${selectedPlaylist === id ? 'active' : ''}`}
                onClick={() => handlePlaylistClick(id)}
              >
                {playlist.title}
              </div>
            ))}
          </div>
        </Col>
        
        <Col md={9} className="main-content">
          {renderMainContent()}
        </Col>
      </Row>

      {currentTrack && (
        <div className="player-bar">
          <Row className="align-items-center">
            <Col md={3}>
              <div className="d-flex align-items-center">
                <img
                  src={currentTrack.image || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400'}
                  alt={currentTrack.name}
                  style={{ width: 60, height: 60 }}
                  className="rounded me-3"
                />
                <div>
                  <h6 className="mb-0">{currentTrack.name}</h6>
                  <small className="text-secondary">{currentTrack.artist_name}</small>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="d-flex justify-content-center align-items-center">
                <SkipBack size={20} className="mx-3" style={{ cursor: 'pointer' }} />
                <button
                  className="play-button mx-3"
                  onClick={() => handlePlayPause(currentTrack)}
                >
                  {isPlaying ? (
                    <Pause size={20} color="white" />
                  ) : (
                    <Play size={20} color="white" />
                  )}
                </button>
                <SkipForward size={20} className="mx-3" style={{ cursor: 'pointer' }} />
              </div>
              <div className="d-flex align-items-center justify-content-center mt-2">
                <small className="text-secondary me-2">0:00</small>
                <div className="progress" style={{ height: '4px', width: '60%' }}>
                  <div className="progress-bar" style={{ width: '30%', backgroundColor: 'var(--primary-color)' }}></div>
                </div>
                <small className="text-secondary ms-2">{formatDuration(currentTrack.duration)}</small>
              </div>
            </Col>
            <Col md={3}>
              <div className="d-flex align-items-center justify-content-end">
                <Volume2 size={20} />
                <input
                  type="range"
                  className="form-range ms-2"
                  style={{ width: 100 }}
                  onChange={(e) => {
                    audio.volume = e.target.value / 100;
                  }}
                  defaultValue={100}
                />
              </div>
            </Col>
          </Row>
        </div>
      )}
    </Container>
  );
}

export default App;