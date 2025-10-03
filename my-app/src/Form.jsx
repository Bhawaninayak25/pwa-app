// import React, { useState, useRef, useEffect } from "react";
// import './CameraCaptureForm.css';
// import {
//   savePendingForm,
//   getPendingForms,
//   deletePendingForm,
// } from "./indexedDB";

// export default function CameraCaptureForm() {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     mobile: "",
//     address: "",
//     latlon: "",
//   });
//   const [lastBlob, setLastBlob] = useState(null);
//   const [pdfFile, setPdfFile] = useState(null);
//   const [stream, setStream] = useState(null);
//   const [pendingForms, setPendingForms] = useState([]);

//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     return () => stopCamera();
//   }, []);

//   const fetchPendingForms = async () => {
//     const pending = await getPendingForms();
//     setPendingForms(pending);
//   };

//   useEffect(() => {
//     const syncPending = async () => {
//       const pending = await getPendingForms();
//       for (const item of pending) {
//         try {
//           const fd = new FormData();
//           fd.append("name", item.name);
//           fd.append("email", item.email);
//           fd.append("mobile", item.mobile);
//           fd.append("address", item.address);
//           fd.append("location", item.latlon);

//           if (item.image) fd.append("image", new File([item.image], "photo.jpg", { type: "image/jpeg" }));
//           if (item.pdf) fd.append("pdf", new File([item.pdf], "file.pdf", { type: "application/pdf" }));

//           const res = await fetch("http://localhost:5000/users", { method: "POST", body: fd });
//           const result = await res.json();
//           if (result.success) await deletePendingForm(item.id);
//         } catch {}
//       }
//       fetchPendingForms();
//     };

//     window.addEventListener("online", syncPending);
//     fetchPendingForms();
//     return () => window.removeEventListener("online", syncPending);
//   }, []);

//   // Camera functions
//   const startCamera = async () => {
//     try {
//       const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
//       setStream(s);
//       if (videoRef.current) videoRef.current.srcObject = s;
//     } catch {
//       alert("Camera not available or denied!");
//     }
//   };

//   const stopCamera = () => {
//     if (stream) {
//       stream.getTracks().forEach((t) => t.stop());
//       setStream(null);
//     }
//   };

//   const capturePhoto = () => {
//     if (!stream || !videoRef.current || !canvasRef.current) return;
//     const video = videoRef.current;
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");
//     canvas.width = video.videoWidth || 480;
//     canvas.height = video.videoHeight || 360;
//     ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

//     canvas.toBlob((blob) => { if (blob) setLastBlob(blob); }, "image/jpeg");
//   };

//   // Location
//   const getLocation = () => {
//     if (!navigator.geolocation) return alert("Geolocation not supported");
//     navigator.geolocation.getCurrentPosition(
//       async (pos) => {
//         const lat = pos.coords.latitude;
//         const lon = pos.coords.longitude;
//         setFormData((f) => ({ ...f, latlon: `${lat},${lon}` }));

//         if (navigator.onLine) {
//           try {
//             const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
//             const r = await fetch(url, { headers: { Accept: "application/json" } });
//             const data = await r.json();
//             setFormData((f) => ({ ...f, address: data.display_name || "" }));
//           } catch {}
//         } else {
//           setFormData((f) => ({ ...f, address: "Offline: Address not available" }));
//         }
//       },
//       () => alert("Location error"),
//       { enableHighAccuracy: true, timeout: 10000 }
//     );
//   };

//   // Submit
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const data = { ...formData };

//     if (!data.name || !data.email || !data.mobile || !data.address) {
//       return alert("Fill all fields");
//     }

//     const fd = new FormData();
//     fd.append("name", data.name);
//     fd.append("email", data.email);
//     fd.append("mobile", data.mobile);
//     fd.append("address", data.address);
//     fd.append("location", data.latlon);

//     if (lastBlob) fd.append("image", new File([lastBlob], "photo.jpg", { type: "image/jpeg" }));
//     if (pdfFile) fd.append("pdf", pdfFile);

//     if (!navigator.onLine) {
//       await savePendingForm({ ...data, image: lastBlob, pdf: pdfFile });
//       alert("You are offline! Form saved locally.");
//     } else {
//       try {
//         const res = await fetch("http://localhost:5000/users", { method: "POST", body: fd });
//         const result = await res.json();
//         if (result.success) alert("Form submitted successfully!");
//         else await savePendingForm({ ...data, image: lastBlob, pdf: pdfFile });
//       } catch {
//         await savePendingForm({ ...data, image: lastBlob, pdf: pdfFile });
//       }
//     }

