import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

import defaultTasks from './tasks';

let userTasks: User[];

const Container = styled.section`
  display: grid;

  grid-gap: 25px;
  grid-template-columns: 1fr 1fr 1fr 1fr;
`;

const Column = styled.div`
  display: inline-block;
  border-radius: 4px;
`;

const ColumnName = styled.h6`
  display: block;
  text-align: center;
  color: white;
  height: 30px;
  padding: .25rem 0 .2rem;
  font-size: 1rem;
  border-radius: 4px;
`;

const moveTaskTo = (user: number, direction: -1 | 1, task: number) => {
  return () => {
    let [taskText] = userTasks[user].tasks.splice(task, 1);
    userTasks[user + direction].tasks.push(taskText);
    render();
  }
};

const MoveTask = ({ user, direction, task }) => {
  let moveRight = direction === 1;
  return <span
    className={moveRight ? 'move-right' : 'move-left'}
    onClick={moveTaskTo(user, direction, task)}
  >
    {moveRight ? '>' : '<'}
  </span>
};

const completeTask = (user: number, task: number) => {
  return () => {
    userTasks[user].tasks.splice(task, 1);
    render();
  }
};

const Task = ({ disabled, user, task, children, ...props }) => {
  return <li {...props}>
    {disabled !== 'left' && <MoveTask user={user} direction={-1} task={task} />}
    <span onClick={completeTask(user, task)}>{children}</span>
    {disabled !== 'right' && <MoveTask user={user} direction={1} task={task} />}
  </li>
};

const StyledTask = styled(Task)`
  background-color: white;
  padding: 0.5em;
  margin-bottom: 0.5em;
  padding: 14px 8px 12px 8px;
  border-radius: 4px;
`;

interface User {
  displayName: string,
  favoriteColor: string,
  tasks: string[],
}

const addTaskTo = user => {
  return () => {
    const task = window.prompt(`What task would you like to add for ${userTasks[user].displayName}?`);

    if (task) {
      userTasks[user].tasks.push(task);
      render();
    }
  }
};

const AddTask = ({ user }) => {
  return <span
    className="add-task"
    onClick={addTaskTo(user)}
  >
    + Add a card
  </span>
};

function loadData() {
  let serializedTasks = localStorage.getItem('kanban-data');

  if (serializedTasks) {
    try {
      userTasks = JSON.parse(serializedTasks);
    } catch (e) {
      alert('Oh no you broke it!');
    }
  } else {
    userTasks = defaultTasks;
  }
}

function render() {
  ReactDOM.render(
    <Container>
      {
        userTasks.map((user, userId) => {
          const disabled =
            userId === 0
              ? 'left'
              : userId === userTasks.length - 1
                ? 'right'
                : 'none';

          return <Column key={userTasks[userId].displayName}>
            <ColumnName style={{ backgroundColor: user.favoriteColor }}>{user.displayName}</ColumnName>
            <ol className="task-list">
              {
                user.tasks.map((task, taskId) =>
                  <StyledTask
                    key={`${user.displayName}-${taskId}`}
                    disabled={disabled}
                    user={userId}
                    task={taskId}
                  >
                    {task}
                  </StyledTask>
                )
              }
            </ol>
            <AddTask user={userId} />
          </Column>
        })
      }
    </Container>,
    document.querySelector('#react-app-root')
  );

  localStorage.setItem('kanban-data', JSON.stringify(userTasks));
}

loadData();
render();
