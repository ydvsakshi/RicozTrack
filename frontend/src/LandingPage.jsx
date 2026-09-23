import "./LandingPage.css";

function LandingPage({ onLogin }) {
  return (
    <div className="landing-page">

      {/* Navbar */}
      <nav className="landing-navbar">
        <div className="landing-logo">
          Ricoz<span>Track</span>
        </div>

        <div className="landing-nav-links">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#about">About</a>

          <button className="nav-login-btn" onClick={onLogin}>
            Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="landing-hero" id="home">

        <div className="hero-content">

          <div className="hero-badge">
            PROJECT MANAGEMENT PLATFORM
          </div>

          <h1>
            Manage Your Projects
            <br />
            <span>Smarter & Simpler</span>
          </h1>

          <p>
            RicozTrack helps teams plan projects, manage tasks,
            track resources, monitor risks, and keep everything
            organized in one place.
          </p>

          <div className="hero-buttons">
            <button className="primary-btn" onClick={onLogin}>
              Get Started →
            </button>

            <a href="#features" className="secondary-btn">
              Explore Features
            </a>
          </div>

          <div className="hero-points">
            <span>✓ Project Management</span>
            <span>✓ Task Tracking</span>
            <span>✓ Risk Management</span>
          </div>

        </div>

        {/* Dashboard Preview */}
        <div className="dashboard-preview">

          <div className="preview-header">
            <div>
              <small>RicozTrack</small>
              <h3>Project Dashboard</h3>
            </div>

            <div className="preview-status">
              ● Active
            </div>
          </div>

          <div className="preview-cards">

            <div className="preview-card">
              <small>Total Projects</small>
              <strong>12</strong>
              <span>+3 this month</span>
            </div>

            <div className="preview-card">
              <small>Tasks</small>
              <strong>48</strong>
              <span>32 completed</span>
            </div>

            <div className="preview-card">
              <small>Resources</small>
              <strong>24</strong>
              <span>Currently active</span>
            </div>

          </div>

          <div className="progress-section">
            <div className="progress-title">
              <span>Website Development</span>
              <strong>65%</strong>
            </div>

            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>
          </div>

          <div className="preview-bottom">

            <div className="mini-box">
              <small>Tasks</small>
              <p>18 Active</p>
            </div>

            <div className="mini-box warning">
              <small>Risks</small>
              <p>3 Open</p>
            </div>

            <div className="mini-box">
              <small>Resources</small>
              <p>85% Used</p>
            </div>

          </div>

        </div>

      </section>

      {/* Features */}
      <section className="features-section" id="features">

        <div className="section-heading">
          <span>FEATURES</span>
          <h2>Everything You Need to Manage Projects</h2>
          <p>
            Keep your project information organized and accessible
            from one simple platform.
          </p>
        </div>

        <div className="features-grid">

          <div className="feature-card">
            <div className="feature-icon">01</div>
            <h3>Project Management</h3>
            <p>
              Create and manage projects while tracking their
              progress, status, deadlines and team members.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">02</div>
            <h3>Task Management</h3>
            <p>
              Organize tasks, monitor their status and keep
              project activities on track.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">03</div>
            <h3>Resource Management</h3>
            <p>
              Keep track of project resources and their current
              availability and usage.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">04</div>
            <h3>Risk Management</h3>
            <p>
              Identify project risks and monitor them to help
              teams stay prepared.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">05</div>
            <h3>Dependencies</h3>
            <p>
              Track relationships between tasks and projects
              to understand project dependencies.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">06</div>
            <h3>Reports</h3>
            <p>
              View important project information and progress
              through a centralized reporting section.
            </p>
          </div>

        </div>

      </section>

      {/* About */}
      <section className="about-section" id="about">

        <div className="about-content">

          <span>ABOUT RICOZTRACK</span>

          <h2>
            One Platform for Your
            <br />
            <strong>Entire Project Lifecycle</strong>
          </h2>

          <p>
            RicozTrack brings project planning, task management,
            resources, risks and dependencies together into a
            single workspace.
          </p>

          <button className="primary-btn" onClick={onLogin}>
            Access Dashboard →
          </button>

        </div>

      </section>

      {/* Final CTA */}
      <section className="cta-section">

        <h2>Ready to manage your projects better?</h2>

        <p>
          Start using RicozTrack and keep your project work
          organized in one place.
        </p>

        <button className="primary-btn" onClick={onLogin}>
          Get Started →
        </button>

      </section>

      {/* Footer */}
      <footer className="landing-footer">

        <div className="landing-logo">
          Ricoz<span>Track</span>
        </div>

        <p>
          Project management made simple.
        </p>

        <span>
          © 2026 RicozTrack. All rights reserved.
        </span>

      </footer>

    </div>
  );
}

export default LandingPage;