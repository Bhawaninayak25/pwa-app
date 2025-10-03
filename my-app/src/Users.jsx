// import React, { useState, useEffect } from "react";
// import { Table, Button } from "react-bootstrap";

// const Users = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const offlineData = [
//     {
//       _id: 1,
//       name: "Offline One",
//       email: "offline1@test.com",
//       address: "Street 1",
//       mobile: "1234567890",
//       file: null,
//       fileType: null,
//       location: "27.995928623191045,73.30154210297587",
//     },
//     {
//       _id: 2,
//       name: "Offline Two",
//       email: "offline2@test.com",
//       address: "Street 2",
//       mobile: "0987654321",
//       file: null,
//       fileType: null,
//       location: "28.7041,77.1025",
//     },
//   ];

//   const fetchUsers = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch("http://localhost:5000/users");
//       const data = await response.json();

//       if (data.success && Array.isArray(data.data)) {
//         const normalizedData = data.data.map((user) => {
//           let file = user.image || user.pdf || null;
//           let fileType = null;

//           if (file) {
//             if (file.startsWith("data:")) {
//               fileType = file.split(";")[0].split(":")[1];
//             } else if (file.endsWith(".pdf")) {
//               fileType = "application/pdf";
//             } else {
//               fileType = "image/jpeg"; // fallback
//             }
//           }

//           return {
//             ...user,
//             file,
//             fileType,
//             location: user.location || user.latlon || null,
//           };
//         });

//         setUsers(normalizedData);
//         localStorage.setItem("users", JSON.stringify(normalizedData));
//       } else {
//         throw new Error("No data returned from server");
//       }
//     } catch (error) {
//       console.warn("Offline or API error: showing cached or dummy data");
//       const cached = localStorage.getItem("users");
//       if (cached) setUsers(JSON.parse(cached));
//       else setUsers(offlineData);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   // ✅ Download PDF function
//   const downloadResume = async (userId, userName) => {
//     try {
//       const response = await fetch(`http://localhost:5000/users/pdf/${userId}`);
//       if (!response.ok) throw new Error("Failed to fetch PDF");

//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);

//       const a = document.createElement("a");
//       a.href = url;
//       a.download = `${userName}_resume.pdf`;
//       document.body.appendChild(a);
//       a.click();
//       a.remove();
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error("Download failed:", error);
//     }
//   };

//   if (loading) return <p>Loading users...</p>;

//   return (
//     <div>
//       <h2>User List</h2>
//       {users.length === 0 ? (
//         <p>
//           No data available.{" "}
//           <Button variant="primary" onClick={fetchUsers}>
//             Retry
//           </Button>
//         </p>
//       ) : (
//         <Table striped bordered hover>
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>Photos</th>
//               <th>Name</th>
//               <th>Email</th>
//               <th>Address</th>
//               <th>Mobile</th>
//               <th>Resume</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map((user) => (
//               <tr key={user._id}>
//                 <td>{user._id}</td>
//                 <td>
//                   {user.fileType?.startsWith("image/") ? (
//                     <img
//                       src={user.file}
//                       alt={user.name}
//                       style={{
//                         width: "60px",
//                         height: "60px",
//                         objectFit: "cover",
//                         borderRadius: "8px",
//                       }}
//                     />
//                   ) : (
//                     "No Image"
//                   )}
//                 </td>
//                 <td>{user.name}</td>
//                 <td>{user.email}</td>
//                 <td>{user.address}</td>
//                 <td>{user.mobile}</td>
//                 <td>
//                   {user.fileType === "application/pdf" ? (
//                     <>
//                       <a
//                         href={user.file}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         style={{ marginRight: "8px" }}
//                       >
//                         📄 View PDF
//                       </a>
//                       <Button
//                         variant="success"
//                         size="sm"
//                         onClick={() => downloadResume(user._id, user.name)}
//                       >
//                         ⬇️ Download
//                       </Button>
//                     </>
//                   ) : (
//                     "No PDF"
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       )}
//     </div>
//   );
// };

// export default Users;







































import React, { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/users");
      const data = await response.json();

      if (data.success && Array.isArray(data.data)) {
        setUsers(data.data);
        localStorage.setItem("users", JSON.stringify(data.data));
      } else {
        throw new Error("No data returned from server");
      }
    } catch (error) {
      console.warn("Offline or API error: showing cached data");
      const cached = localStorage.getItem("users");
      if (cached) setUsers(JSON.parse(cached));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const downloadResume = async (url, filename) => {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("PDF fetch failed");
      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename || "resume.pdf";
      link.click();
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

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
              <th>Resume</th>
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
                    "No Image"
                  )}
                </td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.address}</td>
                <td>{user.mobile}</td>
                <td>
                  {user.pdf ? (
                    <>
                      <a
                        href={user.pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                      
                      </a>{" "}
                      {" "}
                      <Button
                        size="sm"
                        onClick={() => downloadResume(user.pdf, user.pdfName)}
                      >
                        Download
                      </Button>
                    </>
                  ) : (
                    "No Resume"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default Users;
