import React from "react";
import './ShortenedResult.css';

export default function ShortenedResults ({ results }) {
  return (
    <div className="results-container">
      <h2>Shortening Results</h2>
      
      <ul>
        {results.map((result, index) => (
          <React.Fragment key={index}>
            <li className="result-item">
              <div className="result-content">
                <div className="result-original-url">
                  <p className="bold-text">Original URL:</p>
                  <p className="break-all">{result.originalUrl}</p>
                </div>
                <div className="result-shortened-link">
                  <h3>Shortened Link:</h3>
                  <a 
                    href={`${window.location.origin}/s/${result.shortcode}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="short-link break-all"
                  >
                    {window.location.origin}/s/{result.shortcode}
                  </a>
                  <p className="expiry-text">
                    Expires: {(new Date(result.expiresAt)).toLocaleTimeString()} 
                  </p>
                </div>
              </div>
            </li>

            </React.Fragment>
        ))}
      </ul>
    </div>
  );
};