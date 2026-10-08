import { Bell, CircleHelp } from 'lucide-react'

export function Topbar() {
    return (
        <header className="topbar">
            <p>Good morning, Alex</p>
            <div className="topbar-actions">
                <button aria-label="Help" className="icon-button" type="button">
                    <CircleHelp size={19} />
                </button>
                <button aria-label="Notifications" className="icon-button" type="button">
                    <Bell size={19} />
                </button>
                <div className="header-avatar" />
            </div>
        </header>
    )
}
