import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getBlogsData } from '../services/dataService';
import './Blog.css';

function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    getBlogsData()
      .then(data => {
        setBlogs(data.blogs || []);
        setCategories(data.categories || []);
      })
      .catch(error => console.error('Error loading blog data:', error));
  }, []);

  const filteredBlogs = blogs.filter(blog => {
    if (selectedCategory !== 'all' && blog.category !== selectedCategory) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const titleMatch = blog.title?.toLowerCase().includes(term);
      const descMatch = blog.description?.toLowerCase().includes(term);
      const tagMatch = blog.tags?.some(tag => tag.toLowerCase().includes(term));
      if (!titleMatch && !descMatch && !tagMatch) return false;
    }
    return true;
  });

  const featuredBlogs = blogs.filter(blog => blog.featured);

  return (
    <>
      <Helmet>
        <title>Blog | Muhammad Kamal - Backend Engineering & Tech Insights</title>
        <meta name="description" content="Technical blog featuring insights on Django, Python, PostgreSQL, AWS, system design, and backend engineering best practices from production experience." />
        <meta name="keywords" content="backend engineering blog, django tutorials, python development, postgresql optimization, aws devops, system design, tech blog" />
        <link rel="canonical" href="https://oykamal.netlify.app/blog" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Blog | Muhammad Kamal - Backend Engineering Insights" />
        <meta property="og:description" content="Technical articles on Django, Python, PostgreSQL, system design, and production engineering." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://oykamal.netlify.app/blog" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Blog | Muhammad Kamal - Backend Engineering" />
        <meta name="twitter:description" content="Technical insights on Django, Python, PostgreSQL, and system design from production experience." />
      </Helmet>

      <section id="blog" className="blog-section">
        <div className="container">
          {/* Header */}
          <div className="blog-header">
            <h1 className="section-title">Technical Blog</h1>
            <p className="section-subtitle">
              Insights on backend engineering, system design, and production best practices
            </p>
          </div>

          {/* Featured Posts */}
          {featuredBlogs.length > 0 && (
            <div className="featured-section">
              <h2 className="featured-title">Featured Posts</h2>
              <div className="featured-grid">
                {featuredBlogs.map(blog => (
                  <article key={blog.id} className="featured-card">
                    <div className="featured-image">
                      <img src={blog.image} alt={blog.title} loading="lazy" />
                      <span className="featured-badge">Featured</span>
                    </div>
                    <div className="featured-content">
                      <div className="blog-meta">
                        <span className="category">{blog.category}</span>
                        <span className="read-time">{blog.readTime}</span>
                      </div>
                      <h3>{blog.title}</h3>
                      <p className="excerpt">{blog.excerpt}</p>
                      <div className="blog-tags">
                        {blog.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="tag">#{tag}</span>
                        ))}
                      </div>
                      <div className="blog-footer">
                        <span className="date">{new Date(blog.publishDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        <Link to={`/blog/${blog.slug}`} className="read-more">
                          Read More →
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* Filters and Search */}
          <div className="blog-controls">
            <div className="search-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="category-filters">
              <button
                className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('all')}
              >
                All Posts
              </button>
              {categories.map(category => (
                <button
                  key={category.slug}
                  className={`filter-btn ${selectedCategory === category.name ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category.name)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Blog Grid */}
          <div className="blog-grid">
            {filteredBlogs.length > 0 ? (
              filteredBlogs.map(blog => (
                <article key={blog.id} className="blog-card" itemScope itemType="https://schema.org/BlogPosting">
                  <meta itemProp="datePublished" content={blog.publishDate} />
                  <meta itemProp="dateModified" content={blog.lastModified} />
                  
                  <div className="blog-image">
                    <img src={blog.image} alt={blog.title} itemProp="image" loading="lazy" />
                  </div>
                  
                  <div className="blog-content">
                    <div className="blog-meta">
                      <span className="category" itemProp="articleSection">{blog.category}</span>
                      <span className="read-time">{blog.readTime}</span>
                    </div>
                    
                    <h3 itemProp="headline">{blog.title}</h3>
                    <p className="description" itemProp="description">{blog.description}</p>
                    
                    <div className="blog-tags">
                      {blog.tags.slice(0, 4).map((tag, index) => (
                        <span key={index} className="tag" itemProp="keywords">#{tag}</span>
                      ))}
                    </div>
                    
                    <div className="blog-footer">
                      <div className="author-date">
                        <span className="author" itemProp="author">{blog.author}</span>
                        <span className="date">
                          {new Date(blog.publishDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <Link to={`/blog/${blog.slug}`} className="read-more" itemProp="url">
                        Read Article →
                      </Link>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="no-results">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
                <h3>No articles found</h3>
                <p>Try adjusting your search or filter to find what you're looking for.</p>
              </div>
            )}
          </div>

          {/* Newsletter Signup */}
          <div className="newsletter-section">
            <div className="newsletter-content">
              <h3>📬 Subscribe to the Newsletter</h3>
              <p>Get the latest articles on backend engineering, system design, and tech insights delivered to your inbox.</p>
              <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                <input type="email" placeholder="Enter your email" required />
                <button type="submit">Subscribe</button>
              </form>
              <p className="newsletter-note">No spam. Unsubscribe anytime.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Blog;
