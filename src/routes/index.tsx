import { useEffect, useState } from "react";
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

  const [stats, setStats] = useState({ basic: 0, details: 0 })

  const handleRoleChange = (role: Role) => {
    navigate({
      search: (prev) => ({ ...prev, role }),
      replace: true,
    });
  };

  const fetchStats = async () => {
    try {
      const [basicRes, detailsRes] = await Promise.all([
        fetch('http://localhost:4001/basicInfo'),
        fetch('http://localhost:4002/details'),
      ])
      const basic = await basicRes.json()
      const details = await detailsRes.json()
      setStats({
        basic: Array.isArray(basic) ? basic.length : 0,
        details: Array.isArray(details) ? details.length : 0,
      })
    } catch {
      // API not available
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return (
    <div className="index-page">
      <header className="hero">
        <h1 className="hero__title">Employee Management System</h1>
        <p className="hero__subtitle">
          Streamlined role-based onboarding with auto-save, async processing, and
          comprehensive employee directory.
        </p>
      </header>

      <section className="role-section">
        <h2>Select Your Role</h2>
        <div className="role-toggle">
          <button
            className={`role-btn ${role === 'admin' ? 'active' : ''}`}
            onClick={() => handleRoleChange('admin')}
          >
            <div className="role-icon">👨‍💼</div>
            <div>
              <strong>Admin</strong>
              <small>Full Access (Steps 1 + 2)</small>
            </div>
          </button>
          <button
            className={`role-btn ${role === 'ops' ? 'active' : ''}`}
            onClick={() => handleRoleChange('ops')}
          >
            <div className="role-icon">🔧</div>
            <div>
              <strong>Operations</strong>
              <small>Details Only (Step 2)</small>
            </div>
          </button>
        </div>

        <Link
          to={`/wizard?role=${role}`}
          className="cta-button"
        >
          🚀 Start Onboarding
        </Link>
      </section>

      <section className="stats-section">
        <div className="stat-grid">
          <div className="stat-card">
            <h3>Basic Records</h3>
            <div className="stat-number">{stats.basic}</div>
          </div>
          <div className="stat-card">
            <h3>Detail Records</h3>
            <div className="stat-number">{stats.details}</div>
          </div>
          <div className="stat-card">
            <h3>Complete Profiles</h3>
            <div className="stat-number">
              {Math.min(stats.basic, stats.details)}
            </div>
          </div>
        </div>
      </section>

      <section className="action-section">
        <Link to="/employees" className="secondary-button">
          👥 View Employee Directory
        </Link>
      </section>

      <footer className="footer">
        <p>
          <strong>Development APIs:</strong> localhost:4001 (Basic Info) •
          localhost:4002 (Details)
        </p>
        <p>
          Run <code>docker compose up -d</code> to start mock servers
        </p>
      </footer>
    </div>
  )
}
