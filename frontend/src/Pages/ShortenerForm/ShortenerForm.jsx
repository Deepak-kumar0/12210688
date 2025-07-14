import { useState } from "react";
import './ShortenerForm.css';
import { MAX_URLS } from "../../utils/constants";
import isValidUrl from "../../utils/isValidUrl";
import isValidValidityPeriod from "../../utils/isValidValidityPeriod";
import isValidShortcode from "../../utils/isValidShortCode";
import shortenUrl from "../../utils/shortenUrl";
import ShortenedResults from "../ShortenedResult/ShortenedResult";

function ShortenerForm() {
  const [urlInputs, setUrlInputs] = useState([
    { id: 1, longUrl: '', validity: '', shortcode: '' }
  ]);
  const [formErrors, setFormErrors] = useState({});
  const [shortResults, setShortResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mainError, setMainError] = useState(null);

  function handleInputChange(id, field, value) {
    let updatedInputs = [];
    for (let i = 0; i < urlInputs.length; i++) {
      if (urlInputs[i].id === id) {
        let newObj = { ...urlInputs[i] };
        newObj[field] = value;
        updatedInputs.push(newObj);
      } else {
        updatedInputs.push(urlInputs[i]);
      }
    }
    setUrlInputs(updatedInputs);

    if (formErrors[id] && formErrors[id][field]) {
      let copyErrors = { ...formErrors };
      delete copyErrors[id][field];
      if (Object.keys(copyErrors[id]).length === 0) {
        delete copyErrors[id];
      }
      setFormErrors(copyErrors);
    }
  }

  function addMoreUrlInput() {
    if (urlInputs.length < MAX_URLS) {
      let newId = Date.now();
      setUrlInputs([...urlInputs, { id: newId, longUrl: '', validity: '', shortcode: '' }]);
    }
  }

  function removeUrlInput(id) {
    if (urlInputs.length > 1) {
      let filtered = [];
      for (let i = 0; i < urlInputs.length; i++) {
        if (urlInputs[i].id !== id) {
          filtered.push(urlInputs[i]);
        }
      }
      setUrlInputs(filtered);

      let copyErrors = { ...formErrors };
      delete copyErrors[id];
      setFormErrors(copyErrors);
    }
  }

  function validateForm() {
    let errorsObj = {};
    let isFormOk = true;
    for (let i = 0; i < urlInputs.length; i++) {
      let url = urlInputs[i];
      let errorsForThis = {};

      if (!isValidUrl(url.longUrl)) {
        errorsForThis.longUrl = "Invalid URL format.";
        isFormOk = false;
      }
      if (!isValidValidityPeriod(url.validity)) {
        errorsForThis.validity = "Validity must be a positive integer (minutes).";
        isFormOk = false;
      }
      if (!isValidShortcode(url.shortcode)) {
        errorsForThis.shortcode = "Invalid shortcode (alphanumeric, 4-15 chars).";
        isFormOk = false;
      }
      if (Object.keys(errorsForThis).length > 0) {
        errorsObj[url.id] = errorsForThis;
      }
    }
    setFormErrors(errorsObj);
    return isFormOk;
  }

  function handleSubmit(e) {
    e.preventDefault();
    setShortResults([]);
    setMainError(null);

    if (!validateForm()) {
      setMainError("Please fix the validation errors.");
      return;
    }

    setIsLoading(true);
    let newResults = [];
    let errorList = [];

    for (let i = 0; i < urlInputs.length; i++) {
      let url = urlInputs[i];
      let result = shortenUrl(
        url.longUrl,
        url.validity ? parseInt(url.validity, 10) : null,
        url.shortcode || null
      );
      if (result.success) {
        newResults.push(result.data);
      } else {
        errorList.push({
          originalUrl: url.longUrl,
          error: result.error || "Failed to shorten URL"
        });
      }
    }

    setShortResults(newResults);
    setIsLoading(false);

    if (errorList.length > 0) {
      let msg = "Some URLs could not be shortened. Details: ";
      for (let i = 0; i < errorList.length; i++) {
        msg += errorList[i].error;
        if (i !== errorList.length - 1) msg += ", ";
      }
      setMainError(msg);
    }

    if (newResults.length > 0) {
      setUrlInputs([{ id: Date.now(), longUrl: '', validity: '', shortcode: '' }]);
    }
  }

  return (
    <div className="my-form-box">
      <h1 className="my-title">URL Shortener</h1>
      <div className="my-form-card">
        <h2 className="my-form-subtitle">Shorten URLs (Up to {MAX_URLS})</h2>
        <form onSubmit={handleSubmit}>
          {urlInputs.map((input, idx) => (
            <div key={input.id} className="my-url-group">
              <div className="my-inputs-grid">
                <div className="my-full-row">
                  <label htmlFor={`longUrl-${input.id}`}>Original URL #{idx + 1}</label>
                  <input
                    type="text"
                    id={`longUrl-${input.id}`}
                    className={`my-text-input ${formErrors[input.id] && formErrors[input.id].longUrl ? 'my-input-error' : ''}`}
                    value={input.longUrl}
                    onChange={e => handleInputChange(input.id, 'longUrl', e.target.value)}
                    required
                    disabled={isLoading}
                    placeholder="https://www.example.com/long/path"
                  />
                  {formErrors[input.id] && formErrors[input.id].longUrl && (
                    <p className="my-error-msg">{formErrors[input.id].longUrl}</p>
                  )}
                </div>
                <div>
                  <label htmlFor={`validity-${input.id}`}>Validity (minutes, optional)</label>
                  <input
                    type="number"
                    id={`validity-${input.id}`}
                    className={`my-text-input ${formErrors[input.id] && formErrors[input.id].validity ? 'my-input-error' : ''}`}
                    value={input.validity}
                    onChange={e => handleInputChange(input.id, 'validity', e.target.value)}
                    disabled={isLoading}
                    placeholder="60"
                  />
                  {formErrors[input.id] && formErrors[input.id].validity ? (
                    <p className="my-error-msg">{formErrors[input.id].validity}</p>
                  ) : (
                    <p className="my-helper-msg">Default: 30 minutes</p>
                  )}
                </div>
                <div>
                  <label htmlFor={`shortcode-${input.id}`}>Custom Shortcode (optional)</label>
                  <input
                    type="text"
                    id={`shortcode-${input.id}`}
                    className={`my-text-input ${formErrors[input.id] && formErrors[input.id].shortcode ? 'my-input-error' : ''}`}
                    value={input.shortcode}
                    onChange={e => handleInputChange(input.id, 'shortcode', e.target.value)}
                    disabled={isLoading}
                    placeholder="like mylink123"
                  />
                  {formErrors[input.id] && formErrors[input.id].shortcode ? (
                    <p className="my-error-msg">{formErrors[input.id].shortcode}</p>
                  ) : (
                    <p className="my-helper-msg">Alphanumeric, 4-15 chars</p>
                  )}
                </div>
              </div>
              {urlInputs.length > 1 && (
                <div className="my-remove-btn-row">
                  <button
                    type="button"
                    onClick={() => removeUrlInput(input.id)}
                    disabled={isLoading}
                    className="my-remove-btn"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          ))}
          <div className="my-form-actions">
            <button
              type="button"
              onClick={addMoreUrlInput}
              disabled={urlInputs.length >= MAX_URLS || isLoading}
              className="my-add-btn"
            >
              + Add URL
            </button>
            <button
              type="submit"
              className="my-submit-btn"
              disabled={isLoading}
            >
              {isLoading ? "Shortening..." : "Shorten URLs"}
            </button>
          </div>
        </form>
        {mainError && (
          <div className="my-error-alert">
            <b>Error!</b>
            <span> {mainError}</span>
          </div>
        )}
      </div>
      {shortResults.length > 0 && (
        <ShortenedResults results={shortResults} />
      )}
    </div>
  );
}

export default ShortenerForm;
