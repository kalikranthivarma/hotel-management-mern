
import { useState } from "react";
import { Link } from "react-router-dom";
import { registerUser } from "../api/authApi";

const initialFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  idProof: "",
  password: "",
  confirmPassword: "",
};

const Register = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.password.trim() ||
      !formData.confirmPassword.trim()
    ) {
      setError("Please fill in all required fields before requesting OTP.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data } = await registerUser({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        idProof: formData.idProof.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      setSuccess(
        data?.message ||
          "Registration successful. Please check your email to verify your account."
      );
      setSubmittedEmail(formData.email.trim());
      setFormData(initialFormData);
    } catch (submitError) {
      setError(
        submitError.response?.data?.message ||
          submitError.message ||
          "Registration failed."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="register-page">
      <div className="register-hero">
        <p className="register-eyebrow">Guest Registration</p>
        <h1>Create your hotel account</h1>
        <p className="register-copy">
          This form uses the real backend registration API. The account is
          created first, and the guest must verify the email link before login.
        </p>

        <div className="register-panel">
          <span>Real API Flow</span>
          <strong>Register, open email verification link, then login</strong>
          <p>
            Required: firstName, lastName, email, phone, password,
            confirmPassword. Optional: address and idProof.
          </p>
        </div>
      </div>

      <form className="register-card" onSubmit={handleSubmit}>
        <div className="register-card-heading">
          <h2>Sign up</h2>
          <p>After submit, the backend sends a verification link to email.</p>
        </div>

        <div className="field-grid">
          <label className="field">
            <span>First name</span>
            <input
              type="text"
              name="firstName"
              placeholder="Enter first name"
              value={formData.firstName}
              onChange={handleChange}
            />
          </label>

          <label className="field">
            <span>Last name</span>
            <input
              type="text"
              name="lastName"
              placeholder="Enter last name"
              value={formData.lastName}
              onChange={handleChange}
            />
          </label>

          <label className="field field-full">
            <span>Email address</span>
            <input
              type="email"
              name="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </label>

          <label className="field">
            <span>Phone number</span>
            <input
              type="text"
              name="phone"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleChange}
            />
          </label>

          <label className="field">
            <span>ID proof</span>
            <input
              type="text"
              name="idProof"
              placeholder="Aadhaar, passport, driving licence"
              value={formData.idProof}
              onChange={handleChange}
            />
          </label>

          <label className="field field-full">
            <span>Address</span>
            <input
              type="text"
              name="address"
              placeholder="Enter address"
              value={formData.address}
              onChange={handleChange}
            />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              type="password"
              name="password"
              placeholder="Create password"
              value={formData.password}
              onChange={handleChange}
            />
          </label>

          <label className="field">
            <span>Confirm password</span>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </label>
        </div>

        <button type="submit" className="register-button" disabled={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Create account"}
        </button>

        {success ? <p className="form-message success">{success}</p> : null}
        {error ? <p className="form-message error">{error}</p> : null}

        {success ? (
          <div className="verification-card">
            <span>Next step</span>
            <strong>Verify your email</strong>
            <p>
              The account for <strong>{submittedEmail}</strong> has been
              registered. The user must open the verification link sent by the
              backend before logging in.
            </p>
          </div>
        ) : null}

        <p className="auth-switch">
          Link expired? <Link to="/resend-verification">Resend verification link</Link>
        </p>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </section>
  );
};

export default Register;
