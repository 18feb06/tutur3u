import { Accordion, Button, Loader } from '@mantine/core';
import { TaskList } from '../../../types/primitives/TaskList';
import React from 'react';
import TaskListAccordionControl from './TaskListAccordionControl';
import { Task } from '../../../types/primitives/Task';
import useSWR, { mutate } from 'swr';
import { PlusIcon } from '@heroicons/react/24/solid';
import { openModal } from '@mantine/modals';
import TaskEditForm from '../../forms/TaskEditForm';
import TaskWrapper from '../core/TaskWrapper';
import { Workspace } from '../../../types/primitives/Workspace';

export interface TaskListWrapperProps {
  ws: Workspace;
  boardId: string;
  list: TaskList;
}

const TaskListWrapper = ({ ws, boardId, list }: TaskListWrapperProps) => {
  const buildQuery = (listId: string) => {
    let query = `/api/workspaces/${ws.id}/boards/${boardId}/lists/${listId}/tasks`;

    return query;
  };

  const resync = () => {
    if (!list?.id) return;
    mutate(buildQuery(list.id));
  };

  const { data: tasks, error: tasksError } = useSWR<Task[] | null>(
    list?.id ? buildQuery(list.id) : null
  );

  const isLoading = !tasks && !tasksError;

  const showAddTaskModal = () => {
    openModal({
      title: 'Add task',
      centered: true,
      size: 'xl',
      children: <TaskEditForm listId={list.id} onUpdated={resync} />,
    });
  };

  return (
    <Accordion.Item
      key={list.id}
      value={list.id}
      className="border-transparent"
    >
      <TaskListAccordionControl ws={ws} boardId={boardId} list={list}>
        <div className="line-clamp-1 font-semibold">
          {list.name || 'Untitled List'}
        </div>
      </TaskListAccordionControl>

      <Accordion.Panel>
        {isLoading ? (
          <div className="flex justify-center px-4 py-8">
            <Loader size="lg" />
          </div>
        ) : (
          <div className="grid gap-2">
            {tasks &&
              tasks.map((task) => (
                <TaskWrapper
                  key={task.id}
                  task={task}
                  listId={list.id}
                  onUpdated={resync}
                />
              ))}
            <Button
              className="flex items-center gap-2 rounded border border-zinc-300/10 p-2 text-sm font-semibold text-zinc-400 hover:bg-zinc-300/5"
              onClick={() => showAddTaskModal()}
              leftIcon={<PlusIcon className="w-5" />}
            >
              Task
            </Button>
          </div>
        )}
      </Accordion.Panel>
    </Accordion.Item>
  );
};

export default TaskListWrapper;
