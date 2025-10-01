import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Offline fallback data
  const offlineData = [
    {
      _id: 1,
      name: "Offline One",
      email: "offline1@test.com",
      address: "Street 1",
      mobile: "1234567890",
      image: null,
      location: "27.995928623191045,73.30154210297587",
    },
    {
      _id: 2,
      name: "Offline Two",
      email: "offline2@test.com",
      address: "Street 2",
      mobile: "0987654321",
      image: null,
      location: "28.7041,77.1025",
    },
  ];

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/users");
      const data = await response.json();

      if (data.success && Array.isArray(data.data)) {
        // Ensure every user has a location field
        const normalizedData = data.data.map((user) => ({
          ...user,
          location: user.location || user.latlon || null,
        }));

        setUsers(normalizedData);
        localStorage.setItem("users", JSON.stringify(normalizedData));
      } else {
        throw new Error("No data returned from server");
      }
    } catch (error) {
      console.warn("Offline or API error: showing cached or dummy data");
      const cached = localStorage.getItem("users");
      if (cached) setUsers(JSON.parse(cached));
      else setUsers(offlineData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <p>Loading users...</p>;

  return (
    <div>
      <h2>User List</h2>
      {users.length === 0 ? (
        <p>
          No data available.{" "}
          <Button variant="primary" onClick={fetchUsers}>
            Retry
          </Button>
        </p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Photo</th>
              <th>Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Mobile</th>
              {/* <th>Location (lat, lon)</th> */}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  ) : (
                    "No Photo"
                  )}
                </td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.address}</td>
                <td>{user.mobile}</td>
                {/* <td>{user.latlon || "No location"}</td>  */}
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default Users;
