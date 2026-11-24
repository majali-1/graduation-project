import { useMemo, useState } from 'react'
import React from 'react';
import {
  LayoutDashboard, ChartNoAxesCombined, Users, ShieldAlert, Crosshair, TrendingUp,
  Database, ChevronDown, ChevronLeft, ChevronRight, Search, Bell, Settings,
  Menu, X, ArrowUpRight, CircleHelp, Filter, FileSpreadsheet, Upload, UserRound,
  CalendarDays, SlidersHorizontal, MoreHorizontal, PanelLeftClose, PanelLeftOpen
} from 'lucide-react'

type PageId = 'overview' | 'sales' | 'customers' | 'customer360' | 'risk' | 'crosssell' | 'growth' | 'data'
type PageMeta = { id: PageId; label: string; icon: typeof LayoutDashboard; group?: string }
const navItems: PageMeta[] = [
  { id: 'overview', label: 'Executive Overview', icon: LayoutDashboard, group: 'ANALYTICS' },
  { id: 'sales', label: 'Sales Performance', icon: ChartNoAxesCombined },
  { id: 'customers', label: 'Customer Intelligence', icon: Users },
  { id: 'customer360', label: 'Customer 360', icon: UserRound },
  { id: 'risk', label: 'Risk & Retention', icon: ShieldAlert },
  { id: 'crosssell', label: 'Cross-Selling', icon: Crosshair },
  { id: 'growth', label: 'Growth Opportunities', icon: TrendingUp },
  { id: 'data', label: 'Data Management', icon: Database, group: 'WORKSPACE' },
]

const pageTitles: Record<PageId, { title: string; subtitle: string }> = {
  overview: { title: 'Executive Overview', subtitle: 'A consolidated view of sales, customers, health, and opportunities.' },
  sales: { title: 'Sales Performance', subtitle: 'Explore sales performance across regions, sectors, channels, and products.' },
  customers: { title: 'Customer Intelligence', subtitle: 'Understand your customer base, segments, and purchasing behavior.' },
  customer360: { title: 'Customer 360', subtitle: 'A unified customer profile with behavior, risk, and opportunity context.' },
  risk: { title: 'Customer Risk & Retention', subtitle: 'Monitor customer health and retention signals in one place.' },
  crosssell: { title: 'Cross-Selling Opportunities', subtitle: 'Explore product associations and potential customer-product fit.' },
  growth: { title: 'Customer Growth Opportunities', subtitle: 'Identify expansion opportunities and benchmark customer spend.' },
  data: { title: 'Data Management', subtitle: 'Prepare your files and data structure for future integration.' },
}

