import YouTube from '../components/YouTube';
import SEO from '../components/SEO';
import './YouTubePage.css';

function YouTubePage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "YouTube Channels - Muhammad Kamal",
    "description": "Tech content, coding tutorials, career advice, and lifestyle vlogs by Muhammad Kamal",
    "author": {
      "@type": "Person",
      "name": "Muhammad Kamal"
    }
  };

  return (
    <div className="youtube-page">
      <SEO
        title="YouTube Channels - Muhammad Kamal | Tech Content & Coding Tutorials"
        description="Discover my YouTube channels featuring tech insights, coding tutorials, career advice, and lifestyle content. Subscribe to @oykamal and @kamalkecoding for daily updates."
        name="Muhammad Kamal"
        url="https://oykamal.netlify.app/youtube"
        structuredData={structuredData}
      />
      <YouTube />
    </div>
  );
}

export default YouTubePage;
