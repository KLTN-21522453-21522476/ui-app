import React from 'react';
import styled from 'styled-components';
import { MdOutlineExpandMore } from 'react-icons/md';

interface GroupActionsSidebarProps {
  expanded: boolean;
  onCollapse: () => void;
  groupName?: string;
}

const SidebarContainer = styled.div<{ expanded: boolean }>`
  width: ${({ expanded }) => (expanded ? '250px' : '0')};
  transition: width 0.3s;
  background: #23263a;
  color: #a0a3b8;
  height: 100vh;
  display: ${({ expanded }) => (expanded ? 'flex' : 'none')};
  flex-direction: column;
`;

const ActionList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
`;

const ActionItem = styled.li`
  padding: 16px 24px;
  cursor: pointer;
  &:hover {
    background: rgba(255,255,255,0.08);
    color: #fff;
  }
`;

const CollapseButton = styled.button`
  background: none;
  border: none;
  color: #a0a3b8;
  padding: 8px;
  cursor: pointer;
  font-size: 20px;
  align-self: flex-end;
`;

const GroupActionsSidebar: React.FC<GroupActionsSidebarProps> = ({ expanded, onCollapse, groupName }) => (
  <SidebarContainer expanded={expanded}>
    <CollapseButton onClick={onCollapse} title="Collapse">
      <MdOutlineExpandMore style={{ transform: 'rotate(180deg)' }} />
    </CollapseButton>
    <div style={{ padding: '16px', fontWeight: 'bold', fontSize: '18px' }}>{groupName ? groupName : 'Group Actions'}</div>
    <ActionList>
      <ActionItem>Dashboard</ActionItem>
      <ActionItem>Upload Invoice</ActionItem>
    </ActionList>
  </SidebarContainer>
);

export default GroupActionsSidebar;