//     setFormData({ name: "", email: "", mobile: "", address: "", latlon: "" });
//     setLastBlob(null);
//     setPdfFile(null);
//     fetchPendingForms();
//   };

//   // Download PDF
//   const downloadPDF = async (fileId, filename) => {
//     try {
//       const res = await fetch(`http://localhost:5000/users/pdf/${fileId}`);
//       if (!res.ok) throw new Error("PDF fetch failed");
//       const blob = await res.blob();
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = filename || "file.pdf";
//       a.click();
//     } catch (err) {
//       console.error("PDF download error:", err);
//     }
//   };

//   return (
//     <div style={{ maxWidth: 720, margin: "20px auto" }}>
//       <h2>PWA Form with PDF</h2>
//       <form onSubmit={handleSubmit}>
//         <input type="text" placeholder="Name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
//         <input type="email" placeholder="Email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
//         <input type="tel" placeholder="Mobile" pattern="[0-9()+, -]{10,}" title="Enter a valid phone number" required value={formData.mobile} onChange={(e) => setFormData({ ...formData, mobile: e.target.value })} />
//         <textarea placeholder="Address" required value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
//         <div style={{ display: "flex", gap: 8 }}>
//           <input type="text" value={formData.latlon} placeholder="Lat, Lon" readOnly />
//           <button type="button" onClick={getLocation}>Location</button>
//         </div>

//         <hr />
//         <input type="file" accept="application/pdf" onChange={(e) => setPdfFile(e.target.files[0])} />
//         <button type="button" onClick={startCamera} disabled={!!stream}>Open Camera</button>
//         <button type="button" onClick={capturePhoto} disabled={!stream}>Capture Photo</button>
//         <button type="button" onClick={stopCamera} disabled={!stream}>Stop Camera</button>

//         <div style={{ marginTop: 10 }}>
//           <video ref={videoRef} playsInline autoPlay muted style={{ display: stream ? "block" : "none", width: 480, height: 360 }} />
//           <canvas ref={canvasRef} style={{ display: "none" }} width={480} height={360}></canvas>
//           {lastBlob && <img src={URL.createObjectURL(lastBlob)} alt="Captured" style={{ maxWidth: 200, border: "1px solid #ddd" }} />}
//         </div>

//         <button type="submit">Submit</button>
//       </form>

//       <h3>Pending Forms (Offline)</h3>
//       <ul>
//         {pendingForms.map((f) => (
//           <li key={f.id} style={{ marginBottom: 10 }}>
//             <div>{f.name} - {f.email} - {f.mobile} - {f.latlon}</div>
//             {f.image && <img src={URL.createObjectURL(f.image)} alt="Pending" style={{ maxWidth: 100, border: "1px solid #ddd" }} />}
//             {f.pdf && <button onClick={() => downloadPDF(f.id, `${f.name}.pdf`)}>Download PDF</button>}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }









































 import React, { useState, useRef, useEffect } from "react";
import './CameraCaptureForm.css';
import {
  savePendingForm,
  getPendingForms,
  deletePendingForm,
} from "./indexedDB";

