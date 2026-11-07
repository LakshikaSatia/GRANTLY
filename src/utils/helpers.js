import { DOC_LIST } from '../data/scholarships'

const MS_PER_DAY = 1000 * 60 * 60 * 24

// Days remaining until the end of the deadline day
export function daysLeft(isoDate) {
  const end = new Date(`${isoDate}T23:59:59`)
  return Math.ceil((end - new Date()) / MS_PER_DAY)
}

export function urgencyOf(days) {
  if (days <= 0) return 'closed'
  if (days <= 7) return 'urgent'
  if (days <= 21) return 'soon'
  return 'open'
}

export function formatDate(isoDate) {
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatMoney(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatMoneyShort(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(amount)
}

// Scores a scholarship against the student's profile (0-100) and explains why.
export function computeMatch(scholarship, profile) {
  const gpa = Number(profile.gpa)
  const income = Number(profile.income)

  const checks = [
    {
      weight: 30,
      ok: scholarship.levels.includes(profile.level),
      yes: `Open to ${profile.level} students`,
      no: `Meant for ${scholarship.levels.join(' / ')} (you chose ${profile.level})`,
    },
    {
      weight: 25,
      ok: scholarship.fields.includes('Any') || scholarship.fields.includes(profile.field),
      yes: scholarship.fields.includes('Any') ? 'Open to every field of study' : `Welcomes ${profile.field} students`,
      no: `Only for ${scholarship.fields.join(' / ')} (you chose ${profile.field})`,
    },
    {
      weight: 25,
      ok: gpa >= scholarship.minGpa,
      yes: `Your GPA clears the ${scholarship.minGpa.toFixed(1)} minimum`,
      no: `Needs GPA ${scholarship.minGpa.toFixed(1)}+ (you entered ${Number.isNaN(gpa) ? '?' : gpa})`,
    },
    {
      weight: 20,
      ok: scholarship.maxIncome === null || income <= scholarship.maxIncome,
      yes:
        scholarship.maxIncome === null
          ? 'No income limit'
          : `Income is within the ₹${scholarship.maxIncome}L limit`,
      no: `Family income must be under ₹${scholarship.maxIncome}L per year`,
    },
  ]

  return {
    score: checks.reduce((total, c) => total + (c.ok ? c.weight : 0), 0),
    reasons: checks.filter((c) => c.ok).map((c) => c.yes),
    gaps: checks.filter((c) => !c.ok).map((c) => c.no),
  }
}

// How many of the required documents are ticked in the vault?
export function readiness(scholarship, docs) {
  const items = scholarship.documents.map((id) => {
    const doc = DOC_LIST.find((d) => d.id === id)
    return { id, label: doc ? doc.label : id, ok: Boolean(docs[id]) }
  })
  const ready = items.filter((i) => i.ok).length
  const total = items.length
  return { items, ready, total, pct: total === 0 ? 100 : Math.round((ready / total) * 100) }
}