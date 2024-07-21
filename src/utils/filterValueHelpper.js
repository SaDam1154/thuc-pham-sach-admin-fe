export function setFilterValueHandler(key, dispatch) {
    return (prevState) => {
        const indexOfKey = prevState.findIndex((p) => p.id === key);
        let prevStateCopy = structuredClone(prevState);
        if (indexOfKey === -1) {
            return prevState;
        }
        let newStateValueOfKey;
        if (typeof dispatch === 'function') {
            newStateValueOfKey = dispatch(prevStateCopy[indexOfKey].value);
        } else {
            newStateValueOfKey = dispatch;
        }
        prevStateCopy[indexOfKey].value = newStateValueOfKey;
        return prevStateCopy;
    };
}

export function getFilterValue(key, state) {
    return state.find((p) => p.id === key)?.value;
}
