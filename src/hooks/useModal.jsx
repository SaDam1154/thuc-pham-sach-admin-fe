import { useContext, useEffect, useRef, useState } from 'react';
import { ModalContext } from '../components/ModalProvider';
export default function useModal({ modal, meta }) {
    const { modalState, setModalState } = useContext(ModalContext);
    const [isOpen, setIsOpen] = useState(false);
    const [extraMeta, setExtraMeta] = useState({});
    const modalIdRef = useRef(0);
    const elem = modal({
        open,
        close,
        meta: {
            ...meta,
            ...extraMeta,
        },
    });

    useEffect(() => {
        if (isOpen) {
            setModalState((prev) => ({
                id: prev.id,
                modals: [
                    ...prev.modals,
                    {
                        id: modalIdRef.current,
                        element: elem,
                    },
                ],
            }));
        } else {
            setModalState((prev) => ({
                id: prev.id,
                modals: prev.modals.filter((m) => m.id !== modalIdRef.current),
            }));
        }
    }, [isOpen]);

    function open(extraMeta = {}) {
        setExtraMeta({ ...extraMeta });
        setIsOpen(true);
    }

    function close() {
        setIsOpen(false);
    }

    useEffect(() => {
        modalIdRef.current = modalState.id + 1;
        setModalState((prev) => ({
            ...prev,
            id: modalIdRef.current + 1,
        }));
    }, []);

    return [open, close];
}