export default function CameraCaptureForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    latlon: "",
  });
  const [lastBlob, setLastBlob] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [stream, setStream] = useState(null);
  const [pendingForms, setPendingForms] = useState([]);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const fetchPendingForms = async () => {
    const pending = await getPendingForms();
    setPendingForms(pending);
  };

  useEffect(() => {
    const syncPending = async () => {
      const pending = await getPendingForms();
      for (const item of pending) {
        try {
          const fd = new FormData();
          fd.append("name", item.name);
          fd.append("email", item.email);
          fd.append("mobile", item.mobile);
          fd.append("address", item.address);
          fd.append("location", item.latlon);

          if (item.image) fd.append("image", new File([item.image], "photo.jpg", { type: "image/jpeg" }));
          if (item.pdf) fd.append("pdf", new File([item.pdf], "file.pdf", { type: "application/pdf" }));

          const res = await fetch("http://localhost:5000/users", { method: "POST", body: fd });
          const result = await res.json();
          if (result.success) await deletePendingForm(item.id);
        } catch {}
      }
      fetchPendingForms();
    };

    window.addEventListener("online", syncPending);
    fetchPendingForms();
    return () => window.removeEventListener("online", syncPending);
  }, []);

  // Camera functions
  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
    } catch {
      alert("Camera not available or denied!");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (!stream || !videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth || 480;
    canvas.height = video.videoHeight || 360;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => { if (blob) setLastBlob(blob); }, "image/jpeg");
  };

  // Location
  const getLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setFormData((f) => ({ ...f, latlon: `${lat},${lon}` }));

        if (navigator.onLine) {
          try {
            const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
            const r = await fetch(url, { headers: { Accept: "application/json" } });
            const data = await r.json();
            setFormData((f) => ({ ...f, address: data.display_name || "" }));
          } catch {}
        } else {
          setFormData((f) => ({ ...f, address: "Offline: Address not available" }));
        }
      },
      () => alert("Location error"),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { ...formData };

    if (!data.name || !data.email || !data.mobile || !data.address) {
      return alert("Fill all fields");
    }

    const fd = new FormData();
    fd.append("name", data.name);
    fd.append("email", data.email);
    fd.append("mobile", data.mobile);
    fd.append("address", data.address);
    fd.append("location", data.latlon);

    if (lastBlob) fd.append("image", new File([lastBlob], "photo.jpg", { type: "image/jpeg" }));
    if (pdfFile) fd.append("pdf", pdfFile);

    if (!navigator.onLine) {
      await savePendingForm({ ...data, image: lastBlob, pdf: pdfFile });
      alert("You are offline! Form saved locally.");
    } else {
      try {
        const res = await fetch("http://localhost:5000/users", { method: "POST", body: fd });
        const result = await res.json();
        if (result.success) alert("Form submitted successfully!");
        else await savePendingForm({ ...data, image: lastBlob, pdf: pdfFile });
      } catch {
        await savePendingForm({ ...data, image: lastBlob, pdf: pdfFile });
      }
    }

    // Reset form
    setFormData({ name: "", email: "", mobile: "", address: "", latlon: "" });
    setLastBlob(null);
    setPdfFile(null);
    fetchPendingForms();
  };

  // ✅ Offline/online PDF download
  const downloadPDF = async (file, filename) => {
    if (file instanceof Blob) {
      // Offline stored blob
      const url = URL.createObjectURL(file);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename || "file.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } else {
      // Server fetch
      try {
        const res = await fetch(`http://localhost:5000/users/pdf/${file}`);
        if (!res.ok) throw new Error("PDF fetch failed");
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename || "file.pdf";
        a.click();
        URL.revokeObjectURL(url);
      } catch (err) {
        console.error("PDF download error:", err);
      }
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: "20px auto" }}>
      <h2>PWA Form with PDF</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })} />

        <input type="email" placeholder="Email" required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })} />

        {/* ✅ Corrected regex pattern */}
        <input type="tel" placeholder="Mobile"
          pattern="^[0-9()+\\- ]{10,}$"
          title="Enter a valid phone number"
          required
          value={formData.mobile}
          onChange={(e) => setFormData({ ...formData, mobile: e.target.value })} />

        <textarea placeholder="Address" required
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })} />

        <div style={{ display: "flex", gap: 8 }}>
          <input type="text" value={formData.latlon} placeholder="Lat, Lon" readOnly />
          <button type="button" onClick={getLocation}>Location</button>
        </div>

        <hr />
        <input type="file" accept="application/pdf"
          onChange={(e) => setPdfFile(e.target.files[0])} />

        <button type="button" onClick={startCamera} disabled={!!stream}>Open Camera</button>
        <button type="button" onClick={capturePhoto} disabled={!stream}>Capture Photo</button>
        <button type="button" onClick={stopCamera} disabled={!stream}>Stop Camera</button>

        <div style={{ marginTop: 10 }}>
          <video ref={videoRef} playsInline autoPlay muted
            style={{ display: stream ? "block" : "none", width: 480, height: 360 }} />
          <canvas ref={canvasRef} style={{ display: "none" }} width={480} height={360}></canvas>
          {lastBlob && <img src={URL.createObjectURL(lastBlob)} alt="Captured"
            style={{ maxWidth: 200, border: "1px solid #ddd" }} />}
        </div>

        <button type="submit">Submit</button>
      </form>

      <h3>Pending Forms (Offline)</h3>
      <ul>
        {pendingForms.map((f) => (
          <li key={f.id} style={{ marginBottom: 10 }}>
            <div>{f.name} - {f.email} - {f.mobile} - {f.latlon}</div>
            {f.image && <img src={URL.createObjectURL(f.image)} alt="Pending"
              style={{ maxWidth: 100, border: "1px solid #ddd" }} />}
            {f.pdf && <button onClick={() => downloadPDF(f.pdf, `${f.name}.pdf`)}>Download PDF</button>}
          </li>
        ))}
      </ul>
    </div>
  );
}
