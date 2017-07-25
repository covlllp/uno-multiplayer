import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => (
  <div>
    <div>
      <Link to="/player">
        Player
      </Link>
    </div>
    <div>
      <Link to="/board">
        Board
      </Link>
    </div>
  </div>
);

export default LandingPage;
