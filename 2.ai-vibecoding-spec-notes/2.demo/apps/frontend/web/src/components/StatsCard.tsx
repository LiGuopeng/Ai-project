import { ArrowUpRight, CheckCircle2, CircleDashed, ListTodo } from 'lucide-react'

interface StatsCardProps {
    activeCount: number
    completedCount: number
    totalCount: number
}

export function StatsCard({ activeCount, completedCount, totalCount }: StatsCardProps) {
    const progress = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100)

    return (
        <section className="stats-card">
            <div className="stats-card-heading">
                <div>
                    <p className="eyebrow">今日概览</p>
                    <h2>保持你的节奏</h2>
                </div>
                <div className="stats-arrow">
                    <ArrowUpRight size={18} />
                </div>
            </div>
            <div className="progress-track">
                <span style={{ width: `${progress}%` }} />
            </div>
            <div className="stats-summary">
                <strong>{progress}%</strong>
                <span>今日完成度</span>
            </div>
            <div className="stats-grid">
                <div>
                    <ListTodo size={17} />
                    <strong>{totalCount}</strong>
                    <span>全部任务</span>
                </div>
                <div>
                    <CircleDashed size={17} />
                    <strong>{activeCount}</strong>
                    <span>待完成</span>
                </div>
                <div>
                    <CheckCircle2 size={17} />
                    <strong>{completedCount}</strong>
                    <span>已完成</span>
                </div>
            </div>
        </section>
    )
}
