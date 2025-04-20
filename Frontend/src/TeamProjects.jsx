import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Simple particle background component (reused)
const ParticleBackground = () => {
  return (
    <div className="particle-background">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            animationDuration: `${Math.random() * 10 + 5}s`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
    </div>
  );
};

// Dashboard card component (reused)
const DashboardCard = ({ title, icon, children, className }) => {
  return (
    <div className={`dashboard-card ${className || ''}`}>
      <div className="card-header">
        <span className="card-icon">{icon}</span>
        <h2>{title}</h2>
      </div>
      <div className="card-content">
        {children}
      </div>
    </div>
  );
};

// Main TeamProjects component
const TeamProjects = () => {
  // State for teams and team management
  const [teams, setTeams] = useState(() => {
    const savedTeams = localStorage.getItem('workeaseTeams');
    return savedTeams ? JSON.parse(savedTeams) : [
      {
        id: 1,
        name: "Design Team",
        members: [
          { id: 1, name: "John Doe", email: "john@example.com", avatar: "JD" },
          { id: 2, name: "Lisa Chen", email: "lisa@example.com", avatar: "LC" }
        ],
        tasks: [
          { id: 1, name: "Redesign homepage", assignedTo: 1, dueDate: "2025-04-25", status: "In Progress" },
          { id: 2, name: "Create new logo", assignedTo: 2, dueDate: "2025-04-28", status: "Not Started" }
        ]
      },
      {
        id: 2,
        name: "Development Team",
        members: [
          { id: 3, name: "Alex Smith", email: "alex@example.com", avatar: "AS" },
          { id: 4, name: "Maya Patel", email: "maya@example.com", avatar: "MP" }
        ],
        tasks: [
          { id: 3, name: "Fix login bug", assignedTo: 3, dueDate: "2025-04-22", status: "Completed" },
          { id: 4, name: "Implement new API", assignedTo: 4, dueDate: "2025-04-30", status: "In Progress" }
        ]
      }
    ];
  });

  const [showNewTeamModal, setShowNewTeamModal] = useState(false);
  const [showTeamTaskModal, setShowTeamTaskModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [currentTeam, setCurrentTeam] = useState(null);
  const [newTeamName, setNewTeamName] = useState('');
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newTask, setNewTask] = useState({
    name: '',
    assignedTo: '',
    dueDate: '',
    status: 'Not Started'
  });
  const [activeTab, setActiveTab] = useState('teams');
  
  // Save teams to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('workeaseTeams', JSON.stringify(teams));
  }, [teams]);

  // Handle creating a new team
  const handleCreateTeam = (e) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;
    
    const newTeam = {
      id: Date.now(),
      name: newTeamName,
      members: [],
      tasks: []
    };
    
    setTeams([...teams, newTeam]);
    setNewTeamName('');
    setShowNewTeamModal(false);
  };

  // Handle adding a new member to a team
  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newMemberName.trim() || !newMemberEmail.trim() || !currentTeam) return;
    
    // Get initials for avatar
    const nameParts = newMemberName.split(' ');
    const avatar = nameParts.length > 1 
      ? `${nameParts[0][0]}${nameParts[1][0]}`
      : newMemberName.substring(0, 2);
    
    const newMember = {
      id: Date.now(),
      name: newMemberName,
      email: newMemberEmail,
      avatar: avatar.toUpperCase()
    };
    
    const updatedTeams = teams.map(team => {
      if (team.id === currentTeam.id) {
        return {
          ...team,
          members: [...team.members, newMember]
        };
      }
      return team;
    });
    
    setTeams(updatedTeams);
    setNewMemberName('');
    setNewMemberEmail('');
    setShowAddMemberModal(false);
  };

  // Handle assigning a new task
  const handleAssignTask = (e) => {
    e.preventDefault();
    if (!newTask.name.trim() || !newTask.assignedTo || !newTask.dueDate || !currentTeam) return;
    
    const newTaskObj = {
      id: Date.now(),
      name: newTask.name,
      assignedTo: parseInt(newTask.assignedTo),
      dueDate: newTask.dueDate,
      status: newTask.status
    };
    
    const updatedTeams = teams.map(team => {
      if (team.id === currentTeam.id) {
        return {
          ...team,
          tasks: [...team.tasks, newTaskObj]
        };
      }
      return team;
    });
    
    setTeams(updatedTeams);
    setNewTask({
      name: '',
      assignedTo: '',
      dueDate: '',
      status: 'Not Started'
    });
    setShowTeamTaskModal(false);
  };

  // Handle updating a task status
  const handleUpdateTaskStatus = (teamId, taskId, newStatus) => {
    const updatedTeams = teams.map(team => {
      if (team.id === teamId) {
        return {
          ...team,
          tasks: team.tasks.map(task => {
            if (task.id === taskId) {
              return {
                ...task,
                status: newStatus
              };
            }
            return task;
          })
        };
      }
      return team;
    });
    
    setTeams(updatedTeams);
  };

  // Get member name by ID from current team
  const getMemberName = (teamId, memberId) => {
    const team = teams.find(t => t.id === teamId);
    if (!team) return 'Unknown';
    
    const member = team.members.find(m => m.id === memberId);
    return member ? member.name : 'Unknown';
  };

  // Format date to be more readable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Get status color class
  const getStatusClass = (status) => {
    switch(status) {
      case 'Completed': return 'status-completed';
      case 'In Progress': return 'status-progress';
      case 'Not Started': return 'status-not-started';
      default: return '';
    }
  };

  return (
    <div className="dashboard">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-logo">
            <Link to="/" className="logo-link">
              <span className="logo-icon">🚀</span>
              <span className="logo-text">WorkEase</span>
            </Link>
          </div>
          
          <div className="navbar-links">
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/team-projects" className="nav-link active">Team Projects</Link>
            <Link to="/dashboard#calendar" className="nav-link">Calendar</Link>
            <a href="#" className="nav-link">Reports</a>
          </div>
          
          <div className="navbar-profile">
            <div className="profile-avatar">
              <span>JD</span>
            </div>
          </div>
        </div>
      </nav>
      
      <ParticleBackground />
      
      <div className="dashboard-content">
        <h1 className="dashboard-title text-center">Team Projects</h1>
        
        <div className="tabs">
          <button 
            className={`tab-button ${activeTab === 'teams' ? 'active' : ''}`}
            onClick={() => setActiveTab('teams')}
          >
            My Teams
          </button>
          <button 
            className={`tab-button ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tasks')}
          >
            Team Tasks
          </button>
        </div>
        
        {activeTab === 'teams' && (
          <>
            <div className="action-bar">
              <button 
                className="action-button"
                onClick={() => setShowNewTeamModal(true)}
              >
                Create New Team
              </button>
            </div>
            
            <div className="teams-grid">
              {teams.map(team => (
                <DashboardCard 
                  key={team.id} 
                  title={team.name} 
                  icon="👥"
                  className="team-card"
                >
                  <div className="team-members">
                    <div className="section-heading">
                      <h3>Team Members</h3>
                      <button 
                        className="small-action-button"
                        onClick={() => {
                          setCurrentTeam(team);
                          setShowAddMemberModal(true);
                        }}
                      >
                        Add
                      </button>
                    </div>
                    
                    {team.members.length === 0 ? (
                      <div className="empty-message">No members yet</div>
                    ) : (
                      <div className="member-list">
                        {team.members.map(member => (
                          <div key={member.id} className="member-item">
                            <div className="member-avatar">
                              <span>{member.avatar}</span>
                            </div>
                            <div className="member-info">
                              <div className="member-name">{member.name}</div>
                              <div className="member-email">{member.email}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="team-tasks-section">
                    <div className="section-heading">
                      <h3>Current Tasks</h3>
                      <button 
                        className="small-action-button"
                        onClick={() => {
                          setCurrentTeam(team);
                          setShowTeamTaskModal(true);
                        }}
                      >
                        Assign
                      </button>
                    </div>
                    
                    {team.tasks.length === 0 ? (
                      <div className="empty-message">No tasks assigned</div>
                    ) : (
                      <div className="task-list">
                        {team.tasks.slice(0, 3).map(task => (
                          <div key={task.id} className="task-item">
                            <div className="task-content">
                              <span className="task-name">{task.name}</span>
                              <div className="task-meta">
                                <span className="task-assignee">
                                  {getMemberName(team.id, task.assignedTo)}
                                </span>
                                <span className="task-due">
                                  Due: {formatDate(task.dueDate)}
                                </span>
                              </div>
                            </div>
                            <div className={`task-status ${getStatusClass(task.status)}`}>
                              {task.status}
                            </div>
                          </div>
                        ))}
                        {team.tasks.length > 3 && (
                          <div className="view-more">
                            +{team.tasks.length - 3} more tasks
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </DashboardCard>
              ))}
              
              {teams.length === 0 && (
                <div className="empty-state">
                  <div className="empty-icon">👥</div>
                  <h3>No Teams Yet</h3>
                  <p>Create your first team to start collaborating</p>
                  <button 
                    className="action-button"
                    onClick={() => setShowNewTeamModal(true)}
                  >
                    Create New Team
                  </button>
                </div>
              )}
            </div>
          </>
        )}
        
        {activeTab === 'tasks' && (
          <div className="team-tasks-dashboard">
            <div className="tasks-columns">
              <div className="tasks-column not-started">
                <h3 className="column-heading">Not Started</h3>
                {teams.flatMap(team => 
                  team.tasks
                    .filter(task => task.status === 'Not Started')
                    .map(task => (
                      <div key={`${team.id}-${task.id}`} className="task-card">
                        <div className="task-card-header">
                          <div className="task-card-team">{team.name}</div>
                          <div className="task-card-due">Due: {formatDate(task.dueDate)}</div>
                        </div>
                        <div className="task-card-name">{task.name}</div>
                        <div className="task-card-assignee">
                          Assigned to: {getMemberName(team.id, task.assignedTo)}
                        </div>
                        <div className="task-card-actions">
                          <button 
                            className="status-action-button"
                            onClick={() => handleUpdateTaskStatus(team.id, task.id, 'In Progress')}
                          >
                            Start
                          </button>
                        </div>
                      </div>
                    ))
                )}
                {!teams.some(team => team.tasks.some(task => task.status === 'Not Started')) && (
                  <div className="column-empty">No tasks in this category</div>
                )}
              </div>
              
              <div className="tasks-column in-progress">
                <h3 className="column-heading">In Progress</h3>
                {teams.flatMap(team => 
                  team.tasks
                    .filter(task => task.status === 'In Progress')
                    .map(task => (
                      <div key={`${team.id}-${task.id}`} className="task-card">
                        <div className="task-card-header">
                          <div className="task-card-team">{team.name}</div>
                          <div className="task-card-due">Due: {formatDate(task.dueDate)}</div>
                        </div>
                        <div className="task-card-name">{task.name}</div>
                        <div className="task-card-assignee">
                          Assigned to: {getMemberName(team.id, task.assignedTo)}
                        </div>
                        <div className="task-card-actions">
                          <button 
                            className="status-action-button complete"
                            onClick={() => handleUpdateTaskStatus(team.id, task.id, 'Completed')}
                          >
                            Complete
                          </button>
                        </div>
                      </div>
                    ))
                )}
                {!teams.some(team => team.tasks.some(task => task.status === 'In Progress')) && (
                  <div className="column-empty">No tasks in this category</div>
                )}
              </div>
              
              <div className="tasks-column completed">
                <h3 className="column-heading">Completed</h3>
                {teams.flatMap(team => 
                  team.tasks
                    .filter(task => task.status === 'Completed')
                    .map(task => (
                      <div key={`${team.id}-${task.id}`} className="task-card">
                        <div className="task-card-header">
                          <div className="task-card-team">{team.name}</div>
                          <div className="task-card-due">Completed</div>
                        </div>
                        <div className="task-card-name">{task.name}</div>
                        <div className="task-card-assignee">
                          Completed by: {getMemberName(team.id, task.assignedTo)}
                        </div>
                      </div>
                    ))
                )}
                {!teams.some(team => team.tasks.some(task => task.status === 'Completed')) && (
                  <div className="column-empty">No tasks in this category</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* New Team Modal */}
      {showNewTeamModal && (
        <div className="modal-overlay" onClick={() => setShowNewTeamModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 className="modal-title">Create New Team</h3>
            <form onSubmit={handleCreateTeam}>
              <div className="form-group">
                <label htmlFor="teamName">Team Name</label>
                <input
                  type="text"
                  id="teamName"
                  className="modal-input"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="Enter team name"
                  autoFocus
                />
              </div>
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => setShowNewTeamModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  Create Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Add Member Modal */}
      {showAddMemberModal && currentTeam && (
        <div className="modal-overlay" onClick={() => setShowAddMemberModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 className="modal-title">Add Team Member to {currentTeam.name}</h3>
            <form onSubmit={handleAddMember}>
              <div className="form-group">
                <label htmlFor="memberName">Name</label>
                <input
                  type="text"
                  id="memberName"
                  className="modal-input"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="Enter member name"
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label htmlFor="memberEmail">Email</label>
                <input
                  type="email"
                  id="memberEmail"
                  className="modal-input"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  placeholder="Enter member email"
                />
              </div>
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => setShowAddMemberModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Assign Task Modal */}
      {showTeamTaskModal && currentTeam && (
        <div className="modal-overlay" onClick={() => setShowTeamTaskModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 className="modal-title">Assign Task to {currentTeam.name}</h3>
            <form onSubmit={handleAssignTask}>
              <div className="form-group">
                <label htmlFor="taskName">Task Name</label>
                <input
                  type="text"
                  id="taskName"
                  className="modal-input"
                  value={newTask.name}
                  onChange={(e) => setNewTask({...newTask, name: e.target.value})}
                  placeholder="Enter task name"
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label htmlFor="assignee">Assign To</label>
                <select
                  id="assignee"
                  className="modal-input"
                  value={newTask.assignedTo}
                  onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
                >
                  <option value="">Select team member</option>
                  {currentTeam.members.map(member => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="dueDate">Due Date</label>
                <input
                  type="date"
                  id="dueDate"
                  className="modal-input"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  className="modal-input"
                  value={newTask.status}
                  onChange={(e) => setNewTask({...newTask, status: e.target.value})}
                >
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => setShowTeamTaskModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-button">
                  Assign Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamProjects; 