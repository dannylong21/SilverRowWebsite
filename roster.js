// Roster table: fetch from Supabase and allow filtering/column toggling
// Wait for auth-ready event from auth-roster.js before fetching
const rosterRoot = document.getElementById('roster-table')
let isAuthReady = false

if (rosterRoot) {
  rosterRoot.addEventListener('roster-auth-ready', () => {
    isAuthReady = true
    console.log('Roster auth ready, fetching data...')
    fetchRoster()
  })
}

if (rosterRoot) {
  const dom = {
    head: document.getElementById('roster-head'),
    body: document.getElementById('roster-body'),
    empty: document.getElementById('roster-empty'),
    status: document.getElementById('roster-status'),
    search: document.getElementById('roster-search'),
    divisionFilter: document.getElementById('roster-division-filter'),
    statusFilter: document.getElementById('roster-status-filter'),
    reset: document.getElementById('roster-reset'),
    columnToggles: document.getElementById('roster-column-toggles'),
  }

  const state = {
    rows: [],
    columns: [],
    visibleColumns: new Set(),
    divisionField: null,
    statusField: null,
  }

  const formatValue = (value) => {
    if (value === null || value === undefined) return ''
    if (typeof value === 'string') return value
    if (typeof value === 'number') return String(value)
    if (value instanceof Date) return value.toLocaleString()
    return JSON.stringify(value)
  }

  const setStatus = (message, isError = false) => {
    if (!dom.status) return
    dom.status.textContent = message
    dom.status.classList.toggle('text-red-600', isError)
    dom.status.classList.toggle('text-gray-500', !isError)
  }

  const detectField = (candidates) => {
    return candidates.find((field) => state.rows.some((row) => Object.prototype.hasOwnProperty.call(row, field))) || null
  }

  const buildFilterOptions = () => {
    state.statusField = detectField(['status', 'state', 'availability'])
    state.divisionField = detectField(['division', 'unit', 'department', 'bureau'])

    if (state.statusField && dom.statusFilter) {
      const uniqueStatuses = Array.from(new Set(state.rows.map((row) => row[state.statusField]).filter(Boolean)))
      dom.statusFilter.innerHTML = ['<option value="all">All status types</option>', ...uniqueStatuses.map((val) => `<option value="${val}">${val}</option>`)].join('')
      dom.statusFilter.classList.remove('hidden')
    }

    if (state.divisionField && dom.divisionFilter) {
      const uniqueDivisions = Array.from(new Set(state.rows.map((row) => row[state.divisionField]).filter(Boolean)))
      dom.divisionFilter.innerHTML = ['<option value="all">All divisions</option>', ...uniqueDivisions.map((val) => `<option value="${val}">${val}</option>`)].join('')
      dom.divisionFilter.classList.remove('hidden')
    }
  }

  const renderHead = () => {
    if (!dom.head) return
    dom.head.innerHTML = ''
    const rowEl = document.createElement('tr')
    state.columns.forEach((col) => {
      if (!state.visibleColumns.has(col)) return
      const th = document.createElement('th')
      th.className = 'px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wide'
      th.textContent = col.replace(/_/g, ' ')
      rowEl.appendChild(th)
    })
    dom.head.appendChild(rowEl)
  }

  const renderBody = (filteredRows) => {
    if (!dom.body) return
    dom.body.innerHTML = ''
    filteredRows.forEach((row) => {
      const tr = document.createElement('tr')
      state.columns.forEach((col) => {
        if (!state.visibleColumns.has(col)) return
        const td = document.createElement('td')
        td.className = 'px-4 py-3 text-sm text-gray-800'
        td.textContent = formatValue(row[col]) || '-'
        tr.appendChild(td)
      })
      dom.body.appendChild(tr)
    })
    if (dom.empty) {
      dom.empty.classList.toggle('hidden', filteredRows.length > 0)
    }
  }

  const applyFilters = () => {
    const term = (dom.search?.value || '').trim().toLowerCase()
    const selectedDivision = dom.divisionFilter && !dom.divisionFilter.classList.contains('hidden') ? dom.divisionFilter.value : 'all'
    const selectedStatus = dom.statusFilter && !dom.statusFilter.classList.contains('hidden') ? dom.statusFilter.value : 'all'

    const filtered = state.rows.filter((row) => {
      if (term) {
        const rowText = state.columns
          .map((col) => formatValue(row[col]))
          .join(' ') 
          .toLowerCase()
        if (!rowText.includes(term)) return false
      }

      if (state.divisionField && selectedDivision !== 'all' && row[state.divisionField] !== selectedDivision) return false
      if (state.statusField && selectedStatus !== 'all' && row[state.statusField] !== selectedStatus) return false
      return true
    })

    renderBody(filtered)
    setStatus(`${filtered.length} of ${state.rows.length} records shown`)
  }

  const renderColumnToggles = () => {
    if (!dom.columnToggles) return
    dom.columnToggles.innerHTML = ''
    state.columns.forEach((col) => {
      const id = `roster-col-${col}`
      const label = document.createElement('label')
      label.className = 'inline-flex items-center gap-2'

      const checkbox = document.createElement('input')
      checkbox.type = 'checkbox'
      checkbox.id = id
      checkbox.checked = state.visibleColumns.has(col)
      checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
          state.visibleColumns.add(col)
        } else {
          state.visibleColumns.delete(col)
        }
        renderHead()
        applyFilters()
      })

      const span = document.createElement('span')
      span.textContent = col.replace(/_/g, ' ')

      label.appendChild(checkbox)
      label.appendChild(span)
      dom.columnToggles.appendChild(label)
    })
  }

  const attachListeners = () => {
    dom.search?.addEventListener('input', applyFilters)
    dom.divisionFilter?.addEventListener('change', applyFilters)
    dom.statusFilter?.addEventListener('change', applyFilters)
    dom.reset?.addEventListener('click', () => {
      if (dom.search) dom.search.value = ''
      if (dom.divisionFilter && !dom.divisionFilter.classList.contains('hidden')) dom.divisionFilter.value = 'all'
      if (dom.statusFilter && !dom.statusFilter.classList.contains('hidden')) dom.statusFilter.value = 'all'
      state.visibleColumns = new Set(state.columns)
      renderHead()
      renderColumnToggles()
      applyFilters()
    })
  }

  const validateConfig = () => {
    const supabaseUrl = rosterRoot.dataset.supabaseUrl || window.SUPABASE_URL
    const supabaseKey = rosterRoot.dataset.supabaseKey || window.SUPABASE_ANON_KEY
    return { supabaseUrl, supabaseKey }
  }

  const fetchRoster = async () => {
    const { supabaseUrl, supabaseKey } = validateConfig()
    if (!supabaseUrl || !supabaseKey) {
      setStatus('Add your Supabase URL and anon key to data-supabase-url/key or window.SUPABASE_URL/SUPABASE_ANON_KEY.', true)
      return
    }

    setStatus('Loading roster...')

    const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm')
    const client = createClient(supabaseUrl, supabaseKey)

    const tableName = rosterRoot.dataset.table || 'roster'
    const { data, error } = await client.from(tableName).select('*').limit(200)

    if (error) {
      setStatus(`Error loading roster: ${error.message}`, true)
      return
    }

    state.rows = Array.isArray(data) ? data : []
    if (!state.rows.length) {
      renderBody([])
      setStatus('No roster data found.')
      return
    }

    state.columns = Object.keys(state.rows[0])
    state.visibleColumns = new Set(state.columns)

    buildFilterOptions()
    renderHead()
    renderColumnToggles()
    applyFilters()
  }

  document.addEventListener('DOMContentLoaded', () => {
    attachListeners()
    // Only fetch if auth is already ready, otherwise wait for event
    if (isAuthReady) {
      fetchRoster().catch((err) => setStatus(`Roster failed to load: ${err.message}`, true))
    }
  })
}
