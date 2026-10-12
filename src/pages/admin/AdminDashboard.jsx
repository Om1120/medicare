import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  UserCheck, 
  Building2, 
  Users, 
  Calendar, 
  Receipt, 
  CreditCard, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Plus,
  ArrowRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line 
} from 'recharts';
import AdminSidebar from '../../components/AdminSidebar';
import { formatCurrency, formatDate, getStatusBadgeClass } from '../../utils/helpers';

const COLORS = ['#0B6E99', '#16A6A3', '#22A06B', '#F59E0B', '#DC3545', '#8B5CF6', '#EC4899', '#3B82F6'];

const AdminDashboard = () => {
  const hospitals = useSelector(state => state.hospitals?.items || state.hospitals?.hospitals || []);
  const doctors = useSelector(state => state.doctors?.doctors || state.doctors?.items || []);
  const departments = useSelector(state => state.departments?.departments || state.departments?.items || []);
  const facilities = useSelector(state => state.facilities?.facilities || state.facilities?.items || []);
  const patients = useSelector(state => state.patients?.patients || state.patients?.items || []);
  const appointments = useSelector(state => state.appointments?.appointments || state.appointments?.items || []);
  const bills = useSelector(state => state.bills?.bills || state.bills?.items || []);
  const payments = useSelector(state => state.payments?.payments || state.payments?.items || []);

  // Defensive array wrappers
  const safePayments = Array.isArray(payments) ? payments : [];
  const safeBills = Array.isArray(bills) ? bills : [];
  const safeAppointments = Array.isArray(appointments) ? appointments : [];
  const safeDoctors = Array.isArray(doctors) ? doctors : [];
  const safePatients = Array.isArray(patients) ? patients : [];
  const safeHospitals = Array.isArray(hospitals) ? hospitals : [];

  // Computed metrics
  const totalRevenue = safePayments.reduce((acc, curr) => acc + (Number(curr?.amount) || 0), 0);
  const pendingBillsCount = safeBills.filter(b => b?.paymentStatus === 'Pending').length;
  const todayAppointments = safeAppointments.filter(a => a?.status === 'Confirmed' || a?.status === 'Pending').slice(0, 5);

  // Appointments by Department data for Chart
  const deptCountMap = {};
  safeAppointments.forEach(a => {
    const dept = a?.department || 'General';
    deptCountMap[dept] = (deptCountMap[dept] || 0) + 1;
  });
  const deptChartData = Object.keys(deptCountMap).map(dept => ({
    name: dept.length > 12 ? dept.substring(0, 10) + '..' : dept,
    fullName: dept,
    count: deptCountMap[dept]
  }));

  // Monthly Revenue Trend
  const revenueTrendData = [
    { month: 'May', amount: 320000 },
    { month: 'Jun', amount: 410000 },
    { month: 'Jul', amount: 385000 },
    { month: 'Aug', amount: 490000 },
    { month: 'Sep', amount: 562000 },
    { month: 'Oct', amount: totalRevenue || 620000 }
  ];

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main" aria-label="Admin Dashboard Main Panel">
        
        {/* Welcome Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.85rem', color: 'var(--primary-dark)', marginBottom: '0.35rem' }}>
              Healthcare Platform Administration
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
              System administration: hospitals, medical specialists, clinical departments, patient appointments, and payments.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/admin/hospitals" className="btn btn-outline-primary btn-sm">
              <Building2 size={15} />
              <span>Manage Hospitals</span>
            </Link>
            <Link to="/admin/appointments" className="btn btn-outline-secondary btn-sm">
              <Calendar size={15} />
              <span>Appointments</span>
            </Link>
            <Link to="/admin/doctors" className="btn btn-primary btn-sm">
              <Plus size={15} />
              <span>Add Doctor</span>
            </Link>
          </div>
        </div>

        {/* Metric Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
          
          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
              <Building2 size={26} />
            </div>
            <div>
              <div className="stat-value">{safeHospitals.length || 6}</div>
              <div className="stat-label">Hospitals</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: 'var(--teal-light)', color: 'var(--teal)' }}>
              <UserCheck size={26} />
            </div>
            <div>
              <div className="stat-value">{safeDoctors.length}</div>
              <div className="stat-label">Total Doctors</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: 'var(--info-bg)', color: 'var(--info)' }}>
              <Users size={26} />
            </div>
            <div>
              <div className="stat-value">{safePatients.length}</div>
              <div className="stat-label">Total Patients</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success)' }}>
              <Calendar size={26} />
            </div>
            <div>
              <div className="stat-value">{safeAppointments.length}</div>
              <div className="stat-label">Appointments</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: 'var(--warning-bg)', color: '#B45309' }}>
              <Receipt size={26} />
            </div>
            <div>
              <div className="stat-value">{pendingBillsCount}</div>
              <div className="stat-label">Pending Invoices</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: '#EDE9FE', color: '#7C3AED' }}>
              <CreditCard size={26} />
            </div>
            <div>
              <div className="stat-value">{formatCurrency(totalRevenue)}</div>
              <div className="stat-label">Total Revenue</div>
            </div>
          </div>

        </div>

        {/* Charts Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.75rem', marginBottom: '2.5rem' }}>
          
          {/* Chart 1: Appointments by Department */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-dark)', marginBottom: '1.25rem' }}>
              Appointments by Department
            </h3>
            <div style={{ width: '100%', height: '260px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" fontSize={11} interval={0} angle={-20} textAnchor="end" />
                  <YAxis fontSize={11} allowDecimals={false} />
                  <Tooltip
                    formatter={(val) => [`${val} appointments`, 'Volume']}
                    labelFormatter={(name, item) => item?.[0]?.payload?.fullName || name}
                  />
                  <Bar dataKey="count" fill="var(--primary)" radius={[4, 4, 0, 0]}>
                    {deptChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Monthly Payments Trend */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-dark)', marginBottom: '1.25rem' }}>
              Monthly Revenue Trends (INR)
            </h3>
            <div style={{ width: '100%', height: '260px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis fontSize={11} tickFormatter={(val) => `₹${val/1000}k`} />
                  <Tooltip formatter={(val) => [formatCurrency(val), 'Revenue']} />
                  <Line type="monotone" dataKey="amount" stroke="var(--teal)" strokeWidth={3} dot={{ r: 5, fill: 'var(--teal)' }} activeDot={{ r: 7 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Recent Appointments Table Overview */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-dark)', margin: 0 }}>
              Recent Patient Appointments
            </h3>
            <Link to="/admin/appointments" style={{ fontSize: '0.85rem', fontWeight: '600' }}>
              View All ({appointments.length})
            </Link>
          </div>

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Ticket #</th>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Department</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {todayAppointments.map((apt) => (
                  <tr key={apt.id}>
                    <td><strong style={{ color: 'var(--primary-dark)' }}>{apt.id}</strong></td>
                    <td>
                      <div style={{ fontWeight: '600' }}>{apt.patientName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{apt.patientContact}</div>
                    </td>
                    <td>{apt.doctorName}</td>
                    <td><span className="badge badge-neutral">{apt.department}</span></td>
                    <td>{formatDate(apt.date)} {apt.time}</td>
                    <td>
                      <span className={`badge ${getStatusBadgeClass(apt.status)}`}>
                        {apt.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
};

export default AdminDashboard;
