import React, { useRef, useState, useEffect } from 'react';

// Navbar component
const Navbar = ({ activeSection, setActiveSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <span className="logo-icon">🚀</span>
          <span className="logo-text">WorkEase</span>
        </div>
        
        <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
          <a 
            href="#dashboard" 
            className={`nav-link ${activeSection === 'dashboard' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('dashboard');
            }}
          >
            Dashboard
          </a>
          <a href="#" className="nav-link">Projects</a>
          <a 
            href="#calendar" 
            className={`nav-link ${activeSection === 'calendar' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('calendar');
            }}
          >
            Calendar
          </a>
          <a href="#" className="nav-link">Reports</a>
        </div>
        
        <div className="navbar-profile">
          <div className="profile-avatar">
            <span>JD</span>
          </div>
          <button className="menu-toggle" onClick={toggleMenu}>
            <div className={`menu-icon ${isMenuOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
};

// Simple particle background component
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

// Dashboard card component
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

// ToDo list component
const TodoList = ({ tasks, setTasks }) => {
  const [newTask, setNewTask] = useState('');
  const [newTime, setNewTime] = useState('');
  const [newDate, setNewDate] = useState('');
  const [category, setCategory] = useState('professional');
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragOverTask, setDragOverTask] = useState(null);
  
  // Save to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('workeaseTasks', JSON.stringify(tasks));
  }, [tasks]);
  
  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    
    const task = {
      id: Date.now(),
      name: newTask,
      time: newTime || '',
      date: newDate || new Date().toISOString().split('T')[0], // Default to today if no date
      category,
      completed: false
    };
    
    setTasks([...tasks, task]);
    setNewTask('');
    setNewTime('');
    setNewDate('');
  };
  
  const toggleComplete = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };
  
  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Handle drag start
  const handleDragStart = (e, taskId) => {
    setDraggedTask(taskId);
    // Add dragging class for style
    e.currentTarget.classList.add('dragging');
  };
  
  // Handle drag end
  const handleDragEnd = (e) => {
    setDraggedTask(null);
    setDragOverTask(null);
    // Remove dragging class
    e.currentTarget.classList.remove('dragging');
  };
  
  // Handle drag over another task
  const handleDragOver = (e, taskId) => {
    e.preventDefault(); // Necessary to allow drop
    if (draggedTask !== taskId) {
      setDragOverTask(taskId);
    }
  };
  
  // Handle drop - reorder tasks
  const handleDrop = (e, targetId, category) => {
    e.preventDefault();
    
    if (!draggedTask || draggedTask === targetId) return;
    
    const tasksCopy = [...tasks];
    const draggedTaskObj = tasksCopy.find(task => task.id === draggedTask);
    const targetTaskObj = tasksCopy.find(task => task.id === targetId);
    
    // Only allow reordering within the same category
    if (draggedTaskObj.category !== targetTaskObj.category) return;
    
    // Find indices
    const draggedIndex = tasksCopy.findIndex(task => task.id === draggedTask);
    const targetIndex = tasksCopy.findIndex(task => task.id === targetId);
    
    // Remove dragged task from array
    tasksCopy.splice(draggedIndex, 1);
    
    // Insert at new position
    tasksCopy.splice(targetIndex, 0, draggedTaskObj);
    
    setTasks(tasksCopy);
    setDraggedTask(null);
    setDragOverTask(null);
  };

  // Get today's date
  const today = new Date().toISOString().split('T')[0];
  
  // Filter tasks by category and today's date
  const personalTasks = tasks.filter(task => task.category === 'personal' && task.date === today);
  const professionalTasks = tasks.filter(task => task.category === 'professional' && task.date === today);
  
  // TaskList component to render tasks for a specific category
  const TaskList = ({ categoryTasks, category }) => (
    <div className="tasks-container">
      {categoryTasks.length === 0 ? (
        <div className="no-tasks">No tasks in this category for today</div>
      ) : (
        categoryTasks.map(task => (
          <div 
            key={task.id} 
            className={`task-item ${task.completed ? 'completed' : ''} ${dragOverTask === task.id ? 'drag-over' : ''}`}
            draggable={true}
            onDragStart={(e) => handleDragStart(e, task.id)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => handleDragOver(e, task.id)}
            onDrop={(e) => handleDrop(e, task.id, category)}
          >
            <div className="task-content">
              <div className="drag-handle" title="Drag to reorder">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <input 
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleComplete(task.id)}
                className="task-checkbox"
              />
              <span className={task.completed ? 'task-name completed-text' : 'task-name'}>
                {task.name}
              </span>
            </div>
            <div className="task-actions">
              <span className="task-time">{task.time}</span>
              <button 
                onClick={() => deleteTask(task.id)}
                className="delete-btn"
                aria-label="Delete task"
                title="Delete task"
              >
                ×
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
  
  return (
    <div className="todo-list">
      <form onSubmit={addTask} className="add-task-form">
        <input 
          type="text" 
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          className="task-input"
        />
        <input 
          type="time" 
          value={newTime}
          onChange={(e) => setNewTime(e.target.value)}
          className="time-input"
        />
        <input 
          type="date" 
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
          className="date-input"
        />
        <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)}
          className="category-select"
        >
          <option value="professional">Professional</option>
          <option value="personal">Personal</option>
        </select>
        <button type="submit" className="add-btn">Add</button>
      </form>

      <div className="task-categories">
        <div className="category-column">
          <h3 className="category-title">Professional Tasks</h3>
          <TaskList categoryTasks={professionalTasks} category="professional" />
        </div>
        <div className="category-column">
          <h3 className="category-title">Personal Tasks</h3>
          <TaskList categoryTasks={personalTasks} category="personal" />
        </div>
      </div>
    </div>
  );
};

// Task item component (for upcoming events)
const TaskItem = ({ name, time, date, category }) => {
  // Format the date to be more readable
  const formatDate = (dateString) => {
    const taskDate = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    if (taskDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (taskDate.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else if (taskDate < nextWeek) {
      // Return the day of the week
      return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][taskDate.getDay()];
    } else {
      // Return formatted date
      return taskDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };
  
  return (
    <div className={`task-item upcoming-task ${category}`}>
      <span>{name}</span>
      <div className="task-details">
        <span className="task-time">{time}</span>
        <span className="task-date">{formatDate(date)}</span>
      </div>
    </div>
  );
};

// Upcoming Events component
const UpcomingEvents = ({ tasks }) => {
  const today = new Date().toISOString().split('T')[0];
  
  // Get tasks with future dates, sorted by date
  const futureTasks = tasks
    .filter(task => task.date > today && !task.completed)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5); // Show only next 5 upcoming tasks
  
  return (
    <div className="upcoming-events">
      {futureTasks.length === 0 ? (
        <div className="no-tasks">No upcoming events</div>
      ) : (
        futureTasks.map(task => (
          <TaskItem 
            key={task.id} 
            name={task.name} 
            time={task.time} 
            date={task.date}
            category={task.category}
          />
        ))
      )}
    </div>
  );
};

// Calendar component
const Calendar = ({ tasks, setTasks }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [newTask, setNewTask] = useState('');
  const [newTime, setNewTime] = useState('');
  const [category, setCategory] = useState('professional');

  // Get current month and year
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get day of week of first day of month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  // Get number of days in current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  // Previous month
  const prevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };
  
  // Next month
  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };
  
  // Handle date click to open modal
  const handleDateClick = (day) => {
    const clickedDate = new Date(currentYear, currentMonth, day);
    const dateString = clickedDate.toISOString().split('T')[0];
    setSelectedDate(dateString);
    setNewTask('');
    setNewTime('');
    setCategory('professional');
    setShowTaskModal(true);
  };
  
  // Add task from calendar
  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim() || !selectedDate) return;
    
    const task = {
      id: Date.now(),
      name: newTask,
      time: newTime || '',
      date: selectedDate,
      category,
      completed: false
    };
    
    setTasks([...tasks, task]);
    setNewTask('');
    setNewTime('');
    setShowTaskModal(false);
  };
  
  // Get tasks for a specific day
  const getTasksForDay = (day) => {
    const dateString = new Date(currentYear, currentMonth, day).toISOString().split('T')[0];
    return tasks.filter(task => task.date === dateString);
  };
  
  // Get current month name
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  // Calendar grid
  const renderCalendarDays = () => {
    const days = [];
    
    // Add empty cells for days before the first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayTasks = getTasksForDay(day);
      const isToday = new Date().getDate() === day && 
                      new Date().getMonth() === currentMonth && 
                      new Date().getFullYear() === currentYear;
      
      days.push(
        <div 
          key={`day-${day}`} 
          className={`calendar-day ${isToday ? 'today' : ''}`}
          onClick={() => handleDateClick(day)}
        >
          <div className="day-number">{day}</div>
          <div className="day-tasks">
            {dayTasks.slice(0, 3).map(task => (
              <div 
                key={task.id} 
                className={`day-task ${task.category === 'professional' ? 'professional' : 'personal'}`}
                title={task.name}
              >
                {task.name.length > 15 ? task.name.substring(0, 15) + '...' : task.name}
              </div>
            ))}
            {dayTasks.length > 3 && (
              <div className="more-tasks">+{dayTasks.length - 3} more</div>
            )}
          </div>
        </div>
      );
    }
    
    return days;
  };
  
  return (
    <section id="calendar" className="calendar-section">
      <div className="calendar-container">
        <div className="calendar-header">
          <h2>Calendar - {currentYear}</h2>
          <div className="calendar-controls">
            <button onClick={prevMonth} className="month-nav-btn">&lt;</button>
            <h3>{monthNames[currentMonth]} {currentYear}</h3>
            <button onClick={nextMonth} className="month-nav-btn">&gt;</button>
          </div>
        </div>
        
        <div className="weekdays-header">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>
        
        <div className="calendar-grid">
          {renderCalendarDays()}
        </div>
      </div>
      
      {/* Task Modal */}
      {showTaskModal && (
        <div className="task-modal-overlay" onClick={() => setShowTaskModal(false)}>
          <div className="task-modal" onClick={e => e.stopPropagation()}>
            <h3>Add Task for {selectedDate}</h3>
            <form onSubmit={addTask}>
              <input
                type="text"
                placeholder="Task name"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                className="modal-input"
                autoFocus
              />
              <input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="modal-input"
              />
              <div className="category-selector">
                <div className="category-label">Category:</div>
                <div className="category-options">
                  <label className="category-option">
                    <input
                      type="radio"
                      name="category"
                      value="professional"
                      checked={category === 'professional'}
                      onChange={() => setCategory('professional')}
                    />
                    <span className="category-name professional">Professional</span>
                  </label>
                  <label className="category-option">
                    <input
                      type="radio"
                      name="category"
                      value="personal"
                      checked={category === 'personal'}
                      onChange={() => setCategory('personal')}
                    />
                    <span className="category-name personal">Personal</span>
                  </label>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowTaskModal(false)}>Cancel</button>
                <button type="submit">Add Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

const App = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('workeaseTasks');
    return savedTasks ? JSON.parse(savedTasks) : [
      { id: 1, name: "Complete project proposal", time: "14:00", date: new Date().toISOString().split('T')[0], category: "professional", completed: false },
      { id: 2, name: "Team meeting", time: "15:30", date: new Date().toISOString().split('T')[0], category: "professional", completed: false },
      { id: 3, name: "Review code changes", time: "17:00", date: new Date().toISOString().split('T')[0], category: "professional", completed: false },
      { id: 4, name: "Go for a run", time: "18:30", date: new Date().toISOString().split('T')[0], category: "personal", completed: false },
      { id: 5, name: "Call mom", time: "20:00", date: new Date().toISOString().split('T')[0], category: "personal", completed: false },
      // Add some future tasks as examples
      { id: 6, name: "Client presentation", time: "10:00", date: new Date(Date.now() + 86400000).toISOString().split('T')[0], category: "professional", completed: false },
      { id: 7, name: "Project deadline", time: "17:00", date: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0], category: "professional", completed: false },
      { id: 8, name: "Team building event", time: "13:00", date: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0], category: "personal", completed: false }
    ];
  });

  return (
    <div className="dashboard">
      <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />
      <ParticleBackground />
      
      <div id="dashboard" className="dashboard-content">
        <h1 className="dashboard-title text-center">
          WorkEase Dashboard
        </h1>
        
        <div className="dashboard-grid">
          <DashboardCard title="Task Management" icon="📋" className="tasks-card">
            <TodoList tasks={tasks} setTasks={setTasks} />
          </DashboardCard>
          
          <DashboardCard title="Upcoming Events" icon="📅">
            <UpcomingEvents tasks={tasks} />
          </DashboardCard>
        </div>
      </div>
      
      <Calendar tasks={tasks} setTasks={setTasks} />
    </div>
  );
};

export default App; 