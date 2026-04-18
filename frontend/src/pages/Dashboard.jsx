import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const cardClass =
  "rounded-[30px] border border-luxe-border bg-white p-6 shadow-[0_18px_50px_rgba(28,28,28,0.06)]";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <div className="px-4 py-16 text-center text-luxe-muted">Loading profile...</div>;
  }

  const isAdmin = user.role === "admin" || user.role === "superAdmin";

  const profileFields = [
    { label: "Full Name", value: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Not available" },
    { label: "Email Address", value: user.email || "Not available" },
    { label: "Phone Number", value: user.phone || "Not provided" },
    { label: "Role", value: user.role || "Not available" },
    ...(typeof user.loyaltyPoints === "number"
      ? [{ label: "Loyalty Points", value: String(user.loyaltyPoints) }]
      : []),
    ...(user.employeeId ? [{ label: "Employee ID", value: user.employeeId }] : []),
    ...(user.department ? [{ label: "Department", value: user.department }] : []),
  ];

  const quickLinks = isAdmin
    ? [
        {
          title: "Manage Rooms",
          copy: "Add, edit or deactivate property listings.",
          to: "/admin/manage-rooms",
        },
        {
          title: "Booking Requests",
          copy: "Review and update reservation statuses.",
          to: "/admin/bookings",
        },
      ]
    : [
        {
          title: "My Stay History",
          copy: "See all your real booking records in one place.",
          to: "/bookings",
        },
        {
          title: "Book a New Stay",
          copy: "Browse available rooms and make a new reservation.",
          to: "/rooms",
        },
      ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 lg:px-8">
      <header className="mb-8 flex flex-col gap-5 rounded-[34px] bg-luxe-charcoal px-6 py-8 text-white shadow-[0_18px_60px_rgba(28,28,28,0.14)] sm:px-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-luxe-bronze-light">
            {isAdmin ? "Staff Profile" : "Guest Profile"}
          </p>
          <h1 className="mt-4 font-serif text-5xl leading-none">
            Welcome back, <span className="text-luxe-bronze-light">{user.firstName}</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/70">
            This page is showing your actual account information from the current login session.
          </p>
        </div>
        <Link
          to={isAdmin ? "/admin/bookings" : "/rooms"}
          className="rounded-full bg-luxe-bronze px-5 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-luxe-charcoal"
        >
          {isAdmin ? "View All Bookings" : "Explore Rooms"}
        </Link>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className={cardClass}>
          <h2 className="font-serif text-3xl">Profile Details</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {profileFields.map((field) => (
              <div key={field.label} className="rounded-[24px] bg-luxe-smoke p-5">
                <span className="text-xs uppercase tracking-[0.24em] text-luxe-muted">{field.label}</span>
                <p className="mt-3 break-words font-semibold capitalize">{field.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={cardClass}>
          <h2 className="font-serif text-3xl">{isAdmin ? "Staff Actions" : "Quick Links"}</h2>
          <div className="mt-6 space-y-4">
            {quickLinks.map((item) => (
              <Link
                key={item.title}
                to={item.to}
                className="block rounded-[24px] border border-luxe-border p-5 transition hover:border-luxe-bronze hover:bg-luxe-smoke"
              >
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-luxe-muted">{item.copy}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
