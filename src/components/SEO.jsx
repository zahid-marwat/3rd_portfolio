import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';

const SEO = ({ 
  title, 
  description, 
  type = 'website',
  url = 'https://github.com/zahid-marwat',
  image = '/assets/profile-picture.png',
  keywords = 'Zahid Marwat, Computer Vision, AI Specialist, PyTorch, TensorFlow, OpenCV, FastAPI, Python, Deep Learning',
  structuredData
}) => {
  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keywords' content={keywords} />
      
      {/* Open Graph tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      
      {/* Twitter tags */}
      <meta name="twitter:creator" content="@zahid89782667" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Structured Data (JSON-LD) */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

SEO.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  name: PropTypes.string,
  type: PropTypes.string,
  url: PropTypes.string,
  image: PropTypes.string,
  keywords: PropTypes.string,
  structuredData: PropTypes.object
};

export default SEO;
