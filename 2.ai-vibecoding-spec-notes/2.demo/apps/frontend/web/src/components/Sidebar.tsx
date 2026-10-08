import { Archive, CalendarDays, Inbox, Layers3, Plus, Search, Star } from 'lucide-react'

interface SidebarProps {
    activeCount: number
    onAllTodos: () => void
    onCompleted: () => void
}

export function Sidebar({ activeCount, onAllTodos, onCompleted }: SidebarProps) {
    return (
        <aside className="sidebar">
            <div className="brand-row">
                <div className="brand-mark" />
                <span>focus</span>
            </div>

            <label className="sidebar-search">
                <Search size={16} />
                <input aria-label="Quick find" placeholder="Quick find" />
            </label>

            <nav className="sidebar-nav" aria-label="Primary navigation">
                <button className="nav-item" onClick={onAllTodos} type="button">
                    <Inbox size={17} />
                    <span>Inbox</span>
                    <small>7</small>
                </button>
                <button className="nav-item nav-item-active" onClick={onAllTodos} type="button">
                    <Star size={17} />
                    <span>Today</span>
                    <small>{activeCount}</small>
                </button>
                <button className="nav-item" type="button">
                    <CalendarDays size={17} />
                    <span>Upcoming</span>
                    <small>3</small>
                </button>
                <button className="nav-item" onClick={onAllTodos} type="button">
                    <Layers3 size={17} />
                    <span>Anytime</span>
                </button>
                <button className="nav-item" onClick={onCompleted} type="button">
                    <Archive size={17} />
                    <span>Someday</span>
                </button>
            </nav>

            <div className="sidebar-divider" />

            <section className="projects" aria-label="Projects">
                <div className="projects-heading">
                    <span>PROJECTS</span>
                    <Plus size={15} />
                </div>
                <div className="project-item">
                    <i className="project-dot project-dot-blue" />
                    Work
                </div>
                <div className="project-item">
                    <i className="project-dot project-dot-orange" />
                    Personal
                </div>
                <div className="project-item">
                    <i className="project-dot project-dot-green" />
                    Learning
                </div>
            </section>

            <div className="profile-card">
                <div className="avatar">A</div>
                <div>
                    <strong>Alex Morgan</strong>
                    <span>Personal workspace</span>
                </div>
            </div>
        </aside>
    )
}
