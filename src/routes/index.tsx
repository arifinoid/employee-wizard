import { createFileRoute, Link } from "@tanstack/react-router";

import { Role, roleSearchSchema } from "@/types";
import '@/styles/index.css';

export const Route = createFileRoute("/")({
  validateSearch: roleSearchSchema.parse,
  component: IndexRoute,
});

function IndexRoute() {
  const { role } = Route.useSearch()
  const navigate = Route.useNavigate();

  const handleRoleChange = (role: Role) => {
    navigate({
      search: (prev) => ({ ...prev, role }),
      replace: true,
    });
  };

  return (
    <div className="index-page">
      <header className="index-page__header">
        <h1 className="index-page__title">Employee Management System</h1>
        <p className="index-page__subtitle">
          Role-based wizard for Admin & Ops • Auto-save • Async submit • Employee list
        </p>
      </header>

      <section className="index-page__hero">
        <div className="index-page__role-selector">
          <h2 className="index-page__section-title">Select Your Role</h2>
          <div className="role-toggle">
            <button
              className={`role-toggle__button ${role === 'admin' ? 'role-toggle__button--active' : ''}`}
              onClick={() => handleRoleChange('admin')}
            >
              Admin
              <span className="role-toggle__badge">Step 1 + 2</span>
            </button>
            <button
              className={`role-toggle__button ${role === 'ops' ? 'role-toggle__button--active' : ''}`}
              onClick={() => handleRoleChange('ops')}
            >
              Ops
              <span className="role-toggle__badge">Step 2 only</span>
            </button>
          </div>
        </div>

        <div className="index-page__cta">
          <Link
            to={`/wizard?role=${role}`}
            className="index-page__cta-button"
          >
            + Add New Employee
          </Link>
          <Link to="/employees" className="index-page__link">
            View Employee List →
          </Link>
        </div>
      </section>

      <section className="index-page__stats">
        <div className="stat-card">
          <div className="stat-card__icon">Basic Info</div>
          <div className="stat-card__value">0</div>
          <div className="stat-card__label">Records</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon">Details</div>
          <div className="stat-card__value">0</div>
          <div className="stat-card__label">Records</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon">Merged</div>
          <div className="stat-card__value">
            {Math.min(0, 0)}
          </div>
          <div className="stat-card__label">Complete</div>
        </div>
      </section>

      <footer className="index-page__footer">
        <p>
          Mock APIs: <code>localhost:4001</code> (basicInfo) •{' '}
          <code>localhost:4002</code> (details)
        </p>
        <p>
          Run <code>docker compose up -d</code> to start servers.
        </p>
      </footer>
    </div>
  );
}
