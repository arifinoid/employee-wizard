import { useState, useEffect } from 'react'
import { createFileRoute, Link } from "@tanstack/react-router";
import { Employee } from "@/types";
import '@/styles/employees.css'

export const Route = createFileRoute("/employees")({
  component: EmployeesRoute,
});


function EmployeesRoute() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const limit = 5

  useEffect(() => {
    fetchEmployees()
  }, [page])

  const fetchEmployees = async () => {
    setLoading(true)
    try {
      const [basicRes, detailsRes] = await Promise.all([
        fetch(`http://localhost:4001/basicInfo?_page=${page}&_limit=${limit}`),
        fetch('http://localhost:4002/details'),
      ])

      const basicData = await basicRes.json()
      const detailsData = await detailsRes.json()

      const merged = basicData.map((basic: any) => {
        const detail = detailsData.find((d: any) => d.email === basic.email)
        return {
          ...basic,
          ...detail,
          photo: detail?.photo || null,
        }
      })

      setEmployees(merged)
    } catch (error) {
      console.error('Failed to fetch employees:', error)
      setEmployees([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading employees...</div>
  }

  return (
    <div className="employee-list">
      <div className="employee-list__header">
        <h1>Employee Directory</h1>
        <Link to="/wizard?role=admin" className="btn btn--primary">
          + Add Employee
        </Link>
      </div>

      <div className="employee-list__table-wrapper">
        <table className="employee-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Department</th>
              <th>Role</th>
              <th>Location</th>
              <th>Photo</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan={5} className="no-data">
                  No employees found
                </td>
              </tr>
            ) : (
              employees.map((employee, index) => (
                <tr key={index}>
                  <td>{employee.fullName || '—'}</td>
                  <td>{employee.department || '—'}</td>
                  <td>{employee.role || '—'}</td>
                  <td>{employee.officeLocation || 'N/A'}</td>
                  <td>
                    {employee.photo ? (
                      <img
                        src={employee.photo}
                        alt="Employee"
                        className="employee-photo"
                      />
                    ) : (
                      '—'
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="btn btn--secondary"
        >
          Previous
        </button>
        <span className="pagination-info">
          Page {page} • {employees.length} of {limit} employees
        </span>
        <button
          onClick={() => setPage(p => p + 1)}
          className="btn btn--secondary"
          disabled={employees.length < limit}
        >
          Next
        </button>
      </div>
    </div>
  )
}