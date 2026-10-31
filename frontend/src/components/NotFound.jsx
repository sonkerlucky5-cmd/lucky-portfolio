import { ArrowLeft, Home, ShieldAlert } from "lucide-react";

const NotFound = ({ onGoHome }) => {
  return (
    <div className="not-found-page">
      <div className="not-found-card">
        <div className="not-found-badge">
          <ShieldAlert size={28} />
        </div>
        <h1 className="not-found-code">404</h1>
        <h2>Page Not Found</h2>
        <p>
          The page or route you are looking for does not exist, has been moved, or is restricted.
        </p>
        <div className="not-found-actions">
          <button
            type="button"
            className="btn btn-primary not-found-btn"
            onClick={onGoHome}
          >
            <Home size={16} /> Return to Portfolio
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

