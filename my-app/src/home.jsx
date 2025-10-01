import React from 'react'

const home = () => {
    const handleTestNotification = async () => {
  const reg = await navigator.serviceWorker.ready;
  reg.showNotification("Test Notification", {
    body: "This is a manual test",
    icon: "/icons/icon-192x192.png",
  });
};
  <button onClick={handleTestNotification}>Test Notification</button>
 
  return (
    
       <div className="container-fluid p-0">
      {/* Hero Section */}
      <section className="bg-primary text-white text-center vh-100 d-flex flex-column justify-content-center align-items-center">
        <h1 className="display-3 fw-bold">Welcome to Sunshine School</h1>
        <p className="lead mb-4">Nurturing Young Minds for a Brighter Future</p>
        <a href="#about" className="btn btn-light btn-lg">Learn More</a>
      </section>

      {/* About Section */}
      <section id="about" className="py-5 bg-light text-center">
        <div className="container">
          <h2 className="mb-4">About Our School</h2>
          <p className="mb-4">
            Sunshine School is committed to providing high-quality education and
            fostering creativity, curiosity, and confidence in every student.
            Our experienced teachers guide students to excel academically and
            grow personally.
          </p>
          <a href="#contact" className="btn btn-primary">Contact Us</a>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-5 text-center">
        <div className="container">
          <h2 className="mb-4">Quick Links</h2>
          <div className="row">
            <div className="col-md-4 mb-3">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Students</h5>
                  <p className="card-text">Access resources, timetable, and assignments.</p>
                  <a href="/students" className="btn btn-primary">Explore</a>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Teachers</h5>
                  <p className="card-text">Manage classes, attendance, and student progress.</p>
                  <a href="/teachers" className="btn btn-primary">Explore</a>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Events</h5>
                  <p className="card-text">Check upcoming events, competitions, and activities.</p>
                  <a href="/events" className="btn btn-primary">Explore</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3">
        &copy; 2025 Sunshine School. All rights reserved.
      </footer>
    
    </div>
  )
}

export default home
