import { useState, useEffect, useMemo, useRef } from 'react'
import { createFileRoute } from "@tanstack/react-router";

import { roleSearchSchema } from "@/types";
import { useFormDraft } from '@/hooks/useFormatDraft';
import { useAsyncSubmit } from '@/hooks/useAsyncSubmit';
import { generateEmployeeId } from '@/services/employeeIdGenerator';
import { validateEmail } from '@/utils/validation';
import { Autocomplete } from '@/components/Autocomplete/Autocomplete';

import '@/styles/wizard.css'

export const Route = createFileRoute("/wizard")({
  validateSearch: roleSearchSchema.parse,
  component: WizardRoute,
});

function WizardRoute() {
  const { role } = Route.useSearch()
  const navigate = Route.useNavigate();

  const [step, setStep] = useState(role === 'admin' ? 1 : 2)
  const [basicInfo, setBasicInfo] = useState({
    fullName: '',
    email: '',
    department: '',
    role: '',
    employeeId: '',
  })
  const [details, setDetails] = useState({
    photo: '',
    employmentType: '',
    officeLocation: '',
    notes: '',
  })
  const [isStep1Valid, setIsStep1Valid] = useState(false)

  const draftPayload = useMemo(() => ({ basicInfo, details }), [basicInfo, details])

  const shallowEqual = (a: Record<string, any>, b: Record<string, any>) => {
    if (!a || !b) return false
    const aKeys = Object.keys(a)
    const bKeys = Object.keys(b)
    if (aKeys.length !== bKeys.length) return false
    return aKeys.every((k) => a[k] === b[k])
  }

  const restoredRef = useRef(false)

  useFormDraft(role, draftPayload, (draft) => {
    if (restoredRef.current) return
    let didRestore = false
    if (draft.basicInfo && !shallowEqual(draft.basicInfo, basicInfo)) {
      setBasicInfo(draft.basicInfo)
      didRestore = true
    }
    if (draft.details && !shallowEqual(draft.details, details)) {
      setDetails(draft.details)
      didRestore = true
    }
    if (didRestore) restoredRef.current = true
  })

  const { submit, logs, isSubmitting } = useAsyncSubmit()

  useEffect(() => {
    let mounted = true

    if (basicInfo.department && role === 'admin' && !basicInfo.employeeId) {
      generateEmployeeId(basicInfo.department)
        .then((id) => {
          if (!mounted) return
          setBasicInfo(prev => ({ ...prev, employeeId: id ?? '' }))
        })
        .catch(() => { })
    }

    return () => {
      mounted = false
    }
  }, [basicInfo.department, role, basicInfo.employeeId])

  useEffect(() => {
    const valid = Boolean(basicInfo.fullName) &&
      validateEmail(basicInfo.email) &&
      Boolean(basicInfo.department) &&
      Boolean(basicInfo.role)
    setIsStep1Valid(valid)
  }, [basicInfo])

  const handleBasicChange = (field: string, value: string) => {
    setBasicInfo(prev => ({ ...prev, [field]: value }))
  }

  const handleDetailsChange = (field: string, value: string) => {
    setDetails(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    await submit(basicInfo, details, () => {
      localStorage.removeItem(`draft_${role}`)
      navigate('/employees')
    })
  }

  const clearDraft = () => {
    localStorage.removeItem(`draft_${role}`)
    if (role === 'admin') {
      setBasicInfo({ fullName: '', email: '', department: '', role: '', employeeId: '' })
    }
    setDetails({ photo: '', employmentType: '', officeLocation: '', notes: '' })
  }

  return (
    <div className="wizard">
      <div className="wizard__header">
        <h1>Add Employee - {role.toUpperCase()}</h1>
        <button onClick={clearDraft} className="wizard__clear-draft">
          Clear Draft
        </button>
      </div>

      {role === 'admin' && step === 1 && (
        <div className="wizard__step">
          <h2>Step 1: Basic Information</h2>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={basicInfo.fullName}
              onChange={(e) => handleBasicChange('fullName', e.target.value)}
              placeholder="Enter full name"
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={basicInfo.email}
              onChange={(e) => handleBasicChange('email', e.target.value)}
              placeholder="Enter email"
              className={!validateEmail(basicInfo.email) && basicInfo.email ? 'error' : ''}
            />
          </div>
          <div className="form-group">
            <label>Department</label>
            <Autocomplete
              value={basicInfo.department}
              onChange={(value) => handleBasicChange('department', value)}
              fetchUrl="http://localhost:4001/departments?name_like="
              placeholder="Select department, input 2 or more characters..."
              label=""
            />
          </div>
          <div className="form-group">
            <label>Role</label>
            <select
              value={basicInfo.role}
              onChange={(e) => handleBasicChange('role', e.target.value)}
            >
              <option value="">Select role</option>
              <option value="Ops">Ops</option>
              <option value="Admin">Admin</option>
              <option value="Engineer">Engineer</option>
              <option value="Finance">Finance</option>
            </select>
          </div>
          <div className="form-group">
            <label>Employee ID</label>
            <input
              type="text"
              value={basicInfo.employeeId}
              readOnly
              placeholder="Auto-generated"
              disabled
            />
          </div>
          <button
            onClick={() => setStep(2)}
            disabled={!isStep1Valid}
            className="wizard__next-btn"
          >
            Next
          </button>
        </div>
      )}

      {(step === 2 || role === 'ops') && (
        <div className="wizard__step">
          <h2>Step 2: Details & Submit</h2>
          <div className="form-group">
            <label>Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (!file) return
                const reader = new FileReader()
                reader.onload = () => {
                  const dataUrl = reader.result as string
                  handleDetailsChange('photo', dataUrl)
                }
                reader.readAsDataURL(file)
              }}
            />
            {details.photo && (
              <div className="photo-preview" style={{ marginTop: 8 }}>
                <img src={details.photo} alt="preview" style={{ maxWidth: 200, maxHeight: 200 }} />
                <button type="button" onClick={() => handleDetailsChange('photo', '')}>Remove</button>
              </div>
            )}
          </div>
          <div className="form-group">
            <label>Employment Type</label>
            <select
              value={details.employmentType}
              onChange={(e) => handleDetailsChange('employmentType', e.target.value)}
            >
              <option value="">Select type</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Intern">Intern</option>
            </select>
          </div>
          <div className="form-group">
            <label>Office Location</label>
            <Autocomplete
              value={details.officeLocation}
              onChange={(value) => handleDetailsChange('officeLocation', value)}
              fetchUrl="http://localhost:4002/locations?name_like="
              placeholder="Select location"
              label=""
            />
          </div>
          <div className="form-group">
            <label>Notes</label>
            <textarea
              value={details.notes}
              onChange={(e) => handleDetailsChange('notes', e.target.value)}
              placeholder="Additional notes"
              rows={4}
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="wizard__submit-btn"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Employee'}
          </button>
        </div>
      )}

      {logs.length > 0 && (
        <div className="wizard__logs">
          <h3>Submission Progress:</h3>
          {logs.map((log, index) => (
            <div key={index} className="log-item">{log}</div>
          ))}
        </div>
      )}
    </div>
  )
};
