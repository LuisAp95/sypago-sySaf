import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/mocks/api';
import { ViewHeader } from '@/components/ui/ViewHeader';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { DataRow, DataCol } from '@/components/ui/DataRow';
import { Loader } from '@/components/ui/Loader';
import { Eye } from 'lucide-react';
import { cn } from '@/utils/cn';
import { UserExceptionModal } from './UserExceptionModal';
import { auditService } from '@/features/administration';
import { exportUserExceptionsToPdf } from '@/utils/pdfGenerator';

const DayPill = ({ label, active }: { label: string, active: boolean }) => (
  <div className={cn(
    "flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold border",
    active ? "border-[#444347] text-white bg-[#333235]" : "border-transparent text-[#555457] bg-[#1a191b]"
  )}>
    {label}
  </div>
);

export const UserExceptions: React.FC = () => {
  const { data: exceptions, isLoading } = useQuery({
    queryKey: ['userExceptions'],
    queryFn: api.getUserExceptions
  });

  const [localExceptions, setLocalExceptions] = useState<any[]>([]);
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<any | null>(null);

  useEffect(() => {
    if (exceptions) {
      const saved = localStorage.getItem('userExceptions');
      if (saved) {
        setLocalExceptions(JSON.parse(saved));
      } else {
        setLocalExceptions(exceptions);
        localStorage.setItem('userExceptions', JSON.stringify(exceptions));
      }
    }
  }, [exceptions]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUserIds(new Set(localExceptions.map(e => e.id)));
    } else {
      setSelectedUserIds(new Set());
    }
  };

  const handleSelectUser = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedUserIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedUserIds(newSelected);
  };

  const handleEdit = () => {
    if (selectedUserIds.size === 1) {
      const id = Array.from(selectedUserIds)[0];
      const user = localExceptions.find(e => e.id === id);
      if (user) {
        setUserToEdit(user);
        setIsModalOpen(true);
      }
    } else if (selectedUserIds.size > 1) {
      alert("Por favor, seleccione solo un usuario para editar.");
    } else {
      alert("Por favor, seleccione un usuario para editar.");
    }
  };

  const handleSaveException = (updatedUser: any) => {
    const exists = localExceptions.some(ex => ex.id === updatedUser.id);
    const previous = exists ? localExceptions.find(ex => ex.id === updatedUser.id) : undefined;
    let newExceptions: any[];
    if (exists) {
      newExceptions = localExceptions.map(ex => ex.id === updatedUser.id ? updatedUser : ex);
    } else {
      const newUser = {
        id: updatedUser.id || Date.now().toString(),
        ...updatedUser
      };
      newExceptions = [newUser, ...localExceptions];
    }
    setLocalExceptions(newExceptions);
    localStorage.setItem('userExceptions', JSON.stringify(newExceptions));

    auditService.logSync({
      module: 'Excepciones Usuario',
      action: exists ? 'UPDATE' : 'CREATE',
      entityType: 'Excepción de Usuario',
      entityId: updatedUser.id || 'new',
      entityName: updatedUser.alias || updatedUser.document || updatedUser.id,
      details: exists
        ? `Excepción de usuario "${updatedUser.alias}" actualizada`
        : `Excepción de usuario "${updatedUser.alias}" creada`,
      previousValue: previous,
      newValue: updatedUser,
    });
  };

  return (
    <div className="flex flex-col h-full bg-secondary text-text-primary rounded-xl relative">
      <ViewHeader 
        showSearch 
        showFilter
        showAdd
        onAddClick={() => {
          setUserToEdit(null);
          setIsModalOpen(true);
        }}
        showCopy
        onCopyClick={() => exportUserExceptionsToPdf(localExceptions)}
      />

      <div className="flex-1 overflow-hidden flex flex-col gap-6">
        
        {/* List Actions */}
        <div className="flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Checkbox 
              id="selectAll" 
              checked={selectedUserIds.size === localExceptions.length && localExceptions.length > 0}
              onCheckedChange={handleSelectAll}
            />
            <label htmlFor="selectAll" className="text-sm cursor-pointer text-text-primary">Seleccionar Todos</label>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={handleEdit}>Editar</Button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto pr-2 px-6 pb-6">
          {isLoading ? (
            <Loader text="Cargando excepciones..." size="md" />
          ) : (
            localExceptions.map((item) => (
              <DataRow 
                key={item.id} 
                className="gap-6 mb-2 cursor-pointer pr-4"
                onDoubleClick={() => {
                  setUserToEdit(item);
                  setIsModalOpen(true);
                }}
              >
                <DataCol className="w-[5%] pl-4">
                  <Checkbox 
                    checked={selectedUserIds.has(item.id)}
                    onCheckedChange={(checked) => handleSelectUser(item.id, checked as boolean)}
                  />
                </DataCol>
                <DataCol className="w-[18%]">{item.alias}</DataCol>
                <DataCol className="w-[15%]">{item.document}</DataCol>
                <DataCol className="w-[12%]">
                  <Badge variant={item.status.toLowerCase() as any}>{item.status}</Badge>
                </DataCol>
                <DataCol className="w-[12%]">{item.group}</DataCol>
                
                <DataCol className="w-[20%]">
                  <div className="flex items-center gap-1">
                    <DayPill label="L" active={item.days?.l} />
                    <DayPill label="M" active={item.days?.m} />
                    <DayPill label="M" active={item.days?.x} />
                    <DayPill label="J" active={item.days?.j} />
                    <DayPill label="V" active={item.days?.v} />
                    <DayPill label="S" active={item.days?.s} />
                    <DayPill label="D" active={item.days?.d} />
                  </div>
                </DataCol>

                <DataCol className="flex-1 min-w-[150px]">{item.lastModified}</DataCol>
                
                <div className="w-[1px] h-12 bg-[#333235] mx-4" />
                
                <DataCol className="w-[8%] flex-row items-center h-full justify-center pr-2">
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="w-10 h-10 rounded-full bg-transparent border-transparent hover:bg-[#333235] text-[#9E9D9F] hover:text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      setUserToEdit(item);
                      setIsModalOpen(true);
                    }}
                  >
                    <Eye className="w-6 h-6" />
                  </Button>
                </DataCol>
              </DataRow>
            ))
          )}
        </div>
      </div>

      <UserExceptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={userToEdit}
        onSave={handleSaveException}
      />
    </div>
  );
};
