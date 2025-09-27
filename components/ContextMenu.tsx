import React, { useEffect, useRef } from 'react';

export interface MenuItem {
    label: string;
    onClick: () => void;
    disabled?: boolean;
}

interface ContextMenuProps {
    x: number;
    y: number;
    items: MenuItem[];
    onClose: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, items, onClose }) => {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    return (
        <div
            ref={menuRef}
            style={{ top: y, left: x }}
            className="absolute z-50 bg-[var(--color-bg-secondary)] border border-[var(--color-border-primary)] rounded-md shadow-lg py-1 text-sm"
        >
            {items.map((item, index) => (
                <button
                    key={index}
                    onClick={() => {
                        item.onClick();
                        onClose();
                    }}
                    disabled={item.disabled}
                    className="block w-full text-left px-4 py-1.5 text-[var(--color-text-primary)] hover:bg-[var(--color-bg-accent)] hover:text-[var(--color-text-accent)] disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-[var(--color-text-primary)]"
                >
                    {item.label}
                </button>
            ))}
        </div>
    );
};

export default ContextMenu;
