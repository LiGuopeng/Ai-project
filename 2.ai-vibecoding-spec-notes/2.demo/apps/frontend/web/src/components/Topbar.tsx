import { Bell, Search, Sun } from 'lucide-react'

export function Topbar() {
    return (
        <header className="topbar">
            <div>
                <p className="eyebrow">星期三，2026 年 9 月 23 日</p>
                <h1>
                    早上好，Li <span>👋</span>
                </h1>
            </div>
            <div className="topbar-actions">
                <button aria-label="搜索" className="icon-button" type="button">
                    <Search size={19} />
                </button>
                <button aria-label="通知" className="icon-button notification-button" type="button">
                    <Bell size={19} />
                    <i />
                </button>
                <button aria-label="切换主题" className="icon-button" type="button">
                    <Sun size={19} />
                </button>
            </div>
        </header>
    )
}
