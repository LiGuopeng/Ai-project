import { CheckSquare, CircleHelp, LayoutDashboard, Settings, Sparkles } from 'lucide-react'

interface SidebarProps {
    activeCount: number
    onAllTodos: () => void
}

export function Sidebar({ activeCount, onAllTodos }: SidebarProps) {
    return (
        <aside className="sidebar">
            <div className="brand">
                <div className="brand-mark">
                    <Sparkles size={18} strokeWidth={2.5} />
                </div>
                <span>noto</span>
            </div>

            <nav className="sidebar-nav" aria-label="主导航">
                <button className="nav-item nav-item-active" onClick={onAllTodos} type="button">
                    <LayoutDashboard size={18} />
                    <span>我的清单</span>
                    <strong>{activeCount}</strong>
                </button>
                <button className="nav-item" type="button">
                    <CheckSquare size={18} />
                    <span>已完成</span>
                </button>
            </nav>

            <div className="sidebar-bottom">
                <button className="nav-item" type="button">
                    <Settings size={18} />
                    <span>设置</span>
                </button>
                <button className="nav-item" type="button">
                    <CircleHelp size={18} />
                    <span>帮助中心</span>
                </button>
                <div className="profile-card">
                    <div className="avatar">L</div>
                    <div>
                        <strong>Li Guopeng</strong>
                        <span>专注每一天</span>
                    </div>
                    <button aria-label="打开个人菜单" className="profile-menu" type="button">
                        ···
                    </button>
                </div>
            </div>
        </aside>
    )
}
