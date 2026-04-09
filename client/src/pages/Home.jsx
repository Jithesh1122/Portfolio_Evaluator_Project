import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar.jsx';

function Home() {
  const [userOne, setUserOne] = useState('');
  const [userTwo, setUserTwo] = useState('');
  const navigate = useNavigate();

  const handleCompareSubmit = (event) => {
    event.preventDefault();

    if (!userOne.trim() || !userTwo.trim()) {
      return;
    }

    navigate(`/compare?u1=${userOne.trim()}&u2=${userTwo.trim()}`);
  };

  return (
    <main className="app-shell page">
      <div className="page__container">
        <section className="hero-panel home-hero fade-in">
          <div className="home-hero__content">
            <p className="hero-panel__eyebrow">Developer Portfolio Evaluator</p>
            <h1 className="hero-panel__title">
              Turn GitHub work into an <em>interview-ready</em> story.
            </h1>
            <p className="hero-panel__text">
              Search any public GitHub profile, unpack a detailed score breakdown, inspect
              charts and repository highlights, then share a polished report in seconds.
            </p>
            <div className="home-hero__chips" aria-label="Key features">
              <span className="home-hero__chip">Score breakdowns</span>
              <span className="home-hero__chip">Radar + heat map</span>
              <span className="home-hero__chip">Shareable reports</span>
            </div>
            <SearchBar />
          </div>
          <div className="home-hero__visual" aria-hidden="true">
            <div className="home-hero__pattern home-hero__pattern--mesh" />
            <div className="home-hero__pattern home-hero__pattern--dots" />
            <div className="home-hero__visual-frame">
              <div className="home-hero__window-bar">
                <span className="home-hero__window-dot" />
                <span className="home-hero__window-dot" />
                <span className="home-hero__window-dot" />
              </div>
              <div className="home-hero__mascot-scene">
                <div className="home-hero__git-bubble home-hero__git-bubble--top-left">
                  <span>git commit</span>
                </div>
                <div className="home-hero__git-bubble home-hero__git-bubble--top-right">
                  <span>git push</span>
                </div>
                <div className="home-hero__git-bubble home-hero__git-bubble--bottom-left">
                  <span>git pull</span>
                </div>
                <div className="home-hero__mascot">
                  <div className="home-hero__mascot-ear home-hero__mascot-ear--left" />
                  <div className="home-hero__mascot-ear home-hero__mascot-ear--right" />
                  <div className="home-hero__mascot-head">
                    <span className="home-hero__mascot-eye home-hero__mascot-eye--left" />
                    <span className="home-hero__mascot-eye home-hero__mascot-eye--right" />
                    <span className="home-hero__mascot-nose" />
                    <span className="home-hero__mascot-blush home-hero__mascot-blush--left" />
                    <span className="home-hero__mascot-blush home-hero__mascot-blush--right" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="feature-strip">
            <div className="feature-pill">
              <strong>Live Profile Reports</strong>
              <span className="muted">Scores, charts, caching, and share links.</span>
            </div>
            <div className="feature-pill">
              <strong>Visual Evaluation</strong>
              <span className="muted">Radar, heat map, languages, and top repos.</span>
            </div>
            <div className="feature-pill">
              <strong>Fast Compare Mode</strong>
              <span className="muted">Put two developers side by side instantly.</span>
            </div>
          </div>
        </section>

        <section className="hero-panel compare-panel fade-in stagger-1">
          <div className="compare-panel__header">
            <div>
              <p className="hero-panel__eyebrow">Bonus Compare Mode</p>
              <h2 className="section-title compare-panel__title">
                Compare two profiles <em>side by side</em>
              </h2>
            </div>
            <p className="hero-panel__text compare-panel__text">
              Use this when you want a side-by-side comparison after exploring a single report.
            </p>
          </div>
          <form onSubmit={handleCompareSubmit} className="compare-form compare-panel__form">
            <div className="compare-form__grid">
              <input
                className="input"
                type="text"
                value={userOne}
                onChange={(event) => setUserOne(event.target.value)}
                placeholder="First username"
              />
              <input
                className="input"
                type="text"
                value={userTwo}
                onChange={(event) => setUserTwo(event.target.value)}
                placeholder="Second username"
              />
              <button
                type="submit"
                className="button-ghost compare-form__button compare-panel__button"
              >
                Compare Profiles
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

export default Home;
