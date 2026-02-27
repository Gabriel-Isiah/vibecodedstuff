import React, { useEffect, useState } from "react";
import "./Home.css";

const dummySamples = [
  {
    id: "SMP-001",
    disease: "Breast Cancer",
    organism: "Human",
    type: "Blood",
    tissue: "Peripheral blood",
    collection: "Venipuncture",
    purpose: "Biomarker discovery",
    project: "BC-Study-01",
    ownerEmail: "researcher@example.com",
  },
  {
    id: "SMP-002",
    disease: "COVID-19",
    organism: "Human",
    type: "Nasopharyngeal swab",
    tissue: "Upper respiratory tract",
    collection: "Swab",
    purpose: "Viral load monitoring",
    project: "CV19-Resp-02",
    ownerEmail: "researcher@example.com",
  },
  {
    id: "SMP-003",
    disease: "Diabetes",
    organism: "Mouse",
    type: "Tissue",
    tissue: "Pancreas",
    collection: "Dissection",
    purpose: "Pathophysiology study",
    project: "DB-Mouse-03",
    ownerEmail: "user@example.com",
  },
];

const SAMPLES_KEY = "biosample_samples";

const Home = ({ currentUser, onLogout }) => {
  const role = currentUser?.role || "user";

  const [samples, setSamples] = useState([]);
  const [viewSample, setViewSample] = useState(null);
  const [editingSample, setEditingSample] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    id: "",
    disease: "",
    organism: "",
    type: "",
    tissue: "",
    collection: "",
    purpose: "",
    project: "",
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SAMPLES_KEY);
      if (raw) {
        setSamples(JSON.parse(raw));
      } else {
        setSamples(dummySamples);
        localStorage.setItem(SAMPLES_KEY, JSON.stringify(dummySamples));
      }
    } catch (err) {
      console.error("Failed to load samples from localStorage", err);
      setSamples(dummySamples);
    }
  }, []);

  const saveSamples = (next) => {
    setSamples(next);
    try {
      localStorage.setItem(SAMPLES_KEY, JSON.stringify(next));
    } catch (err) {
      console.error("Failed to save samples to localStorage", err);
    }
  };

  const canAddSample = role === "admin" || role === "researcher";

  const handleView = (sample) => {
    setViewSample(sample);
  };

  const openAddModal = () => {
    setEditingSample(null);
    setFormValues({
      id: "",
      disease: "",
      organism: "",
      type: "",
      tissue: "",
      collection: "",
      purpose: "",
      project: "",
    });
    setIsEditOpen(true);
  };

  const openEditModal = (sample) => {
    setEditingSample(sample);
    setFormValues({
      id: sample.id,
      disease: sample.disease,
      organism: sample.organism,
      type: sample.type,
      tissue: sample.tissue,
      collection: sample.collection,
      purpose: sample.purpose,
      project: sample.project,
    });
    setIsEditOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!formValues.id.trim()) {
      alert("Sample ID is required.");
      return;
    }

    if (editingSample) {
      const updated = samples.map((s) =>
        s.id === editingSample.id
          ? {
              ...s,
              ...formValues,
            }
          : s
      );
      saveSamples(updated);
    } else {
      const newSample = {
        id: formValues.id,
        disease: formValues.disease,
        organism: formValues.organism,
        type: formValues.type,
        tissue: formValues.tissue,
        collection: formValues.collection,
        purpose: formValues.purpose,
        project: formValues.project,
        ownerEmail: currentUser.email,
      };
      const updated = [...samples, newSample];
      saveSamples(updated);
    }

    setIsEditOpen(false);
    setEditingSample(null);
  };

  const handleDelete = (sample) => {
    if (!window.confirm(`Delete sample ${sample.id}?`)) {
      return;
    }
    const filtered = samples.filter((s) => s.id !== sample.id);
    saveSamples(filtered);
  };

  const renderActionsForSample = (sample) => {
    const isOwner =
      currentUser && sample.ownerEmail === currentUser.email;

    if (role === "admin") {
      return (
        <div className="actions-cell">
          <button
            className="action-btn view"
            onClick={() => handleView(sample)}
          >
            View
          </button>
          <button
            className="action-btn edit"
            onClick={() => openEditModal(sample)}
          >
            Edit
          </button>
          <button
            className="action-btn delete"
            onClick={() => handleDelete(sample)}
          >
            Delete
          </button>
        </div>
      );
    }

    if (role === "researcher") {
      return (
        <div className="actions-cell">
          <button
            className="action-btn view"
            onClick={() => handleView(sample)}
          >
            View
          </button>
          {isOwner && (
            <>
              <button
                className="action-btn edit"
                onClick={() => openEditModal(sample)}
              >
                Edit
              </button>
              <button
                className="action-btn delete"
                onClick={() => handleDelete(sample)}
              >
                Delete
              </button>
            </>
          )}
        </div>
      );
    }

    // Students / general users: view only
    return (
      <div className="actions-cell">
        <button
          className="action-btn view"
          onClick={() => handleView(sample)}
        >
          View
        </button>
      </div>
    );
  };

  return (
    <div className="home-page">
      <header className="home-header">
        <div>
          <h1>BioSample Tracker</h1>
          <p>Web-Based Biological Sample Database System</p>
        </div>
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </header>

      <main className="home-main">
        <section className="recent-samples-card">
          <div className="recent-samples-header">
            <h2>Recent Samples</h2>
            {canAddSample && (
              <button className="add-sample-btn" onClick={openAddModal}>
                + Add New Biological Data
              </button>
            )}
          </div>

          <div className="recent-samples-table-wrapper">
            <table className="recent-samples-table">
              <thead>
                <tr>
                  <th>Sample ID</th>
                  <th>Disease</th>
                  <th>Organism</th>
                  <th>Sample Type</th>
                  <th>Tissue Source</th>
                  <th>Collection Method</th>
                  <th>Study Purpose</th>
                  <th>Project Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {samples.map((s) => (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td>{s.disease}</td>
                    <td>{s.organism}</td>
                    <td>{s.type}</td>
                    <td>{s.tissue}</td>
                    <td>{s.collection}</td>
                    <td>{s.purpose}</td>
                    <td>{s.project}</td>
                    <td>
                      {renderActionsForSample(s)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {viewSample && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <h3>View Biological Sample</h3>
              <button
                className="modal-close"
                onClick={() => setViewSample(null)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-row">
                <span className="detail-label">Sample ID</span>
                <span>{viewSample.id}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Disease</span>
                <span>{viewSample.disease}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Organism</span>
                <span>{viewSample.organism}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Sample Type</span>
                <span>{viewSample.type}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Tissue Source</span>
                <span>{viewSample.tissue}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Collection Method</span>
                <span>{viewSample.collection}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Study Purpose</span>
                <span>{viewSample.purpose}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Project Name</span>
                <span>{viewSample.project}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {isEditOpen && (
        <div className="modal-backdrop">
          <div className="modal">
            <div className="modal-header">
              <h3>
                {editingSample ? "Edit Biological Sample" : "Add Biological Sample"}
              </h3>
              <button
                className="modal-close"
                onClick={() => {
                  setIsEditOpen(false);
                  setEditingSample(null);
                }}
              >
                ×
              </button>
            </div>
            <form className="modal-body form-grid" onSubmit={handleFormSubmit}>
              <label>
                <span>Sample ID</span>
                <input
                  type="text"
                  name="id"
                  value={formValues.id}
                  onChange={handleFormChange}
                  required
                  disabled={!!editingSample}
                />
              </label>
              <label>
                <span>Disease</span>
                <input
                  type="text"
                  name="disease"
                  value={formValues.disease}
                  onChange={handleFormChange}
                  required
                />
              </label>
              <label>
                <span>Organism</span>
                <input
                  type="text"
                  name="organism"
                  value={formValues.organism}
                  onChange={handleFormChange}
                  required
                />
              </label>
              <label>
                <span>Sample Type</span>
                <input
                  type="text"
                  name="type"
                  value={formValues.type}
                  onChange={handleFormChange}
                  required
                />
              </label>
              <label>
                <span>Tissue Source</span>
                <input
                  type="text"
                  name="tissue"
                  value={formValues.tissue}
                  onChange={handleFormChange}
                  required
                />
              </label>
              <label>
                <span>Collection Method</span>
                <input
                  type="text"
                  name="collection"
                  value={formValues.collection}
                  onChange={handleFormChange}
                  required
                />
              </label>
              <label>
                <span>Study Purpose</span>
                <input
                  type="text"
                  name="purpose"
                  value={formValues.purpose}
                  onChange={handleFormChange}
                  required
                />
              </label>
              <label>
                <span>Project Name</span>
                <input
                  type="text"
                  name="project"
                  value={formValues.project}
                  onChange={handleFormChange}
                  required
                />
              </label>

              <div className="modal-footer">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => {
                    setIsEditOpen(false);
                    setEditingSample(null);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-btn">
                  {editingSample ? "Save Changes" : "Add Sample"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

