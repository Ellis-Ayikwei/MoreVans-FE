// In your React component
import { LoadScript } from '@react-google-maps/api';

const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY as string;

const App = () => (
    <LoadScript
        googleMapsApiKey={API_KEY}
        libraries={['places']} // Optional
    >
        {/* Your map components */}
    </LoadScript>
);
