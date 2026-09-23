import { Plus } from 'lucide-react'
import { type FormEvent, useState } from 'react'

import { Button, Input } from '@todo-list/react'

interface TodoInputProps {
    onAdd: (title: string) => Promise<void>
}

export function TodoInput({ onAdd }: TodoInputProps) {
    const [title, setTitle] = useState('')

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (!title.trim()) {
            return
        }
        await onAdd(title)
        setTitle('')
    }

    return (
        <form className="todo-input-row" onSubmit={handleSubmit}>
            <Input
                aria-label="输入新的待办事项"
                onChange={event => setTitle(event.target.value)}
                placeholder="接下来要完成什么？"
                value={title}
            />
            <Button type="submit">
                <Plus size={18} />
                添加任务
            </Button>
        </form>
    )
}
