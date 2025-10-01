import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
const about = () => {
  return (
    
     <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow-lg w-75 h-75">
        <div className="card-body overflow-auto">
          <h1 className="card-title mb-4">About Us</h1>
          <p className="card-text mb-4">
            Welcome to our website! We are passionate about creating solutions that
            make life easier. Our team is dedicated to building innovative products
            that bring value to our users.
          </p>
          <h2 className="h4 mb-2">Our Mission</h2>
          <p className="card-text mb-4">
            To provide high-quality, user-friendly applications that solve real-world
            problems efficiently and effectively.
          </p>
          <h2 className="h4 mb-2">Our Team</h2>
          <p className="card-text">
            We are a group of talented developers, designers, and thinkers working
            together to bring our vision to life.
          </p>
        </div>
      </div>
    </div>
  )
}

export default about
