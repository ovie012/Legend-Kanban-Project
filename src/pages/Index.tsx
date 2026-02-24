import { useState } from 'react';
import { Coffee, Shield, ChevronDown } from 'lucide-react';
import { Board } from '@/features/board/components/Board';
import { PresenceBar } from '@/features/presence/PresenceBar';
import { OfflineBadge } from '@/offline/OfflineBadge';
import { usePermissions } from '@/permissions/usePermissions';
import type { Role } from '@/features/board/types';
import styled from 'styled-components';

const CoffeeLogo = styled.img`
  width: 100%;
  height: 100%;
`;

const CoffeeLogoCover = styled.div`
  width: 42px;
  height: 42px;
  border: 1px solid brown;
  overflow: hidden;
  border-radius: 10px;
  background-color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SelectWrapper = styled.div`
  position: relative;
  /* width: 160px; */
  font-size: 14px;
  border-radius: 8px;
  background: #ffe3e3;
`

const SelectButton = styled.button`
  width: 100%;
  padding: 8px 10px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`

const Dropdown = styled.ul`
  position: absolute;
  top: 110%;
  left: 0;
  width: 100%;
  background: white;
  border-radius: 8px;
  padding: 4px 0;
  margin: 0;
  list-style: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
`

const Option = styled.li`
  padding: 8px 10px;
  cursor: pointer;

  &:hover {
    background: #f4f4f5;
  }
`

const roles: { value: Role; label: string }[] = [
  { value: 'admin', label: 'Admin' },
  { value: 'editor', label: 'Editor' },
  { value: 'viewer', label: 'Viewer' },
];

const Index = () => {
  const [open, setOpen] = useState(false)

  const role = usePermissions(s => s.role);
  const setRole = usePermissions(s => s.setRole);
  const selected = roles.find(r => r.value === role)
  
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-3 sm:px-6 py-3 sm:py-3.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-3">
          <CoffeeLogoCover>
            <CoffeeLogo src="/logo.png" alt="Coffee Logo" />
          </CoffeeLogoCover>
          <div>
            <h1 className="text-lg sm:text-xl font-display text-foreground leading-tight">BrewBoard</h1>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Real-time Kanban</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <OfflineBadge />
          <div className="hidden sm:block">
            <PresenceBar />
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 pl-2 sm:pl-4 border-l border-border">
            <Shield className="w-4 h-4 text-muted-foreground" />
            <SelectWrapper>
              <SelectButton onClick={() => setOpen(prev => !prev)}>
                {selected?.label}
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </SelectButton>

              {open && (
                <Dropdown>
                  {roles.map(r => (
                    <Option
                      key={r.value}
                      onClick={() => {
                        setRole(r.value)
                        setOpen(false)
                      }}
                    >
                      {r.label}
                    </Option>
                  ))}
                </Dropdown>
              )}
            </SelectWrapper>
          </div>
        </div>
      </header>

      <main className="p-3 sm:p-6">
        <Board />
      </main>
      {role === 'viewer' && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-semibold shadow-lg animate-fade-in">
          Viewing as read-only
        </div>
      )}
    </div>
  );
};

export default Index;
