import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import recordClickAndRedirect from "../../utils/redirect";
import  './ShortLinkRedirector.css';

export default function ShortLinkRedirector  () {
  const { shortcode } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading'); 
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!shortcode) {
      navigate('/');
      return;
    }

    const originalUrl = recordClickAndRedirect(shortcode);

    if (originalUrl) {
      setStatus('success');
      window.location.replace(originalUrl); 
    } else {
      setStatus('error');
      setErrorMsg('The short URL is invalid or expired.');
    }
  }, [shortcode, navigate]);

  return (
    <div className="redirector-container">
      {status === 'loading' && (
        <div className="redirector-loading">
          <div className="loading-spinner"></div>
          <p className="redirector-message">Redirecting...</p>
          <p className="redirector-shortcode">Looking up shortcode: {shortcode}</p>
        </div>
      )}
      {status === 'error' && (
        <div className="alert-error redirector-alert">
          <strong className="alert-title">Redirection Failed!</strong>
          <span className="alert-text"> {errorMsg}</span>
          <p className="redirector-link-text">Please check the short URL or return to the <a href="/" className="redirector-home-link">homepage</a>.</p>
        </div>
      )}
      {status === 'success' && (
        <p className="redirector-message">Redirecting to the original URL...</p>
      )}
    </div>
  );
};