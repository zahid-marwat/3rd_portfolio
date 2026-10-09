import './YouTube.css';
import { useState, useEffect } from 'react';

function YouTube() {
  const [channels, setChannels] = useState([]);

  useEffect(() => {
    fetch('/data/portfolio.json')
      .then(response => response.json())
      .then(data => {
        if (data.youtube && data.youtube.channels) {
          setChannels(data.youtube.channels);
        }
      })
      .catch(error => console.error('Error loading YouTube data:', error));
  }, []);

  return (
    <section id="youtube" className="youtube-section">
      <div className="container">
        <h2 className="section-title">My YouTube Channels</h2>
        <p className="section-subtitle">
          Follow my journey on YouTube! Two channels with unique content 🎥
        </p>

        <div className="channels-container">
          {channels.map((channel) => (
            <div key={channel.id} className="channel-card">
              <div className="channel-header" style={{ background: channel.theme }}>
                <div className="channel-header-content">
                  <div className="channel-avatar">
                    <img src={channel.avatar} alt={channel.handle} />
                  </div>
                  <div className="channel-info">
                    <h3>{channel.name}</h3>
                    <p className="channel-handle">{channel.handle}</p>
                  </div>
                </div>
                <a 
                  href={`${channel.url}?sub_confirmation=1`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="subscribe-btn"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                    <path d="M10 20h4V8h3l-5-5-5 5h3z"/>
                    <path d="M21 10h-3v2h3v8H3v-8h3v-2H3a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2z"/>
                  </svg>
                  Subscribe
                </a>
              </div>

              <div className="channel-body">
                <p className="channel-description">{channel.description}</p>

                <div className="channel-topics">
                  {channel.topics.map((topic, index) => (
                    <span key={index} className="topic-badge">{topic}</span>
                  ))}
                </div>

                <div className="channel-links">
                  <a 
                    href={channel.videosUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="channel-link"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
                    </svg>
                    <span>All Videos</span>
                  </a>
                  <a 
                    href={channel.shortsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="channel-link"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M10 14.65v-5.3L15 12l-5 2.65zm7.77-4.33c-.77-.32-1.2-.5-1.2-.5L18 9.06c1.84-.96 2.53-3.23 1.56-5.06s-3.24-2.53-5.07-1.56L6 6.94c-1.29.68-2.07 2.04-2 3.49.07 1.42.93 2.67 2.22 3.25.03.01 1.2.5 1.2.5L6 14.93c-1.83.97-2.53 3.24-1.56 5.07.97 1.83 3.24 2.53 5.07 1.56l8.5-4.5c1.29-.68 2.06-2.04 1.99-3.49-.07-1.42-.94-2.68-2.23-3.25zm-.23 5.86l-8.5 4.5c-1.34.71-3.01.2-3.72-1.14-.71-1.34-.2-3.01 1.14-3.72l2.04-1.08v-1.21l-.69-.28-1.11-.46c-.99-.41-1.65-1.35-1.7-2.41-.05-1.06.52-2.06 1.46-2.56l8.5-4.5c1.34-.71 3.01-.2 3.72 1.14.71 1.34.2 3.01-1.14 3.72L15.5 9.26v1.21l1.8.74c.99.41 1.65 1.35 1.7 2.41.05 1.06-.52 2.06-1.46 2.56z"/>
                    </svg>
                    <span>Shorts</span>
                  </a>
                  <a 
                    href={channel.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="channel-link primary"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z"/>
                    </svg>
                    <span>Visit Channel</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="youtube-stats">
          <div className="stat-item">
            <div className="stat-icon">🎬</div>
            <div className="stat-info">
              <span className="stat-value">2</span>
              <span className="stat-label">Channels</span>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">📹</div>
            <div className="stat-info">
              <span className="stat-value">Daily</span>
              <span className="stat-label">Content</span>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">💻</div>
            <div className="stat-info">
              <span className="stat-value">Tech</span>
              <span className="stat-label">& Lifestyle</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default YouTube;
