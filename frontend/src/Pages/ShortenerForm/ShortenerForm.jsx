import { useState } from "react";
import './ShortenerForm.css';
import { MAX_URLS } from "../../utils/constants";
import isValidUrl from "../../utils/isValidUrl";
import isValidValidityPeriod from "../../utils/isValidValidityPeriod";
import isValidShortcode from "../../utils/isValidShortCode";
import shortenUrl from "../../utils/shortenUrl";
import ShortenedResults from "../ShortenedResult/ShortenedResult";



export default function ShortenerForm() {
  const [urlsToShorten, setUrlsToShorten] = useState([{ id: 1, longUrl: '', validity: '', shortcode: '' }]);
  const [errors, setErrors] = useState({});
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);

  const handleChange = (id, field, value) => {
    const updatedUrls = urlsToShorten.map(url =>
      url.id === id ? { ...url, [field]: value } : url
    );
    setUrlsToShorten(updatedUrls);
    if (errors[id] && errors[id][field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[id][field];
        if (Object.keys(newErrors[id]).length === 0) {
          delete newErrors[id];
        }
        return newErrors;
      });
    }
  };

  const addUrlInput = () => {
    if (urlsToShorten.length < MAX_URLS) {
      setUrlsToShorten([...urlsToShorten, { id: Date.now(), longUrl: '', validity: '', shortcode: '' }]);
    }
  };

  const removeUrlInput = (id) => {
    if (urlsToShorten.length > 1) {
      setUrlsToShorten(urlsToShorten.filter(url => url.id !== id));
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let formIsValid = true;

    urlsToShorten.forEach(url => {
      const entryErrors = {};

      if (!isValidUrl(url.longUrl)) {
        entryErrors.longUrl = 'Invalid URL format.';
        formIsValid = false;
      }
      
      if (!isValidValidityPeriod(url.validity)) {
        entryErrors.validity = 'Validity must be a positive integer (minutes).';
        formIsValid = false;
      }

      if (!isValidShortcode(url.shortcode)) {
        entryErrors.shortcode = 'Invalid shortcode (alphanumeric, 4-15 chars).';
        formIsValid = false;
      }

      if (Object.keys(entryErrors).length > 0) {
        newErrors[url.id] = entryErrors;
      }
    });

    setErrors(newErrors);
    return formIsValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setResults([]);
    setSubmissionError(null);

    if (!validateForm()) {
      setSubmissionError('Please fix the validation errors.');
      return;
    }

    setLoading(true);
    const newResults = [];
    const errorsDuringProcessing = [];

    urlsToShorten.forEach(url => {
      const response = shortenUrl(
        url.longUrl, 
        url.validity ? parseInt(url.validity, 10) : null, 
        url.shortcode || null
      );

      if (response.success) {
        newResults.push(response.data);
      } else {
        errorsDuringProcessing.push({ 
          originalUrl: url.longUrl, 
          error: response.error || 'Failed to shorten URL' 
        });
      }
    });

    setResults(newResults);
    setLoading(false);

    if (errorsDuringProcessing.length > 0) {
      setSubmissionError(`Some URLs could not be shortened. Details: ${errorsDuringProcessing.map(e => e.error).join(', ')}`);
    }

    if (newResults.length > 0) {
      setUrlsToShorten([{ id: Date.now(), longUrl: '', validity: '', shortcode: '' }]);
    }
  };

  return (
    <div className="form-container">
      <h1>URL Shortener</h1>
      
      <div className="form-card">
        <h2>Shorten URLs (Up to {MAX_URLS} concurrently)</h2>

        <form onSubmit={handleSubmit}>
          {urlsToShorten.map((urlEntry, index) => (
            <div key={urlEntry.id} className="url-input-group">
              <div className="input-grid">
                <div className="full-width-input">
                  <label htmlFor={`longUrl-${urlEntry.id}`}>
                    Original URL #{index + 1}
                  </label>
                  <input
                    type="text"
                    id={`longUrl-${urlEntry.id}`}
                    className={`text-input ${
                      errors[urlEntry.id] && errors[urlEntry.id].longUrl ? 'input-error' : ''
                    }`}
                    value={urlEntry.longUrl}
                    onChange={(e) => handleChange(urlEntry.id, 'longUrl', e.target.value)}
                    required
                    disabled={loading}
                    placeholder="e.g., https://www.example.com/very/long/path"
                  />
                  {errors[urlEntry.id] && errors[urlEntry.id].longUrl && (
                    <p className="error-message">{errors[urlEntry.id].longUrl}</p>
                  )}
                </div>
                <div>
                  <label htmlFor={`validity-${urlEntry.id}`}>
                    Validity (minutes, optional)
                  </label>
                  <input
                    type="number"
                    id={`validity-${urlEntry.id}`}
                    className={`text-input ${
                      errors[urlEntry.id] && errors[urlEntry.id].validity ? 'input-error' : ''
                    }`}
                    value={urlEntry.validity}
                    onChange={(e) => handleChange(urlEntry.id, 'validity', e.target.value)}
                    disabled={loading}
                    placeholder="e.g., 60"
                  />
                  {errors[urlEntry.id] && errors[urlEntry.id].validity ? (
                    <p className="error-message">{errors[urlEntry.id].validity}</p>
                  ) : (
                    <p className="helper-text">Default: 30 minutes</p>
                  )}
                </div>
                <div>
                  <label htmlFor={`shortcode-${urlEntry.id}`}>
                    Custom Shortcode (optional)
                  </label>
                  <input
                    type="text"
                    id={`shortcode-${urlEntry.id}`}
                    className={`text-input ${
                      errors[urlEntry.id] && errors[urlEntry.id].shortcode ? 'input-error' : ''
                    }`}
                    value={urlEntry.shortcode}
                    onChange={(e) => handleChange(urlEntry.id, 'shortcode', e.target.value)}
                    disabled={loading}
                    placeholder="e.g., mylink123"
                  />
                  {errors[urlEntry.id] && errors[urlEntry.id].shortcode ? (
                    <p className="error-message">{errors[urlEntry.id].shortcode}</p>
                  ) : (
                    <p className="helper-text">Alphanumeric, 4-15 chars</p>
                  )}
                </div>
              </div>
              {urlsToShorten.length > 1 && (
                <div className="remove-button-container">
                  <button 
                    type="button" 
                    onClick={() => removeUrlInput(urlEntry.id)} 
                    disabled={loading}
                    className="remove-button"
                  >
                    Remove URL
                  </button>
                </div>
              )}
            </div>
          ))}

          <div className="form-actions">
            <button 
              type="button" 
              onClick={addUrlInput} 
              disabled={urlsToShorten.length >= MAX_URLS || loading}
              className="add-url-button"
            >
              <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
              Add URL
            </button>
            <button 
              type="submit" 
              className="submit-button"
              disabled={loading}
            >
              {loading ? 'Shortening...' : 'Shorten URLs'}
            </button>
          </div>
        </form>

        {submissionError && (
          <div className="alert-error" role="alert">
            <strong>Error!</strong>
            <span> {submissionError}</span>
          </div>
        )}
      </div>

      {results.length > 0 && (
        <ShortenedResults results={results} />
      )}
    </div>
  );
};
