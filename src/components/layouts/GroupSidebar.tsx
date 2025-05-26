import React from 'react';
import styled from 'styled-components';
import { MdOutlineExpandMore } from 'react-icons/md';

interface GroupSidebarProps {
  groups: { id: string; name: string }[];
  selectedGroupId: string | null;
  expanded: boolean;
  onGroupSelect: (groupId: string) => void;
  onExpand: () => void;
}

const SidebarContainer = styled.div<{ expanded: boolean }>`
  width: ${({ expanded }) => (expanded ? '250px' : '60px')};
  transition: width 0.3s;
  background: #1e2233;
  color: #a0a3b8;
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const GroupList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
`;

const GroupItem = styled.li<{ active: boolean }>`
  padding: 12px 20px;
  cursor: pointer;
  background: ${({ active }) => (active ? 'rgba(255,255,255,0.05)' : 'none')};
  color: ${({ active }) => (active ? '#fff' : '#a0a3b8')};
  &:hover {
    background: rgba(255,255,255,0.08);
  }
`;

const ExpandButton = styled.button`
  background: none;
  border: none;
  color: #a0a3b8;
  padding: 8px;
  cursor: pointer;
  font-size: 20px;
`;

const GroupSidebar: React.FC<GroupSidebarProps> = ({ groups, selectedGroupId, expanded, onGroupSelect, onExpand }) => (
  <SidebarContainer expanded={expanded}>
    <div style={{ padding: '16px', fontWeight: 'bold', fontSize: '18px' }}>Groups</div>
    <GroupList>
      {groups.map(group => (
        <GroupItem
          key={group.id}
          active={group.id === selectedGroupId}
          onClick={() => onGroupSelect(group.id)}
        >
          {expanded ? group.name : group.name.charAt(0).toUpperCase()}
        </GroupItem>
      ))}
    </GroupList>
    {!expanded && (
      <ExpandButton onClick={onExpand} title="Expand">
        <MdOutlineExpandMore />
      </ExpandButton>
    )}
  </SidebarContainer>
);

export default GroupSidebar;
