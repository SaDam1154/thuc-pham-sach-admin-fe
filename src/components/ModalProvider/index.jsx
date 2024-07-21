import { createContext, useState } from 'react';

export const ModalContext = createContext({
    modalState: {
        id: 0,
        modals: [],
    },
    setModalState: () => {},
});

export default function ModalProvider({ children }) {
    const [modalState, setModalState] = useState({
        id: 0,
        modals: [],
    });

    return (
        <ModalContext.Provider
            value={{
                modalState,
                setModalState,
            }}
        >
            {children}
            {modalState.modals.map((modal) => (
                <div className="fixed inset-0" key={modal.id}>
                    {modal.element}
                </div>
            ))}
        </ModalContext.Provider>
    );
}
