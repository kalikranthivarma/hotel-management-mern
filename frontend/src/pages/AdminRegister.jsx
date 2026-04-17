import { useState } from "react";
import { Link } from "react-router-dom";
import { registerAdmin } from "../api/authApi";

const INIT = {
  firstName: "", lastName: "", email: "",
  phone: "", employeeId: "", department: "",
  password: "", confirmPassword: "",
};

const AdminRegister = () => {
  const [form, setForm] = useState(INIT);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim() || !form.phone.trim() || !form.employeeId.trim() || !form.department.trim() || !form.password.trim() || !form.confirmPassword.trim()) {
      setError("Please fill in all required staff credentials.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setIsSubmitting(true);
    try {
      const { data } = await registerAdmin({
        firstName: form.firstName.trim(), lastName: form.lastName.trim(),
        email: form.email.trim(), phone: form.phone.trim(),
        employeeId: form.employeeId.trim(), department: form.department.trim(),
        password: form.password, confirmPassword: form.confirmPassword,
      });
      setSuccess(data?.message || "Staff registration successful. Please verify your corporate email.");
      setSubmittedEmail(form.email.trim());
      setForm(INIT);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Registration failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="register-page register-page-admin">

      {/* ── LEFT: Hero ── */}
      <div className="register-hero">
        <p className="register-eyebrow">Staff Onboarding</p>
        <h1>KNSU Internal Operations</h1>
        <p className="register-copy">
          Welcome to the KNSU stays team. This secure portal is reserved for verified hotel staff and management personnel only.
        </p>
        <div className="register-panel">
          <span>Access Level</span>
          <strong>Department-Verified Corporate Login</strong>
          <p>All staff requests are reviewed against internal employee records before access is granted. Email verification is mandatory.</p>
        </div>
      </div>

      {/* ── RIGHT: Form ── */}
      <form className="register-card" onSubmit={handleSubmit}>
        <div className="register-card-heading">
          <h2>Staff Registration</h2>
          <p>Register your professional profile. Use your official employee details — these will be cross-referenced with our internal records.</p>
        </div>

        <div className="field-grid">
          <label className="field">
            <span>First Name *</span>
            <input type="text" name="firstName" placeholder="e.g. Priya" value={form.firstName} onChange={handleChange} required />
          </label>
          <label className="field">
            <span>Last Name *</span>
            <input type="text" name="lastName" placeholder="e.g. Menon" value={form.lastName} onChange={handleChange} required />
          </label>
          <label className="field field-full">
            <span>Corporate Email *</span>
            <input type="email" name="email" placeholder="priya.menon@knsu.com" value={form.email} onChange={handleChange} required />
          </label>
          <label className="field">
            <span>Official Phone *</span>
            <input type="tel" name="phone" placeholder="+91 98000 00000" value={form.phone} onChange={handleChange} required />
          </label>
          <label className="field">
            <span>Employee ID *</span>
            <input type="text" name="employeeId" placeholder="KNSU-0042" value={form.employeeId} onChange={handleChange} required />
          </label>
          <label className="field field-full">
            <span>Department *</span>
            <select name="department" value={form.department} onChange={handleChange} required>
              <option value="">Select Department</option>
              <option value="Front Desk">Front Desk</option>
              <option value="Reception">Reception</option>
              <option value="Management">Management</option>
              <option value="Housekeeping">Housekeeping</option>
              <option value="Security">Security</option>
              <option value="Kitchen">Kitchen</option>
              <option value="IT">IT</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </label>

          <label className="field">
            <span>Password *</span>
            <input type="password" name="password" placeholder="••••••••" value={form.password} onChange={handleChange} required />
          </label>
          <label className="field">
            <span>Confirm Password *</span>
            <input type="password" name="confirmPassword" placeholder="••••••••" value={form.confirmPassword} onChange={handleChange} required />
          </label>
        </div>

        <button type="submit" className="register-button" disabled={isSubmitting}>
          {isSubmitting ? "Registering Staff Profile..." : "Register Staff Profile"}
        </button>

        {success && <p className="form-message success">{success}</p>}
        {error && <p className="form-message error">{error}</p>}

        {success && (
          <div className="verification-card">
            <span>Verification Required</span>
            <strong>Check Corporate Inbox</strong>
            <p>A verification link has been dispatched to <strong>{submittedEmail}</strong>. Confirm your email to activate staff access.</p>
          </div>
        )}

        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #E8E4DF', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <p className="auth-switch" style={{ margin: 0 }}>
            Already registered? <Link to="/admin/login">Staff Login</Link>
          </p>
          <p className="auth-switch" style={{ margin: 0 }}>
            Guest registration? <Link to="/register">Member Enrollment</Link>
          </p>
        </div>
      </form>

    </section>
  );
};

export default AdminRegister;
