import { useState } from "react";
import { Link } from "react-router-dom";
import { registerAdmin } from "../api/authApi";

const INIT = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  employeeId: "",
  department: "",
  password: "",
  confirmPassword: "",
};

const fieldClass =
  "mt-2 w-full rounded-2xl border border-luxe-border bg-luxe-smoke px-4 py-3 outline-none transition focus:border-luxe-bronze focus:bg-white focus:ring-4 focus:ring-luxe-bronze/10";

const AdminRegister = () => {
  const [form, setForm] = useState(INIT);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.employeeId.trim() ||
      !form.department.trim() ||
      !form.password.trim() ||
      !form.confirmPassword.trim()
    ) {
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
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        employeeId: form.employeeId.trim(),
        department: form.department.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
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
    <section className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-10 lg:grid-cols-[0.95fr_1.15fr] lg:px-8">
      <div className="pt-4">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-luxe-bronze">Staff Onboarding</p>
        <h1 className="mt-4 font-serif text-5xl leading-none sm:text-6xl">KNSU Internal Operations</h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-luxe-muted">
          Welcome to the KNSU stays team. This secure portal is reserved for verified hotel staff
          and management personnel only.
        </p>

        <div className="mt-8 rounded-[28px] border border-luxe-bronze/20 bg-luxe-charcoal p-6 text-white shadow-[0_20px_50px_rgba(28,28,28,0.16)]">
          <span className="text-xs font-bold uppercase tracking-[0.28em] text-luxe-bronze-light">Access Level</span>
          <strong className="mt-3 block text-lg">Department-Verified Corporate Login</strong>
          <p className="mt-3 text-sm leading-7 text-white/75">
            All staff requests are reviewed against internal employee records before access is
            granted. Email verification is mandatory.
          </p>
        </div>
      </div>

      <form
        className="rounded-[32px] border border-luxe-border bg-white p-6 shadow-[0_24px_80px_rgba(28,28,28,0.08)] sm:p-8"
        onSubmit={handleSubmit}
      >
        <div className="mb-6">
          <h2 className="font-serif text-3xl">Staff Registration</h2>
          <p className="mt-2 text-sm leading-7 text-luxe-muted">
            Use your official employee details. They will be cross-referenced with internal records.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-semibold text-luxe-charcoal">
            First Name
            <input type="text" name="firstName" placeholder="e.g. Priya" value={form.firstName} onChange={handleChange} required className={fieldClass} />
          </label>
          <label className="block text-sm font-semibold text-luxe-charcoal">
            Last Name
            <input type="text" name="lastName" placeholder="e.g. Menon" value={form.lastName} onChange={handleChange} required className={fieldClass} />
          </label>
          <label className="block text-sm font-semibold text-luxe-charcoal md:col-span-2">
            Corporate Email
            <input type="email" name="email" placeholder="priya.menon@knsu.com" value={form.email} onChange={handleChange} required className={fieldClass} />
          </label>
          <label className="block text-sm font-semibold text-luxe-charcoal">
            Official Phone
            <input type="tel" name="phone" placeholder="+91 98000 00000" value={form.phone} onChange={handleChange} required className={fieldClass} />
          </label>
          <label className="block text-sm font-semibold text-luxe-charcoal">
            Employee ID
            <input type="text" name="employeeId" placeholder="KNSU-0042" value={form.employeeId} onChange={handleChange} required className={fieldClass} />
          </label>
          <label className="block text-sm font-semibold text-luxe-charcoal md:col-span-2">
            Department
            <select name="department" value={form.department} onChange={handleChange} required className={fieldClass}>
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
          <label className="block text-sm font-semibold text-luxe-charcoal">
            Password
            <input type="password" name="password" placeholder="Enter password" value={form.password} onChange={handleChange} required className={fieldClass} />
          </label>
          <label className="block text-sm font-semibold text-luxe-charcoal">
            Confirm Password
            <input type="password" name="confirmPassword" placeholder="Confirm password" value={form.confirmPassword} onChange={handleChange} required className={fieldClass} />
          </label>
        </div>

        <button
          type="submit"
          className="mt-6 w-full rounded-2xl bg-luxe-bronze px-5 py-3.5 font-semibold text-white transition hover:bg-luxe-charcoal disabled:cursor-wait disabled:opacity-70"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Registering Staff Profile..." : "Register Staff Profile"}
        </button>

        {success && (
          <p className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {success}
          </p>
        )}
        {error && (
          <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {success && (
          <div className="mt-4 rounded-[24px] border border-luxe-bronze/20 bg-luxe-smoke p-5">
            <span className="text-xs font-bold uppercase tracking-[0.28em] text-luxe-bronze">Verification Required</span>
            <strong className="mt-2 block text-lg">Check Corporate Inbox</strong>
            <p className="mt-2 text-sm leading-7 text-luxe-muted">
              A verification link has been sent to <strong>{submittedEmail}</strong>. Confirm your
              email to activate staff access.
            </p>
          </div>
        )}

        <div className="mt-6 space-y-3 border-t border-luxe-border pt-6 text-sm text-luxe-muted">
          <p>
            Already registered?{" "}
            <Link to="/admin/login" className="font-semibold text-luxe-bronze">
              Staff Login
            </Link>
          </p>
          <p>
            Guest registration?{" "}
            <Link to="/register" className="font-semibold text-luxe-bronze">
              Member Enrollment
            </Link>
          </p>
        </div>
      </form>
    </section>
  );
};

export default AdminRegister;