function App() {
  const [page, setPage] = useState<PageId>('overview')
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [globalFilters, setGlobalFilters] = useState({ period: 'Last 12 months', sector: 'All sectors', region: 'All regions', channel: 'All channels' })
  const [modal, setModal] = useState<string | null>(null)

  const changePage = (next: PageId) => {
    setPage(next)
    setMobileOpen(false)
  }
  const meta = pageTitles[page]

  return <div className="app-shell">
    {mobileOpen && <button className="mobile-overlay" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-visible' : ''}`}>
      <div className="brand">
        <div className="brand-mark"><ChartNoAxesCombined size={19} /></div>
        {!collapsed && <div className="brand-text"><strong>InsightFlow</strong><span>Customer Intelligence</span></div>}
        <button className="icon-button sidebar-collapse" onClick={() => setCollapsed(!collapsed)} aria-label="Toggle sidebar">
          {collapsed ? <PanelLeftOpen size={18}/> : <PanelLeftClose size={18}/>}
        </button>
      </div>
      <nav className="nav-list">
        {navItems.map((item, index) => {
          const Icon = item.icon
          return <React.Fragment key={item.id}>
            {item.group && <div className="nav-group">{!collapsed && item.group}</div>}
            <button className={`nav-item ${page === item.id ? 'active' : ''}`} onClick={() => changePage(item.id)} title={collapsed ? item.label : undefined}>
              <Icon size={18} strokeWidth={1.8}/>
              {!collapsed && <span>{item.label}</span>}
              {page === item.id && <span className="nav-active-dot" />}
            </button>
          </React.Fragment>
        })}
      </nav>
      {!collapsed && <div className="sidebar-bottom">
        <div className="sidebar-help">
          <CircleHelp size={18}/>
          <div><strong>Need help?</strong><span>View setup guide</span></div>
          <ArrowUpRight size={15}/>
        </div>
        <div className="workspace-user">
          <div className="avatar">CI</div><div className="user-meta"><strong>Workspace</strong><span>Frontend preview</span></div><MoreHorizontal size={18}/>
        </div>
      </div>}
    </aside>

    <main className={`main-area ${collapsed ? 'wide-sidebar' : ''}`}>
      <header className="topbar">
        <div className="topbar-left">
          <button className="icon-button mobile-menu-button" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu size={19}/></button>
          <div className="breadcrumb"><span>Workspace</span><span className="crumb-sep">/</span><strong>{meta.title}</strong></div>
        </div>
        <div className="topbar-actions">
          <button className="icon-button notification-button" aria-label="Notifications"><Bell size={18}/><i /></button>
          <div className="topbar-avatar">JD</div>
        </div>
      </header>

      <div className="page-content">
        <div className="page-heading">
          <div><h1>{meta.title}</h1><p>{meta.subtitle}</p></div>
          {page !== 'data' && page !== 'customer360' && <button className="button secondary" onClick={() => setModal('filters')}><SlidersHorizontal size={16}/> Filters</button>}
        </div>
        {page !== 'data' && <GlobalFilters filters={globalFilters} setFilters={setGlobalFilters} compact={page === 'customer360'} />}
        {page === 'overview' && <OverviewPage/>}
        {page === 'sales' && <SalesPage/>}
        {page === 'customers' && <CustomersPage onOpenCustomer={() => changePage('customer360')}/>}
        {page === 'customer360' && <Customer360Page onBack={() => changePage('customers')}/>}
        {page === 'risk' && <RiskPage/>}
        {page === 'crosssell' && <CrossSellPage/>}
        {page === 'growth' && <GrowthPage/>}
        {page === 'data' && <DataManagementPage/>}
        <footer className="page-footer"><span>InsightFlow · Frontend preview</span><span>Awaiting data integration</span></footer>
      </div>
    </main>
    {modal === 'filters' && <Modal title="Dashboard filters" onClose={() => setModal(null)}>
      <p className="modal-copy">Adjust the filters shown across this dashboard. Filter selections are UI-only.</p>
      <GlobalFilters filters={globalFilters} setFilters={setGlobalFilters}/>
      <div className="modal-actions"><button className="button secondary" onClick={() => setGlobalFilters({period:'Last 12 months',sector:'All sectors',region:'All regions',channel:'All channels'})}>Reset</button><button className="button primary" onClick={() => setModal(null)}>Apply filters</button></div>
    </Modal>}
  </div>
}

type Filters = { period: string; sector: string; region: string; channel: string }
function GlobalFilters({ filters, setFilters, compact = false }: { filters: Filters; setFilters: (f: Filters) => void; compact?: boolean }) {
  const set = (key: keyof Filters, value: string) => setFilters({ ...filters, [key]: value })
  return <div className={`filters-bar ${compact ? 'compact' : ''}`}>
    <div className="filter-field"><CalendarDays size={15}/><select value={filters.period} onChange={e => set('period', e.target.value)} aria-label="Date range"><option>Last 12 months</option><option>Last 90 days</option><option>Last 30 days</option><option>Year to date</option><option>Custom range</option></select></div>
    <div className="filter-field"><Filter size={15}/><select value={filters.sector} onChange={e => set('sector', e.target.value)} aria-label="Sector"><option>All sectors</option><option>Sector A</option><option>Sector B</option></select></div>
    <div className="filter-field"><select value={filters.region} onChange={e => set('region', e.target.value)} aria-label="Region"><option>All regions</option><option>Region A</option><option>Region B</option></select></div>
    <div className="filter-field"><select value={filters.channel} onChange={e => set('channel', e.target.value)} aria-label="Channel"><option>All channels</option><option>Direct</option><option>Partner</option><option>Online</option></select></div>
    <button className="reset-filter" onClick={() => setFilters({period:'Last 12 months',sector:'All sectors',region:'All regions',channel:'All channels'})}>Reset</button>
  </div>
}

function KPI({ label, value = '—', caption, icon: Icon, accent = 'blue' }: { label: string; value?: string; caption?: string; icon?: typeof Users; accent?: string }) {
  return <div className="kpi-card">
    <div className="kpi-top"><span>{label}</span>{Icon && <div className={`kpi-icon ${accent}`}><Icon size={17}/></div>}</div>
    <div className="kpi-value">{value}</div>
    {caption && <div className="kpi-caption">{caption}</div>}
  </div>
}
function Panel({ title, subtitle, children, action }: { title: string; subtitle?: string; children?: React.ReactNode; action?: React.ReactNode }) {
  return <section className="panel"><div className="panel-head"><div><h3>{title}</h3>{subtitle && <p>{subtitle}</p>}</div>{action}</div>{children}</section>
}
function EmptyChart({ type = 'line', label = 'Chart visualization' }: { type?: 'line'|'bar'|'area'|'pie'; label?: string }) {
  return <div className={`empty-chart chart-${type}`} aria-label={`${label}, awaiting data`}>
    <div className="chart-grid-lines"><i/><i/><i/><i/></div>
    {type !== 'pie' && <div className="chart-axis-y"><span>—</span><span>—</span><span>—</span><span>—</span></div>}
    <div className="chart-empty-content"><div className="chart-placeholder-icon"><ChartNoAxesCombined size={20}/></div><strong>No data available</strong><span>Chart will populate once data is connected</span></div>
    {type !== 'pie' && <div className="chart-axis-x"><span>—</span><span>—</span><span>—</span><span>—</span><span>—</span></div>}
  </div>
}
function EmptyState({ title = 'No data available', description = 'Data will appear here once your source is connected', icon: Icon = FileSpreadsheet }: { title?: string; description?: string; icon?: typeof FileSpreadsheet }) {
  return <div className="empty-state"><div className="empty-icon"><Icon size={20}/></div><strong>{title}</strong><span>{description}</span></div>
}
function EmptyTable({ columns, title, search = false, action }: { columns: string[]; title?: string; search?: boolean; action?: React.ReactNode }) {
  const [query, setQuery] = useState('')
  return <Panel title={title || 'Details'} action={action || (search ? <div className="table-search"><Search size={14}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search records..." /></div> : undefined)}>
    <div className="table-wrap"><table><thead><tr>{columns.map(col=><th key={col}>{col}</th>)}</tr></thead><tbody><tr><td colSpan={columns.length}><EmptyState title="No data available" description="Records will appear once data is connected." /></td></tr></tbody></table></div>
    <div className="table-pagination"><span>Showing 0 of 0 records</span><div><button disabled><ChevronLeft size={14}/></button><span>Page —</span><button disabled><ChevronRight size={14}/></button></div></div>
  </Panel>
}
function OverviewPage() {
  return <>
    <div className="kpi-grid four"><KPI label="Total Sales" icon={ChartNoAxesCombined}/><KPI label="Active Customers" icon={Users} accent="green"/><KPI label="At-Risk Customers" icon={ShieldAlert} accent="amber"/><KPI label="Growth Opportunities" icon={TrendingUp} accent="violet"/></div>
    <div className="grid-two"><Panel title="Monthly Sales Trend" subtitle="Sales performance over time"><EmptyChart type="line" label="Monthly sales"/></Panel><Panel title="Sales by Sector" subtitle="Distribution across sectors"><EmptyChart type="pie" label="Sector distribution"/></Panel></div>
    <div className="grid-two"><Panel title="Customer Health Summary" subtitle="Customer health overview"><EmptyChart type="bar" label="Customer health"/></Panel><Panel title="Priority Opportunities" subtitle="Opportunities requiring attention"><EmptyState title="Awaiting data integration" description="Priority opportunities will be listed here." icon={TrendingUp}/></Panel></div>
  </>
}
function SalesPage() {
  return <>
    <div className="kpi-grid four"><KPI label="Total Revenue" icon={ChartNoAxesCombined}/><KPI label="Orders" icon={FileSpreadsheet}/><KPI label="Average Order Value" icon={TrendingUp}/><KPI label="Products Sold" icon={Database}/></div>
    <div className="grid-two"><Panel title="Sales by Region" subtitle="Regional sales breakdown"><EmptyChart type="bar"/></Panel><Panel title="Sales by Sector" subtitle="Sector performance"><EmptyChart type="bar"/></Panel></div>
    <div className="grid-two"><Panel title="Sales by Channel" subtitle="Channel contribution"><EmptyChart type="pie"/></Panel><Panel title="Sales by Product" subtitle="Product performance"><EmptyChart type="bar"/></Panel></div>
    <div className="grid-two"><Panel title="Sales Comparison" subtitle="Period-over-period comparison"><EmptyChart type="line"/></Panel><Panel title="Top & Bottom Products" subtitle="Product ranking placeholders"><EmptyState title="No product ranking available" description="Rankings require connected sales data."/></Panel></div>
    <EmptyTable title="Sales Performance Table" columns={['Period','Region','Sector','Channel','Product','Sales','Change']} search/>
  </>
}
function CustomersPage({ onOpenCustomer }: { onOpenCustomer: () => void }) {
  const [segment, setSegment] = useState('All segments')
  return <>
    <div className="kpi-grid four"><KPI label="Total Customers" icon={Users}/><KPI label="Active" icon={UserRound} accent="green"/><KPI label="New Customers" icon={TrendingUp} accent="violet"/><KPI label="Segments" icon={SlidersHorizontal} accent="amber"/></div>
    <Panel title="Customer Segmentation (RFM)" subtitle="Recency, frequency, and monetary segment overview"><EmptyChart type="bar" label="RFM segments"/></Panel>
    <EmptyTable title="Customer Directory" columns={['Customer','Sector','Region','Last Purchase','Total Spend','Status','Actions']} search action={<select className="small-select" value={segment} onChange={e=>setSegment(e.target.value)}><option>All segments</option><option>Champions</option><option>Loyal</option><option>At risk</option><option>New</option></select>}/>
    <Panel title="Customer Purchasing History" subtitle="Purchase activity and product history"><EmptyChart type="line"/></Panel>
    <div className="inline-callout"><div className="callout-icon"><UserRound size={18}/></div><div><strong>Customer 360 profile</strong><p>Open a customer profile to explore the unified customer detail layout.</p></div><button className="button primary" onClick={onOpenCustomer}>Open Customer 360 <ArrowUpRight size={15}/></button></div>
  </>
}
function Customer360Page({ onBack }: { onBack: () => void }) {
  const [tab, setTab] = useState('Overview')
  return <>
    <div className="profile-toolbar"><button className="button secondary" onClick={onBack}><ChevronLeft size={16}/> Customer directory</button><span className="record-label">Profile placeholder · No customer selected</span></div>
    <div className="profile-header"><div className="profile-avatar"><UserRound size={24}/></div><div className="profile-title"><h2>Customer profile</h2><p>Customer identity and details awaiting data integration</p></div><span className="status-chip neutral">Status unavailable</span></div>
    <div className="kpi-grid four"><KPI label="Total Spend"/><KPI label="Orders"/><KPI label="Last Purchase"/><KPI label="Risk Status"/></div>
    <div className="tab-bar">{['Overview','Purchasing Behavior','Risk & Retention','Opportunities'].map(t=><button key={t} className={tab===t?'selected':''} onClick={()=>setTab(t)}>{t}</button>)}</div>
    {tab==='Overview' && <div className="grid-two"><Panel title="Customer Information"><EmptyState title="No customer selected" description="Profile details will appear when a customer is selected."/></Panel><Panel title="Purchasing Behavior"><EmptyChart type="line"/></Panel></div>}
    {tab==='Purchasing Behavior' && <><Panel title="Purchase Trends"><EmptyChart type="line"/></Panel><EmptyTable title="Purchasing History" columns={['Date','Order','Product','Category','Quantity','Amount']}/></>}
    {tab==='Risk & Retention' && <div className="grid-two"><Panel title="Customer Risk Status"><EmptyState title="Risk status unavailable"/></Panel><Panel title="Risk Explanation"><EmptyState title="Awaiting customer data"/></Panel></div>}
    {tab==='Opportunities' && <div className="grid-two"><Panel title="Growth Opportunities"><EmptyState title="No opportunities available"/></Panel><Panel title="Product Recommendations"><EmptyState title="Awaiting data integration"/></Panel></div>}
  </>
}
function RiskPage() {
  return <>
    <div className="kpi-grid three"><KPI label="Declining Customers" icon={TrendingUp} accent="amber"/><KPI label="At-Risk Customers" icon={ShieldAlert} accent="red"/><KPI label="Lost Customers" icon={Users} accent="gray"/></div>
    <div className="grid-two"><Panel title="Customer Purchasing Decline" subtitle="Purchasing activity indicators"><EmptyChart type="line"/></Panel><Panel title="Risk Overview" subtitle="Risk distribution placeholder"><EmptyChart type="pie"/></Panel></div>
    <EmptyTable title="Customer Risk Table" columns={['Customer','Last Purchase','Purchase Change','Risk Level','Risk Indicator','Status']} search/>
    <Panel title="Risk Explanation" subtitle="Context and explanation will be provided once risk logic is integrated"><EmptyState title="Risk explanations unavailable" description="No risk analysis is generated in this frontend preview."/></Panel>
  </>
}
function CrossSellPage() {
  const [customer, setCustomer] = useState('Select customer')
  const [product, setProduct] = useState('Select product')
  return <>
    <div className="selection-toolbar"><div className="filter-field"><Users size={15}/><select value={customer} onChange={e=>setCustomer(e.target.value)}><option>Select customer</option><option>Customer list unavailable</option></select></div><div className="filter-field"><Database size={15}/><select value={product} onChange={e=>setProduct(e.target.value)}><option>Select product</option><option>Product catalog unavailable</option></select></div><button className="button primary" onClick={()=>{setCustomer('Select customer');setProduct('Select product')}}>Clear selection</button></div>
    <Panel title="Product Association Visualization" subtitle="Product relationships will be visualized after data integration"><EmptyChart type="pie"/></Panel>
    <EmptyTable title="Product Recommendations" columns={['Customer','Recommended Product','Category','Association','Opportunity']} search/>
    <div className="grid-two"><Panel title="Recommendation Explanation"><EmptyState title="No recommendation available" description="Recommendation logic is not implemented."/></Panel><Panel title="Selected Customer / Product"><EmptyState title="No selection" description="Choose a customer and product to display details."/></Panel></div>
  </>
}
function GrowthPage() {
  return <>
    <div className="kpi-grid four"><KPI label="Growth Opportunities" icon={TrendingUp} accent="violet"/><KPI label="Expansion Potential" icon={ChartNoAxesCombined}/><KPI label="Customers to Expand" icon={Users} accent="green"/><KPI label="Category Gaps" icon={Database} accent="amber"/></div>
    <EmptyTable title="Customer Growth Ranking" columns={['Rank','Customer','Current Spend','Peer Benchmark','Growth Potential','Opportunity']} search/>
    <div className="grid-two"><Panel title="Customer Spend vs. Peer Benchmark" subtitle="Benchmark comparison placeholder"><EmptyChart type="bar"/></Panel><Panel title="Missing Product Categories" subtitle="Potential category expansion"><EmptyChart type="pie"/></Panel></div>
    <Panel title="Growth Opportunity Summary"><EmptyState title="No growth opportunities available" description="Growth analysis will be available when company data is connected."/></Panel>
  </>
}
function DataManagementPage() {
  const [file, setFile] = useState<File | null>(null)
  const [modal, setModal] = useState(false)
  const [status, setStatus] = useState('Not started')
  const columns = ['Customer ID','Customer Name','Date','Product','Category','Quantity','Sales Amount','Region','Sector','Channel']
  return <>
    <div className="data-stepper"><div className="step active"><span>1</span> Upload</div><div className="step"><span>2</span> Mapping</div><div className="step"><span>3</span> Preview</div><div className="step"><span>4</span> Quality</div></div>
    <div className="upload-card"><div className="upload-icon"><Upload size={22}/></div><h3>Upload your data file</h3><p>Choose a CSV or Excel file to begin preparing your data</p><label className="button primary file-picker">Browse files<input type="file" accept=".csv,.xls,.xlsx" onChange={e=>{setFile(e.target.files?.[0] || null);setStatus(e.target.files?.[0] ? 'File selected' : 'Not started')}}/></label><span className="upload-note">Supported formats: CSV, XLS, XLSX</span>{file && <div className="file-selected"><FileSpreadsheet size={17}/><div><strong>{file.name}</strong><span>{(file.size/1024).toFixed(1)} KB · Selected locally</span></div><button className="icon-button" onClick={()=>{setFile(null);setStatus('Not started')}}><X size={16}/></button></div>}</div>
    <div className="grid-two"><Panel title="Column Mapping" subtitle="Assign source columns to the expected data fields"><div className="mapping-list">{columns.map((c,i)=><div className="mapping-row" key={c}><span>{c}</span><select defaultValue=""><option value="">Select source column</option><option>Column A</option><option>Column B</option><option>Column C</option></select></div>)}</div><div className="panel-footer"><button className="button secondary" onClick={()=>setModal(true)}>Mapping help</button></div></Panel><Panel title="Data Processing Status" subtitle="UI status only — processing is not connected"><div className="processing-box"><div className="processing-status"><span className="status-dot"/><strong>{status}</strong></div><div className="progress-track"><div className="progress-fill" style={{width:'0%'}}/></div><div className="progress-label"><span>Progress</span><span>0%</span></div><EmptyState title="No processing activity" description="File validation and processing will be added later."/></div></Panel></div>
    <Panel title="Data Preview" subtitle="Preview table layout for imported records"><div className="table-wrap"><table><thead><tr>{columns.slice(0,6).map(c=><th key={c}>{c}</th>)}</tr></thead><tbody><tr><td colSpan={6}><EmptyState title="No preview available" description="Upload and map a file to preview data (preview logic not implemented)."/></td></tr></tbody></table></div></Panel>
    <Panel title="Data Quality Report" subtitle="Quality metrics placeholder"><div className="kpi-grid four quality-kpis"><KPI label="Completeness"/><KPI label="Duplicates"/><KPI label="Invalid Values"/><KPI label="Warnings"/></div><EmptyState title="Quality report unavailable" description="Data quality checks are not implemented in this frontend."/></Panel>
    {modal && <Modal title="Column mapping help" onClose={()=>setModal(false)}><p className="modal-copy">Match each expected field to a column in your source file. This interface is a placeholder and does not validate or process files.</p><div className="modal-actions"><button className="button primary" onClick={()=>setModal(false)}>Got it</button></div></Modal>}
  </>
}
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return <div className="modal-backdrop" onClick={onClose}><div className="modal-card" onClick={e=>e.stopPropagation()}><div className="modal-header"><h3>{title}</h3><button className="icon-button" onClick={onClose}><X size={18}/></button></div>{children}</div></div>
}
export default App
