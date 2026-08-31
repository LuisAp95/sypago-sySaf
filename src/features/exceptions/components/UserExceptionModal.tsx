import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { cn } from '@/utils/cn';

interface ExceptionRule {
    id: string;
    days: { l: boolean; m: boolean; x: boolean; j: boolean; v: boolean; s: boolean; d: boolean };
    exceptionTitle: string;
    ops: number;
}

interface UserExceptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: any | null; // The selected user object
    onSave: (data: any) => void;
}

const DayPill = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
    <button
        type="button"
        onClick={onClick}
        className={cn(
            "flex items-center justify-center w-8 h-8 rounded-full text-[13px] font-medium transition-colors",
            active 
                ? "bg-[#265e56] text-white" 
                : "bg-[#1F1F21] text-gray-400 hover:bg-[#2b2f3d]"
        )}>
        {label}
    </button>
);

export const UserExceptionModal: React.FC<UserExceptionModalProps> = ({
    isOpen,
    onClose,
    user,
    onSave
}) => {
    const [status, setStatus] = useState('Activo');
    const [alias, setAlias] = useState('');

    // This state holds the rows of exceptions inside the modal
    const [exceptionRules, setExceptionRules] = useState<ExceptionRule[]>([]);

    const exceptionOptions = [
        { label: 'Horario Especial 5/12', value: 'Horario Especial 5/12' },
        { label: 'No laborable', value: 'No laborable' },
        { label: 'Cliente especial', value: 'Cliente especial' },
    ];

    useEffect(() => {
        if (user) {
            setStatus(user.status || 'Activo');
            setAlias(user.alias || '');
            
            if (user.exceptionRules && user.exceptionRules.length > 0) {
                setExceptionRules(user.exceptionRules);
            } else {
                const hasAnyDay = Object.values(user.days || {}).some(v => v);
                if (hasAnyDay) {
                    setExceptionRules([{
                        id: Date.now().toString(),
                        days: { ...user.days },
                        exceptionTitle: 'Horario Especial 5/12',
                        ops: user.ops || 5
                    }]);
                } else {
                    setExceptionRules([]);
                }
            }
        } else {
            setStatus('Activo');
            setAlias('');
            setExceptionRules([]);
        }
    }, [user, isOpen]);

    const handleToggleStatus = () => {
        setStatus(prev => prev === 'Activo' ? 'Inactivo' : 'Activo');
    };

    const handleAddRule = () => {
        setExceptionRules(prev => [
            ...prev,
            {
                id: Date.now().toString(),
                days: { l: false, m: false, x: false, j: false, v: false, s: false, d: false },
                exceptionTitle: exceptionOptions[0].value,
                ops: 5
            }
        ]);
    };

    const handleToggleDay = (ruleId: string, dayKey: keyof ExceptionRule['days']) => {
        setExceptionRules(prev => prev.map(rule => {
            if (rule.id === ruleId) {
                return {
                    ...rule,
                    days: {
                        ...rule.days,
                        [dayKey]: !rule.days[dayKey]
                    }
                };
            }
            return rule;
        }));
    };

    const handleChangeException = (ruleId: string, value: string) => {
        setExceptionRules(prev => prev.map(rule => {
            if (rule.id === ruleId) {
                return { ...rule, exceptionTitle: value };
            }
            return rule;
        }));
    };

    const handleChangeOps = (ruleId: string, opsValue: any) => {
        setExceptionRules(prev => prev.map(rule => {
            if (rule.id === ruleId) {
                return { ...rule, ops: opsValue };
            }
            return rule;
        }));
    };

    const handleUpdate = () => {
        const combinedDays = exceptionRules.reduce((acc, rule) => {
            return {
                l: acc.l || rule.days.l,
                m: acc.m || rule.days.m,
                x: acc.x || rule.days.x,
                j: acc.j || rule.days.j,
                v: acc.v || rule.days.v,
                s: acc.s || rule.days.s,
                d: acc.d || rule.days.d,
            };
        }, { l: false, m: false, x: false, j: false, v: false, s: false, d: false });

        onSave({
            ...(user || {}),
            alias: user ? user.alias : (alias.trim() || 'Nuevo Comercio'),
            document: user?.document || 'V-12345678',
            group: user?.group || 'General',
            status,
            days: combinedDays,
            exceptionRules,
            lastModified: new Date().toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })
        });
        onClose();
    };

    const title = user ? (
        user.alias
    ) : (
        <input
            type="text"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            placeholder="Nombre del Comercio"
            className="bg-[#2a2c33] border border-[#363842] text-center text-lg font-bold text-gray-100 focus:outline-none focus:border-[#52c6b4] rounded-xl px-4 py-1 max-w-xs transition-colors"
        />
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size="5xl"
            bodyClassName="p-8 gap-8 bg-[#1F1F21]"
            className="bg-[#1F1F21] border border-[#2b2f3d]"
        >
            <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-6">
                        <span className="text-sm font-semibold text-gray-200">Estado</span>
                        <button
                            onClick={handleToggleStatus}
                            className={cn(
                                "flex items-center gap-2 rounded-full pl-3 pr-1 py-1 transition-colors border",
                                status === 'Activo' 
                                    ? "bg-[#265e56] border-[#2c6e65]" 
                                    : "bg-[#2b2f3d] border-[#393738] hover:bg-[#3b3f4d]"
                            )}
                        >
                            <span className={cn(
                                "text-[13px] font-medium tracking-wide",
                                status === 'Activo' ? "text-[#52c6b4]" : "text-gray-400"
                            )}>
                                {status}
                            </span>
                            <div
                                className={cn(
                                    "w-5 h-5 rounded-full transition-transform",
                                    status === 'Activo' ? "bg-[#a1bfb9]" : "bg-gray-500"
                                )}
                            />
                        </button>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-[15px] font-semibold text-gray-200">Excepciones</h3>
                        <button
                            type="button"
                            onClick={handleAddRule}
                            className="bg-[#2a2c33] border border-[#363842] hover:bg-[#343741] text-gray-300 text-xs font-medium px-5 py-1.5 rounded-lg transition-colors cursor-pointer"
                        >
                            Agregar
                        </button>
                    </div>

                    <div className="flex flex-col gap-3">
                        {exceptionRules.map((rule) => (
                            <div key={rule.id} className="flex items-center bg-[#2A292A] border border-transparent rounded-xl p-4 gap-6">
                                <span className="text-sm font-semibold text-gray-100">Días de la semana:</span>
                                <div className="flex items-center gap-2">
                                    <DayPill label="L" active={rule.days.l} onClick={() => handleToggleDay(rule.id, 'l')} />
                                    <DayPill label="M" active={rule.days.m} onClick={() => handleToggleDay(rule.id, 'm')} />
                                    <DayPill label="M" active={rule.days.x} onClick={() => handleToggleDay(rule.id, 'x')} />
                                    <DayPill label="J" active={rule.days.j} onClick={() => handleToggleDay(rule.id, 'j')} />
                                    <DayPill label="V" active={rule.days.v} onClick={() => handleToggleDay(rule.id, 'v')} />
                                    <DayPill label="S" active={rule.days.s} onClick={() => handleToggleDay(rule.id, 's')} />
                                    <DayPill label="D" active={rule.days.d} onClick={() => handleToggleDay(rule.id, 'd')} />
                                </div>

                                <div className="flex items-center gap-4 ml-auto">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-400 font-medium whitespace-nowrap">Opm:</span>
                                        <input
                                            type="number"
                                            min="0"
                                            step="1"
                                            value={rule.ops ?? 5}
                                            onKeyDown={(e) => {
                                                if (['-', '+', 'e', 'E', '.', ','].includes(e.key)) {
                                                    e.preventDefault();
                                                }
                                            }}
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value, 10);
                                                if (e.target.value === '') {
                                                    handleChangeOps(rule.id, '' as any);
                                                } else if (!isNaN(val)) {
                                                    handleChangeOps(rule.id, Math.max(0, val));
                                                }
                                            }}
                                            onBlur={(e) => {
                                                const val = parseInt(e.target.value, 10);
                                                if (isNaN(val) || val < 0) {
                                                    handleChangeOps(rule.id, 0);
                                                }
                                            }}
                                            className="bg-[#1F1F21] border border-[#363842] text-xs text-gray-200 font-semibold text-center w-16 py-1.5 rounded-lg focus:outline-none focus:border-[#52c6b4] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-400 font-medium whitespace-nowrap">Excepción:</span>
                                        <div className="w-48">
                                            <Select
                                                options={exceptionOptions}
                                                value={rule.exceptionTitle}
                                                onChange={(val) => handleChangeException(rule.id, val)}
                                                className="bg-[#1F1F21] border-transparent text-xs text-gray-200 focus:ring-0 rounded-lg py-1"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {exceptionRules.length === 0 && (
                            <div className="text-sm text-gray-500 text-center py-4 border border-dashed border-[#2b2f3d] rounded-xl">
                                No hay excepciones configuradas.
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-center mt-8 pb-4">
                    <button
                        type="button"
                        onClick={handleUpdate}
                        className="bg-[#2a2c33] hover:bg-[#343741] border border-[#363842] text-gray-300 text-sm font-semibold px-8 py-2.5 rounded-xl transition-all cursor-pointer"
                    >
                        Actualizar
                    </button>
                </div>
            </div>
        </Modal>
    );
};
