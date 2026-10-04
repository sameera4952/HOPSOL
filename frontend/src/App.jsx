import './style.css';
import './App.css';
import bookingImage from './assets/booking.jpg';

function App() {
  const handlePatientClick = () => {
  window.location.href = '/patient.html';
};

  const handleDoctorClick = () => {
    console.log('Doctor button clicked');
  };

  return (
    <div
      className="hero-page"
      style={{ backgroundImage: `url(${bookingImage})` }}
    >
      <div className="top-right-brand">hopsol</div>

      <div className="hero">
        <h1>APPOINTMENT BOOKING</h1>

        <div className="btn-group">
          <button id="patientBtn" onClick={handlePatientClick}>
            Patient
          </button>

          <button
            id="doctorBtn"
            className="secondary"
            onClick={handleDoctorClick}
          >
            Doctor
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;