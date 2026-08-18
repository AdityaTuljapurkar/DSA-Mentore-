  import { Link } from 'react-router-dom';

  export default function Homepage() {
    return (
      <>
        <h1>welcome to the home page</h1>
        <h2>
          if you want to check the connection status:{" "}
          <Link to="/check-django">link</Link>
        </h2>
      </>
    );
  }